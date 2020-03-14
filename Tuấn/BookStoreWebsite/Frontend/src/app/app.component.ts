import { Component } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { Router } from '@angular/router';
import { Socialaccount } from './socialAccount-service/socialaccount.model';
declare var $:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  // title = 'Angular';
  // title = 'angularowlslider';
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
  userGoogle: Array<Socialaccount>;
  statusLogin: string = ''
  ngOnInit() {
    this.userGoogle = JSON.parse(sessionStorage.getItem('userGoogle'));
    console.log(this.userGoogle)
    this.statusLogin = sessionStorage.getItem('statusLogin');
    console.log(this.statusLogin)
  }
  constructor(private _router:Router){
  
  }
  moveToAccount(){
    return this._router.navigate(['/account']);
  }
}
