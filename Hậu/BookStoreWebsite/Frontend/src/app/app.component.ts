import { Component } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { Router } from '@angular/router';
import { Socialaccount } from './app-services/socialAccount-service/socialaccount.model';
declare var $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
    title = 'Angular';
    accountUser = JSON.parse(localStorage.getItem('accountUser'));
    accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
    statusLogin = localStorage.getItem('statusLogin');
    loginBy = localStorage.getItem('loginBy');
   
    //
    customOptions: any = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  constructor(private _router:Router){
      
  }
  moveToAccount(){
    return this._router.navigate(['/account']);
  }
  moveToHome(){
    return this._router.navigate(['/']);
  }
  moveToCart(){
    return this._router.navigate(['/cartBook']);
  }
  logout(){
    // this.statusLogin == null;
    localStorage.removeItem('accountUser');
    localStorage.removeItem('accountSocial');
    localStorage.removeItem('statusLogin');
    localStorage.removeItem('loginBy');
    window.location.href = "/";
  }
}
