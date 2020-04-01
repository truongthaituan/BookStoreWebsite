import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../app-services/book-service/book.service';
import { Book } from '../app-services/book-service/book.model';
import { CategoryService } from '../app-services/category-service/category.service';
import { Category } from '../app-services/category-service/category.model';
import { Socialaccount } from '../app-services/socialAccount-service/socialaccount.model';
import { Session } from 'protractor';

declare var $: any
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
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  constructor(private _router: Router, private bookService: BookService, private bookCategoryService: CategoryService) {

    $(function () {

    });
    this.selectedCategory = localStorage.getItem('selectedCategory');
  }
  minValue2 = 1000;
  maxValue2 = 5000;
  step2 = 500;
  currentValues = [0, 0];
  currentValues2 = [2000, 4000];

  onSliderChange(selectedValues: number[]) {
    this.currentValues = selectedValues;
    $(function () {
      $("#amount-min").val("Min : " + selectedValues[0] + "đ");
      $("#amount-max").val("Max : " + selectedValues[1] + "đ");
    });
  }
  booksCategory: []
  category_id: string;
  userGoogle: Array<Socialaccount>;
  statusLogin: string = ""
  ngOnInit() {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    this.refreshBookList();
    this.refreshCategoryList();
    this.category_id = localStorage.getItem('category_id');
    this.userGoogle = JSON.parse(localStorage.getItem('userGoogle'));
    this.statusLogin = localStorage.getItem('statusLogin');

    //set độ dài cartBook
    this.cartBookLength(this.CartBook);
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
  }
  // check count cart before add (hover )
  checkCountMax10=true;
  checkCountCartBeforeAdd(selectedBook: Book) {
    this.checkCountMax10=true;
    for (var i = 0; i < this.lengthCartBook; i++) {
      if (this.CartBook[i]._id == selectedBook._id) {
          //kiểm tra số lượng 
          if(this.CartBook[i].count==10)
          {
            this.checkCountMax10=false;
          }
          console.log(this.CartBook[i].count);
      }
    }
    //nếu sách không có trong cartbook ( chưa từng thêm vào giỏ)

  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  selectedBook = [];
  detailBook(book: Book) {
    return this._router.navigate(["/bookDetail" + `/${book._id}`]);
  }
  refreshCategoryList() {
    this.bookCategoryService.getCategoryList().subscribe((res) => {
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
    var category: any;
    this.bookCategoryService.getCategoryById(id).subscribe((res) => {
      this.bookCategoryService.category = res as Category[];
      category = res;
    });
  }
  getid_book(id) {
    localStorage.setItem('book_detail', id);
  }

  gettypeCategory(id) {
    this.bookService.getBookByCategoryId(id)
      .subscribe(resCategoryData => {
        // console.log(resCategoryData);
        this.books = resCategoryData as Book[];
        console.log(this.books);
      });
  }

  sort() {
    if ($('.orderby option:selected').val() == 'SortByPrice') {
      this.books.sort(function (a, b) {
        return (a.priceBook) - (b.priceBook);
      });
      console.log(this.books);
    }
  }



  addABook = "";
  //add to cart (BookDetail,CountSelect)
  // số lượng tối đa chỉ được 10 mỗi quốn sách , tính luôn đã có trong giỏ

  checkedAddBook = true;
  addToCart(selectedBook: Book) {
    this.addABook = selectedBook.nameBook;
    var CartBook = [];    //lưu trữ bộ nhớ tạm cho localStorage "CartBook"
    var dem = 0;            //Vị trí thêm sách mới vào localStorage "CartBook" (nếu sách chưa tồn tại)
    var temp = 0;           // đánh dấu nếu đã tồn tại sách trong localStorage "CartBook" --> count ++
    // nếu localStorage "CartBook" không rỗng

    if (localStorage.getItem('CartBook') != null) {
      //chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)

      for (var i = 0; i < JSON.parse(localStorage.getItem("CartBook")).length; i++) {
        CartBook[i] = JSON.parse(localStorage.getItem("CartBook"))[i];
        // nếu id book đã tồn tại trong  localStorage "CartBook" 
        if (CartBook[i]._id == selectedBook._id) {
          temp = 1;  //đặt biến temp
          // nếu số lượng tối đa chỉ được 10 mỗi quốn sách , tính luôn đã có trong giỏ thì oke
          if (parseInt(CartBook[i].count) + 1 <= 10) {
            CartBook[i].count = parseInt(CartBook[i].count) + 1;  //tăng giá trị count
          }
          else {
            //show alert
            this.checkedAddBook = false;
            //update lại số lượng 


            this.alertMessage = "Đã tồn tại 10 quốn sách " + CartBook[i].nameBook + " trong giỏ hàng";
            this.alertFalse = true;
            setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
          }
        }
        dem++;  // đẩy vị trí gán tiếp theo
      }
    }

    if (temp != 1) {      // nếu sách chưa có ( temp =0 ) thì thêm sách vào
      selectedBook.count = 1;  // set count cho sách
      CartBook[dem] = selectedBook; // thêm sách vào vị trí "dem" ( vị trí cuối) 
    }
    // đổ mảng vào localStorage "CartBook"
    localStorage.setItem("CartBook", JSON.stringify(CartBook));

    this.getTotalCountAndPrice();
    //  //show alert
    //  this.alertMessage="Thêm thành công sách "+ selectedBook.nameBook +" vào giỏ hàng";
    //  this.alertSucess=true;
    //  setTimeout(() => {this.alertMessage="";this.alertSucess=false}, 6000); 

  }

  //get total count and price 
  TongTien = 0;
  TongCount = 0;
  CartBook = [];
  lengthCartBook = 0;
  getTotalCountAndPrice() {
    this.TongTien = 0;
    this.TongCount = 0;
    this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
    this.cartBookLength(this.CartBook);
    if (this.CartBook != null) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        this.TongTien += parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count);
        this.TongCount += parseInt(this.CartBook[i].count);

      }
    }
    $('#tongtien').html("&nbsp;" + this.TongTien.toString() + " đ");
    $('.cart_items').html(this.TongCount.toString());
    localStorage.setItem("TongTien", this.TongTien.toString());
    localStorage.setItem("TongCount", this.TongCount.toString());
  }
  // set độ dài của giỏ hàng
  cartBookLength(CartBook) {
    if (CartBook == null) {
      this.lengthCartBook = 0;
    } else {
      this.lengthCartBook = CartBook.length;
    }
  }

  // go to cart book
  goToCartBook() {
    this._router.navigate(['/cartBook']);
  }
}
