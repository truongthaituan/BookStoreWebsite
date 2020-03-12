import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book-service/book.service';
import { Book } from '../book-service/book.model';
import { CategoryService } from '../category-service/category.service';
import { Category } from '../category-service/category.model';

declare var $:any
@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})

export class BookCategoryComponent implements OnInit {
  pageOfItems: Array<any>;
      items: any;
      collection = [];
      selectedCategory: String = "";
  constructor(private _router:Router,private bookService:BookService,  private bookCategoryService:CategoryService) { 

    $(function() {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
       });
    });
    this.selectedCategory = sessionStorage.getItem('selectedCategory');
  }
  minValue2 = 1000;
  maxValue2 = 5000;
  step2 = 500;
  currentValues = [0, 0];
  currentValues2 = [2000, 4000];

  onSliderChange(selectedValues: number[]) {
    this.currentValues = selectedValues;
    $(function() {
      $( "#amount-min" ).val("Min : " + selectedValues[0] + "đ");
      $( "#amount-max" ).val("Max : " + selectedValues[1] + "đ");
    });
  }
  booksCategory: []
  ngOnInit() {
    this.refreshBookList();
    this.refreshCategoryList();
    this.booksCategory = JSON.parse(sessionStorage.getItem('booksFilter'));
    console.log(this.booksCategory)
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}
  selectedBook = [];
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
    booksFilter = []
    showCategory(id: String) {
      var category:any;
      this.bookCategoryService.getCategoryById(id).subscribe((res) => {
        this.bookCategoryService.category = res as Category[];
        category = res;
        console.log(category._id)
        for(var i = 0; i <  JSON.parse(sessionStorage.getItem('listBook')).length;i++){
         if(category._id == JSON.parse(sessionStorage.getItem('listBook'))[i].categoryID){
           this.booksFilter.push(JSON.parse(sessionStorage.getItem('listBook'))[i]);
         }
        }
        console.log(this.booksFilter);
        sessionStorage.setItem('booksFilter',JSON.stringify(this.booksFilter));
      });
      } 
}
