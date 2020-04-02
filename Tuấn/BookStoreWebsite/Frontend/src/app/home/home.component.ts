import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../app-services/book-service/book.service';
import { Book } from '../app-services/book-service/book.model';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	success: Boolean = false;
  
  constructor(private _router:Router,  private bookService:BookService) {

}
  ngOnInit() {
	$(function () {
		$("#scrollToTopButton").click(function () {
		  $("html, body").animate({ scrollTop: 0 }, 1000);
		});
  
	  });
	  this.refreshBookList();
	  //set Tổng tiền và số lượng trên header
	  if(localStorage.getItem('TongTien')==null){
		  localStorage.setItem("TongTien","0");
		  localStorage.setItem("TongCount","0");
		  $('#tongtien').html("&nbsp;" +localStorage.getItem('TongTien') + " đ");
		  $('.cart_items').html(localStorage.getItem('TongCount'));
	  }else{
	  $('#tongtien').html("&nbsp;" +localStorage.getItem('TongTien') + " đ");
	  $('.cart_items').html(localStorage.getItem('TongCount'));
	}
	  //
  }
  moveToShop(){
	  return this._router.navigate(['/booksCategory']);
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
	//   localStorage.setItem("selectedBook",JSON.stringify(this.selectedBook));
	  return this._router.navigate(["/bookDetail" + `/${book._id}`]);
	}
	refreshBookList() {
		this.bookService.getBookList().subscribe((res) => {
		  this.bookService.book = res as Book[];
		});
	  }
}
