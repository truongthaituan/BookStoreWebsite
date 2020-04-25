import { Component } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { Router } from '@angular/router';
import { SocialAccount } from './app-services/socialAccount-service/socialaccount.model';
declare var $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
    title = 'Angular';
    accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
    statusLogin = localStorage.getItem('statusLogin');
    loginBy = localStorage.getItem('loginBy');
   
 

  constructor(private _router:Router){
      
  }
  moveToAccount(){
    return this._router.navigate(['/account']);
  }
  moveToHome(){

    return this._router.navigate(['/']);
  }
  
  moveToProfile(){
    return this._router.navigate(['/profile']);
  }
  logo
  moveToCart(){
    return this._router.navigate(['/cartBook']);
  }
  logout(){
    // this.statusLogin == null;
    // localStorage.removeItem('accountUser');
    // localStorage.removeItem('accountSocial');
    // localStorage.removeItem('statusLogin');
    // localStorage.removeItem('loginBy');
    // localStorage.removeItem('access-token');
    // localStorage.removeItem('token');
    // localStorage.removeItem('__paypal_storage__');
    // localStorage.removeItem('TongCount');
    // localStorage.removeItem('user-name');
    // localStorage.removeItem('token');
    localStorage.clear();
    window.location.href = "/";
  }
}
