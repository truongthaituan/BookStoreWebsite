import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book-service/book.service';
import { Book } from '../book-service/book.model';

declare var $:any
@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})

export class BookCategoryComponent implements OnInit {

  constructor(private _router:Router,  private bookService:BookService) { 

    $(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 200000,
        values: [0, 50000],
        animate:true,
        step:10000,
        slide: function( event, ui ) {
          $( "#amount-min" ).val( "Min: " + ui.values[ 0 ] + "đ");
          $( "#amount-max" ).val( "Max: " + ui.values[ 1 ] + "đ");
        }
      });
      $( "#amount-min" ).val("Min : " + $( "#slider-range" ).slider( "values", 0 ) + "đ");
      $( "#amount-max" ).val( "Max : " + $( "#slider-range" ).slider( "values", 1 ) + "đ");
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
       });
      //  alert($('#item1 span').text());
    });

  }

  ngOnInit() {
    this.refreshBookList();
  }
  selectedBook = [];
  detailBook(book: Book) {
    this.selectedBook.push(book);
    console.log(this.selectedBook);
    sessionStorage.setItem("selectedBook",JSON.stringify(this.selectedBook));
    return this._router.navigate(["/bookDetail"]);
  }
  // moveToBookDetail(){
  //   return this._router.navigate(["/bookDetail"]);
  // }
  refreshBookList() {
		this.bookService.getBookList().subscribe((res) => {
		  this.bookService.book = res as Book[];
		});
	  }
}
