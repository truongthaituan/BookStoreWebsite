import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

declare var $:any;
@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css']
})
export class AccountProfileComponent implements OnInit {

  constructor(private _router: Router, private location: Location) { }

  ngOnInit() {
    
  }
  moveToProfileDetail(){
    this._router.navigate(['/accountProfile'])
  }
  cancel(){
    this.location.back();
  }
}
