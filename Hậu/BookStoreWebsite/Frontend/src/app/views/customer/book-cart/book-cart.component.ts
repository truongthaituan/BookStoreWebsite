import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute } from '@angular/router';
import { Book } from '../../../app-services/book-service/book.model';
import { CartBookService } from 'src/app/app-services/cartBook-service/cartBook.service';
import { CartBook } from 'src/app/app-services/cartBook-service/cartBook.model';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
declare var $: any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],

})
export class BookCartComponent implements OnInit {
  helper = new JwtHelperService();
  token: any = this.helper.decodeToken(localStorage.getItem('token'));
  constructor(private _router: Router, private _cartBookDB: CartBookService, private _discountCode: DiscountCodeService) {

  }
  //#region Buộc phải có trên các component
  //chứa thông tin giỏ hàng
  CartBook = [];
  // Lưu tổng tiền và tổng số lượng chung
  TongTien = 0;
  TongCount = 0;
  //thông tin login 
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  //#endregion

  // kiểm tra giỏ hàng rỗng
  checkViewCart = false;
  lengthCartBook = 0;
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  cartBookDB: CartBook = new CartBook;
  discountCode: DiscountCode = new DiscountCode;

  ngOnInit() {
    if (localStorage.getItem('DiscountCode') != null) {
      this.discountCode = JSON.parse(localStorage.getItem('DiscountCode'));
    } else {
      this.discountCode.discountCode = 0;
    }

    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });

    //#region Buộc phải có trên các component
    //get giỏ hàng
    this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
    //set độ dài cartBook
    this.cartBookLength(this.CartBook);
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    //#endregion

    // Hiện ra label khi giỏ hàng rỗng
    this.CheckViewCart();
  }
  //#region Buộc phải có trên các component
  quantity: number = 1;
  i = 1
  plus(id) {
    for (let j = 0; j < this.CartBook.length; j++) {
      if (this.CartBook[j]._id == id) {
        if (this.CartBook[j].count < 10) {
          this.CartBook[j].count++;
          this.updateCartBook(this.CartBook[j]._id, this.CartBook[j].count);
        }
         else {
        this.alertMessage = "Bạn chỉ được nhập tối đa 10 quốn sách";
        this.alertFalse = true;
        setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
      }
      }
     
    }
  }
  minus(id) {
    for (let j = 0; j < JSON.parse(localStorage.getItem("CartBook")).length; j++) {
      if (this.CartBook[j].count != 0) {
        if (this.CartBook[j]._id == id) {
          this.CartBook[j].count--;
          this.updateCartBook(this.CartBook[j]._id, this.CartBook[j].count);
        }
      }
    }
  }
  // set độ dài của giỏ hàng
  cartBookLength(CartBook) {
    if (CartBook == null) {
      this.lengthCartBook = 0;
    } else {
      this.lengthCartBook = CartBook.length;
    }
  }

  //get total count and price trên header
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
    $('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
    $('.cart_items').html(this.TongCount.toString());
    localStorage.setItem("TongTien", this.TongTien.toString());
    localStorage.setItem("TongCount", this.TongCount.toString());
  }
  //#endregion
   formatCurrency(number){
    var n = number.split('').reverse().join("");
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
    return  n2.split('').reverse().join('') + 'VNĐ';
}
  //check header giỏ hàng
  CheckViewCart() {
    if (this.CartBook == null || this.lengthCartBook == 0) {
      this.checkViewCart = true;
    }
    else {
      this.checkViewCart = false;
    }
  }


  // cờ hiệu của alert
  checkedAddBook = true;
  //get count onChange --> updateCartBook
  getCountUpdate(event: any, id) {
    console.log(event.target.value);
    this.checkedAddBook = true;
    // kiểm tra xem có lớn hơn 10 ko
    if (event.target.value <= 10) {
      console.log("update");
      this.updateCartBook(id, event.target.value);
    } else {
      //show alert
      this.checkedAddBook = false;
      //update lại số lượng 
      localStorage.setItem("CartBook", JSON.stringify(this.CartBook));
      this.ngOnInit();
      this.alertMessage = "Bạn chỉ được nhập tối đa 10 quốn sách";
      this.alertFalse = true;
      setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
    }
  }
  //Update Cart Book
  updateCartBook(id, count) {
    //kiểm tra book[id].count có bằng 0 không ,... nếu =0 thì ==> gửi qua hàm xóa
    if (this.checkedAddBook) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        //tìm id được chọn để edit 
        if (this.CartBook[i]._id == id) {
          if (count == 0) {
            this.deleteCartBook(id);
          }
          else {
            this.CartBook[i].count = count;
            //update cartbook DB
            this.putCartBookDB(this.CartBook[i]);
          }
        }
      }
    }
    localStorage.setItem("CartBook", JSON.stringify(this.CartBook));
    this.ngOnInit();
  }
  // Delete Cart Book
  deleteCartBook(id) {
    var setconfirm = confirm('Bạn có muốn xóa cuốn sách này không ?')
    if (setconfirm == true) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        if (this.CartBook[i]._id == id) {
          this.deleteOneCartBookDB(this.CartBook[i]);
          this.CartBook.splice(i, 1);
          break;
        }
      }
      localStorage.setItem("CartBook", JSON.stringify(this.CartBook));
      this.ngOnInit();
    }
    else {
      this.ngOnInit();
    }
  }
  //click vào hình chuyển về detail
  ViewBookDetail(idBook) {
    return this._router.navigate(["/bookDetail" + `/${idBook}`]);
  }

  checkoutWhenNull() {
    var setconfirm = confirm('Giỏ hàng của bạn đang trống , bạn có muốn dạo mua một vòng không ?')
    if (setconfirm == true) {
      this.goToBookCategory();
    }
  }
  goToBookCategory() {
    this._router.navigate(['/booksCategory']);
  }
  goToShipping() {

    if (this.token == null) {
      this._router.navigate(['/account']);
    } else {
      let token_exp = this.token.exp;
      let time_now = new Date().getTime() / 1000;
      if (time_now < token_exp) {
        this._router.navigate(['/shipping']);
      } else {
        // alert("Token is valid");
        localStorage.removeItem("accountSocial");
        localStorage.removeItem("token");
        localStorage.removeItem("loginBy");
        localStorage.removeItem("statusLogin");
        // this._router.navigate(['/account']);
        this.alertMessage = "Phiên làm việc của bạn đã hết hạn! Vui lòng đăng nhập lại!";
        this.alertFalse = true;
        setTimeout(() => { document.location.href = '/account'; }, 2000);
      }
    }
  }

  putCartBookDB(selectedBook: Book) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartBookDB.userID = this.accountSocial._id;
      this.cartBookDB.bookID = selectedBook._id;
      this.cartBookDB.count = selectedBook.count;
      this._cartBookDB.putCartBook(this.cartBookDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }
  deleteOneCartBookDB(selectedBook: Book) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartBookDB.userID = this.accountSocial._id;
      this.cartBookDB.bookID = selectedBook._id;
      this.cartBookDB.count = selectedBook.count;
      this._cartBookDB.deleteOneCartBook(this.cartBookDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode']);
  }
}
