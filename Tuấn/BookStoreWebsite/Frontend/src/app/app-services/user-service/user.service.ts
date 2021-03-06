import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from './user.model';
import { HostService } from '../aHost/Host.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User;

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000';
  users: User[]
  register(body:any){
    return this._http.post(this.baseURL +'/signup',body,{
      observe:'body',
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  login(body:any){
    return this._http.post(this.baseURL +'/login',body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  user(){
    return this._http.get(this.baseURL,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  logout(){
    return this._http.get(this.baseURL +'/logout',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }
  getAllUsers(){
    return this._http.get(this.baseURL+"/users");
  }
  getUserByEmail(email: string){
    return this._http.get(this.baseURL+"/users/email/"+email);
  }
  getUserById(id: string){
    return this._http.get(this.baseURL+"/users/" + id);
  }
  updateUser(user: User){
    return this._http.put(this.baseURL+"/users"+ `/${user._id}`, user);
  }
  deleteUser(userId: string) {
    return this._http.delete(this.baseURL+"/users" + `/${userId}`).pipe(map(data => data))
  }
  changePassword(body: any) {
    return this._http.put(this.baseURL+"/users/changePassword" + `/${body.email}`, body).pipe(map(data => data),)
  }
}
