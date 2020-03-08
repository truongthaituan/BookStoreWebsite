import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  constructor() {
    $(function(){
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
       });
    });
   } 

  ngOnInit() {
  }

}
