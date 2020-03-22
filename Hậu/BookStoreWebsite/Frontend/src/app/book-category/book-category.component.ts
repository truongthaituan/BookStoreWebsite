import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../app-services/book-service/book.service';
import { Book } from '../app-services/book-service/book.model';
import { CategoryService } from '../app-services/category-service/category.service';
import { Category } from '../app-services/category-service/category.model';
import { Socialaccount } from '../app-services/socialAccount-service/socialaccount.model';
import { Session } from 'protractor';

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
    //set Tổng tiền và số lượng trên header
    $('#tongtien').html("&nbsp;" +sessionStorage.getItem('TongTien') + " đ");
    $('.cart_items').html(sessionStorage.getItem('TongCount'));
    //
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




    //add to cart (BookDetail,CountSelect)
  addToCart(selectedBook: Book) {

    var CartBook = [];    //lưu trữ bộ nhớ tạm cho sessionStorage "CartBook"
    var dem = 0;            //Vị trí thêm sách mới vào sessionStorage "CartBook" (nếu sách chưa tồn tại)
    var temp = 0;           // đánh dấu nếu đã tồn tại sách trong sessionStorage "CartBook" --> count ++
    // nếu sessionStorage "CartBook" không rỗng

    if (sessionStorage.getItem('CartBook') != null) {
      //chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)
      
      for (var i = 0; i < JSON.parse(sessionStorage.getItem("CartBook")).length; i++) {
        CartBook[i] = JSON.parse(sessionStorage.getItem("CartBook"))[i];
        // nếu id book đã tồn tại trong  sessionStorage "CartBook" 
        if (CartBook[i]._id == selectedBook._id) {
          temp = 1;  //đặt biến temp

          CartBook[i].count =parseInt(CartBook[i].count) +1;  //tăng giá trị count
        }
        dem++;  // đẩy vị trí gán tiếp theo
      }
    }

    if (temp != 1) {      // nếu sách chưa có ( temp =0 ) thì thêm sách vào
      selectedBook.count = 1;  // set count cho sách
      CartBook[dem] = selectedBook; // thêm sách vào vị trí "dem" ( vị trí cuối) 
    }
    // đổ mảng vào sessionStorage "CartBook"
    sessionStorage.setItem("CartBook", JSON.stringify(CartBook));


    this._router.navigate(['/cartBook']);
  }
}
