import { HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, map, catchError } from 'rxjs/operators';
import {AuthInfo} from './auth-info.model'
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
   private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  private authInfoSubject = new BehaviorSubject<AuthInfo>({
    isLoggedIn: this.isAuthenticated(),
    role: this.getRole(),
    account: this.getAccount()
  });
  public authInfo = this.authInfoSubject.pipe(distinctUntilChanged());
  public isLoggedIn = this.loggedIn.asObservable().pipe(distinctUntilChanged());
  helper = new JwtHelperService();
  constructor(private router: Router,private http: HttpClient,private _host:HostService) {

  }
  readonly baseURL = this._host.host()+':3000';
  login(credentials): Observable<any> {
    return this.http.post(this.baseURL+'/users/login', credentials)
      .pipe(map(
        data => {
          if(data['message'] != null){
           data = data['message']
          }else{
            this.finishAuthentication(data);
          }
          return data;
        }
      ));
  }

  finishAuthentication(data): void {
    const token = this.helper.decodeToken(data.token);
    const expiresAt = JSON.stringify((token.exp * 1000));
    // save data to local storage
    localStorage.setItem('accountSocial', JSON.stringify(data.obj));
    localStorage.setItem('token', data.token);
    localStorage.setItem('expires-at', expiresAt);
    localStorage.setItem('role', token.role);
    this.loggedIn.next(true);
    // set current data to observable
    this.authInfoSubject.next({
      isLoggedIn: true,
      role: this.getRole(),
      account: this.getAccount()
    });
    this.router.navigate(['homePage']);
  }

  logout(): Observable<any> {
    localStorage.removeItem('accountSocial');
    localStorage.removeItem('token');
    localStorage.removeItem('expires-at');
    localStorage.removeItem('role');
    this.authInfoSubject.next({
      isLoggedIn: false,
      role: this.getRole(),
      account: this.getAccount()
    });

    return this.isLoggedIn;
  }

  isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires-at'));
    return Date.now() < expiresAt;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }
  getRole(): string {
    const role = localStorage.getItem('role');
    return role;
  }
  getAccount(): string {
    return localStorage.getItem('accountSocial')
  }
 
  isAdmin() {
    const role = localStorage.getItem('role');
    if (role) {
      return role.includes('ADMIN');
    }
    return false;
  }

  isCustomer() {
    const role = localStorage.getItem('role');
    if (role) {
      return role.includes('CUSTOMER');
    }
    return false;
  }
}
