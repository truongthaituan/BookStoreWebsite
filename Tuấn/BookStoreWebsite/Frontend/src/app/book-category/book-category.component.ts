import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../app-services/book-service/book.service';
import { Book } from '../app-services/book-service/book.model';
import { CategoryService } from '../app-services/category-service/category.service';
import { Category } from '../app-services/category-service/category.model';
import { Socialaccount } from '../app-services/socialAccount-service/socialaccount.model';

declare var $:any
@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})

export class BookCategoryComponent implements OnInit {
  searchText;
  searchCategory;
  pageOfItems: Array<any>;
  books: Array<Book>;
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
  category_id: string;
  userGoogle: Array<Socialaccount>;
  statusLogin: string = ""
  ngOnInit() {
    this.refreshBookList();
    this.refreshCategoryList();
    this.category_id = sessionStorage.getItem('category_id');
    this.userGoogle = JSON.parse(sessionStorage.getItem('userGoogle'));
    this.statusLogin = sessionStorage.getItem('statusLogin');
    // if(this.statusLogin == 'true'){
    //   $("#username").html("Chào mừng " + JSON.parse(sessionStorage.getItem('userGoogle')).username);
    //   $("#logout").html("Đăng Xuất");
    //   $("#login").html("");
    // }

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
      this.books = res as Book[];
          console.log(this.books);
		});
    }
    booksFilter = []
    showCategory(id: String) {
      var category:any;
      this.bookCategoryService.getCategoryById(id).subscribe((res) => {
        this.bookCategoryService.category = res as Category[];
        category = res;
        });
      } 
      getid_book(id){
        localStorage.setItem('book_detail',id);
      }
      
      gettypeCategory(id){
        this.bookService.getBookByCategoryId(id)
        .subscribe(resCategoryData => {
          // console.log(resCategoryData);
          this.books = resCategoryData as Book[];
          console.log(this.books);
        });
      }
      
      sort() {
        if($('.orderby option:selected').val() == 'SortByPrice'){
          this.books.sort(function(a, b) {
                return (a.priceBook) - (b.priceBook);
            });
            console.log(this.books);
        }
    }
}
