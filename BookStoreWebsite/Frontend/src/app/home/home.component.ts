import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book-service/book.service';
import { Book } from '../book-service/book.model';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	success: Boolean = false;
  
  constructor(private _router:Router,  private bookService:BookService) {
	  
    $(function() {
   // optional
//    $('#myCarousel').carousel({
// 	interval: 4000
//   })
  
  $('.carousel .item').each(function(){
	var next = $(this).next();
	if (!next.length) {
	  next = $(this).siblings(':first');
	}
	next.children(':first-child').clone().appendTo($(this));
	
	for (var i=0;i<2;i++) {
	  next=next.next();
	  if (!next.length) {
		  next = $(this).siblings(':first');
		}
	  
	  next.children(':first-child').clone().appendTo($(this));
	}
  });
  $("#scrollToTopButton").click(function () {
	$("html, body").animate({scrollTop: 0}, 1000);
 	});
   });
}
  ngOnInit() {
	  this.refreshBookList();
  }
  moveToShop(){
	  return this._router.navigate(['/booksCategory']);
  }
  moveToAccount(){
	return this._router.navigate(['/account']);
}
	moveToBookCategory(){
		return this._router.navigate(['/booksCategory']);
	}
	moveToBookDetail(){
		return this._router.navigate(['/bookDetail']);
	}
	selectedBook = [];
	detailBook(book: Book) {
	//   this.selectedBook.push(book);
	//   console.log(this.selectedBook);
	//   sessionStorage.setItem("selectedBook",JSON.stringify(this.selectedBook));
	  return this._router.navigate(["/bookDetail" + `/${book._id}`]);
	}
	refreshBookList() {
		this.bookService.getBookList().subscribe((res) => {
		  this.bookService.book = res as Book[];
		});
	  }
}
