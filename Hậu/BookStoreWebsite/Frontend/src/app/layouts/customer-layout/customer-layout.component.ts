import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent implements OnInit {

  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy = localStorage.getItem('loginBy');

  constructor(private _router: Router) {

  }
  ngOnInit() {
  }
  moveToAccount() {
    return this._router.navigate(['/account']);
  }
  moveToHome() {

    return this._router.navigate(['/']);
  }

  moveToProfile() {
    return this._router.navigate(['/profile']);
  }
  logo
  moveToCart() {
    return this._router.navigate(['/cartBook']);
  }
  logout() {
    // this.statusLogin == null;
    // localStorage.removeItem('accountUser');
    localStorage.removeItem('accountSocial');
    localStorage.removeItem('statusLogin');
    localStorage.removeItem('loginBy');
    // localStorage.removeItem('access-token');
    localStorage.removeItem('token');
    // localStorage.removeItem('__paypal_storage__');
    // localStorage.removeItem('TongCount');
    // localStorage.removeItem('token');
    window.location.href = "/";
  }


}
