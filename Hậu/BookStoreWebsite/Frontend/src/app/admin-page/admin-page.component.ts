import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../app-services/book-service/book.service';
import { CategoryService } from '../app-services/category-service/category.service';
import { Book } from '../app-services/book-service/book.model';
import { Category } from '../app-services/category-service/category.model';
declare var $:any;
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  constructor(private _router:Router,private bookService:BookService,  private bookCategoryService:CategoryService) { 
    $(function() {
  
    });
  }

  ngOnInit() {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    this.refreshBookList();
    this.refreshCategoryList();
  }
  detailBook(book: Book) {
    return this._router.navigate(["/bookDetail" + `/${book._id}`]);
  }
  refreshCategoryList(){
    this.bookCategoryService.getCategoryList().subscribe((res) =>{
      this.bookCategoryService.category = res as Category[];
    }); 
  }
  refreshBookList() {
		this.bookService.getBookList().subscribe((res) => {
      this.bookService.book = res as Book[];
     sessionStorage.setItem('listBook',JSON.stringify(res));
		});
    }
    moveToAddBook(){
      this._router.navigate(['/insertPage']);
    }
    getBookById(book: Book) {
      return this._router.navigate(["/updatePage" + `/${book._id}`]);
    }
    deleteById(_id: string) {
      if (confirm('Bạn có muốn xóa cuốn sách này không ?') == true) {
      this.bookService.deleteBook(_id).subscribe(
        data=>{ console.log(data);this.ngOnInit();},
      error=>console.log(error)
      )
      }
    }
    moveToInsert(){
      this._router.navigate(['/insertPage']);
    }
}
