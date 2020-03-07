import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  constructor() { 
    $(function() {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
       });
      });
  }

  ngOnInit() {
  }

}
