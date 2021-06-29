import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import { User } from './../../models/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-captura-de-datos',
  templateUrl: './captura-de-datos.component.html',
  styleUrls: ['./captura-de-datos.component.css']
})

export class CapturaDeDatosComponent implements OnInit, OnDestroy {
  form: FormGroup; //variable to group our form
  subscription: Subscription;
  user: User;
  idUser = 0;

  constructor(private fb: FormBuilder,
    private UserService: UserService,
    private toastr: ToastrService) { 

    this.form = this.fb.group({//this will help us to create the form and some validations
      id:0,
      nombre: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      direccion: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      telefono: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      curp: ['',
      [
        Validators.required,
        Validators.pattern("^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$"),
        Validators.minLength(18), 
        Validators.maxLength(18),
      ]]
    })
   }

  ngOnInit(): void { 
    this.UserService.getUser$().subscribe(data =>{//this will help us to fill the fields dynamically from the component "base-de-datos"
      this.user = data;
      this.form.patchValue({
        nombre: this.user.nombre,
        direccion: this.user.direccion,
        telefono: this.user.telefono,
        curp: this.user.curp,
      });
      this.idUser = this.user.id;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  //when valid data is in the form we avaluate if it's an edit or a new record
  onSubmit(){
    if(this.idUser === 0 || this.idUser === undefined){
      this.addUser();
    }
    else
    {
      this.editUser();
    }   
  }

  //method used to add new users.
  addUser(){
    const user: User ={
      nombre: this.form.get('nombre')?.value,
      direccion: this.form.get('direccion')?.value,
      telefono: this.form.get('telefono')?.value,
      curp: this.form.get('curp')?.value,
    }

    this.UserService.addUser(user).subscribe(data =>{
      this.toastr.success('El usuario fue registrado existosamente', 'Usuario Registrado');
      this.UserService.getUsers();
      this.form.reset();
    }, error => {
      this.toastr.error('El usuario no se pudo registrar.', 'Error registrado usuario');
      console.log(error);
    });
  }

  //method used to edit existing user.
  editUser(){
    const user: any ={
      id: this.user.id,
      nombre: this.form.get('nombre')?.value,
      direccion: this.form.get('direccion')?.value,
      telefono: this.form.get('telefono')?.value,
      curp: this.form.get('curp')?.value,
    }

    this.UserService.editUser(this.idUser, user).subscribe(data =>{
      this.toastr.success('El usuario fue actualizado existosamente', 'Usuario Actualizado');
      this.UserService.getUsers();
      this.form.reset();
      this.idUser = 0;
    }, error => {
      this.toastr.error('El usuario no se pudo actualizar.', 'Error actualizando usuario');
      console.log(error);
    });
  }
}
