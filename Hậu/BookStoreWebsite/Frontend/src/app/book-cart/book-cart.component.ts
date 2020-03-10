import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../author-service/author.service';
import { Author } from '../author-service/author.model';
import { BookService } from '../book-service/book.service';
import { Book } from '../book-service/book.model';
declare var $:any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],
 
})
export class BookCartComponent implements OnInit {
 
  constructor() {
    $(function() {
    $("#scrollToTopButton").click(function () {
      $("html, body").animate({scrollTop: 0}, 1000);
     });
    });
   }
  CartBook = JSON.parse(sessionStorage.getItem("CartBook"));
  ngOnInit() {
       

  
  }

}
