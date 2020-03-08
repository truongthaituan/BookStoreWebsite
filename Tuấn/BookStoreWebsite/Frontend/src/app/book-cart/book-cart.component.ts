import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css']
})
export class BookCartComponent implements OnInit {

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
