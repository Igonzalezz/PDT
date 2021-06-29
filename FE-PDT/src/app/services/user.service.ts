import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private myAppUrl = 'https://localhost:44311/'; 
  private myApiUrl = 'api/User/';

  list: User[]; //local list to store all Users received from api.
  private updateForm = new BehaviorSubject<User>({} as any); 

  constructor(private http: HttpClient) { }

  //method to retrieve all users from the database by api
  getUsers(){
    this.http.get(this.myAppUrl + this.myApiUrl).toPromise()
    .then(data => {
      this.list = data as User[];
    })
  }

  //method to add a single user by api
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.myAppUrl + this.myApiUrl + "SingleUser", user);
  }

  //method to add multiple users an user by api (used in csv upload)
  addUserList(user: User[]): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrl + "MultiUser", user); 
  }

  //method to dele an user by api
  deleteUser(id: number): Observable<User>{
    return this.http.delete<User>(this.myAppUrl + this.myApiUrl + id);
  }

  //method to edit an user by api
  editUser(id: number, user: User): Observable<User>{
    return this.http.put<User>(this.myAppUrl + this.myApiUrl + id, user);
  }

  //method to update/bind the data from base-de-datos component to captura-de-datos component
  updateUserForm(user: User){
    this.updateForm.next(user)
  }

  //Observable method used in captura-de-datos to edit Users.
  getUser$():Observable<User>{
    return this.updateForm.asObservable();
  }

}
