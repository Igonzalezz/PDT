import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { User } from './../../models/User';

@Component({
  selector: 'app-base-de-datos',
  templateUrl: './base-de-datos.component.html',
  styleUrls: ['./base-de-datos.component.css']
})
export class BaseDeDatosComponent implements OnInit {

  headerLimit = 4;
  search: string;
  warning: boolean;
  @ViewChild('csvReader') csvReader: any;

  constructor(public userService: UserService,
              public toastr: ToastrService) {}
    

  ngOnInit(): void {
    this.userService.getUsers();
  }

  deleteUser(id: number){
    if(confirm('Deseas eliminar este usuario?')){
      this.userService.deleteUser(id).subscribe( data =>{
        this.toastr.warning('El usuario fue eliminado existosamente','Usuario Eliminado');
        this.userService.getUsers();
      },error => {
        this.toastr.error('El usuario no se pudo registrar.', 'Error registrado usuario');
      console.log(error);
      })
    }
  }

  //method to pass the User info from the this component to captura-de-datos
  editUser(user){
    this.userService.updateUserForm(user);
  }

  //method to generate a downloadable file from the database 
  downloadFile(data: any, name="myData", printHeader = true ) {
    const replacer = (key, value) => value === null ? '' : value; 
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    if(printHeader)
      csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, name+".csv");
  }
 
  //method used to upload a csv file
  uploadListener($event: any): void {
    let csvToUser: User[]= [];
    let rex=/\"/g;
    let files = $event.srcElement.files;
    this.warning = false;
    if (files[0].name.endsWith(".csv")) //validate if the upload file is a csv file
    {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload =  () => {
        let csvData = (<string>reader.result).replace(rex,''); //asign the result and delete all the quotes if included.
        let csvRecordsArray = (csvData).split(/\r\n|\n/); //split the string on each breakline.
        let headerRow = csvRecordsArray.length > 0 ? csvRecordsArray[0].split(",") : null ; //get the first row as header.
        
        if(headerRow.length === this.headerLimit) //if header is differen from the model skip the processing.
        {
          csvToUser = this.getUserListFromCSVFile(csvRecordsArray,headerRow);

          this.userService.addUserList(csvToUser).subscribe(x => {
            if(this.warning)// if the csv file contain more or less fields than the 
              this.toastr.warning('Se importo el archivo pero se omitieron registros invalidos.', 'Archivo con error',
              {enableHtml:true,progressBar: true,easing:"1000"});
            else
              this.toastr.success('El archivo fue cargado con exito.', 'Archivo cargado');
              this.userService.getUsers(); // update grid with the new records
          }, error => {
              if(error.status === 409){ //controlled error when the api can't add an user due lenght field.
                this.toastr.error('El siguiente registro excede la longitud máxima permitida. </br>'+ error.error, 'Error en archivo',
                {enableHtml:true,progressBar: true,easing:"500"});
              }
              else
              {//unknown error from the server
                this.toastr.error('Ocurrio un error al importar el archivo.', 'Error en el archivo');
                console.log(error)
              }
            }
          );
        }
        else
        {
          this.toastr.error('La cantidad de parametros en el header es incorrecta.', 'Error en el archivo');
        }
      };

      reader.onerror = function () { //if file canot be read by the FileReader then trow a message.
        let toastr: ToastrService
        toastr.error('Ocurrio un error al leer el archivo.', 'Error en el archivo');
      };

    } 
    else 
    {
      alert("Por favor ingrese un archivo .csv valido");
    }

    this.csvReader.nativeElement.value = "";// Reset the Upload element
  }

  
  //convert a CSV record to a User List for the api
  getUserListFromCSVFile(csvRecordsArray: any, header: any) {
    let csvFailArr = [];
    let csvToUser: User[] = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length === this.headerLimit) {
        let csvRecord: User = new User();
        csvRecord.nombre = curruntRecord[0].trim();
        csvRecord.direccion = curruntRecord[1].trim();
        csvRecord.telefono = curruntRecord[2].trim();
        csvRecord.curp = curruntRecord[3].trim();
        csvToUser.push(csvRecord);
      }
      else{
        csvFailArr.push(curruntRecord);
      }
    }

    //Store the bad records and make a downloable file.
    if(csvFailArr.length > 0){
      if (header.length > 0)
        csvFailArr.unshift(header);
      this.warning = true;
      this.downloadFile(csvFailArr,"BadRecords",false)
    }

    return csvToUser;
  }
    
}
