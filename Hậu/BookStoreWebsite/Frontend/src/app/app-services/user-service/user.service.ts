import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from './user.model';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User;

  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000/users';
  users: User[]
  register(body:any){
    return this._http.post('http://localhost:3000/signup',body,{
      observe:'body',
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  login(body:any){
    return this._http.post('http://localhost:3000/login',body,{
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
    return this._http.get('http://localhost:3000/logout',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }
  getAllUsers(){
    return this._http.get(this.baseURL);
  }
}
