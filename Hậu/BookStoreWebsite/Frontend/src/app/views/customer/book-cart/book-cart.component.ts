import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../app-services/order-service/order.service';
import { OrderDetailService } from '../../../app-services/orderDetail-service/orderDetail.service';
import { Order } from '../../../app-services/order-service/order.model';
import { OrderDetail } from '../../../app-services/orderDetail-service/orderDetail.model';
import { CustomerService } from '../../../app-services/customer-service/customer.service';
import { Customer } from '../../../app-services/customer-service/Customer.model';
import { SendMailService } from '../../../app-services/sendMail-service/sendMail.service';
import { SendMail } from '../../../app-services/sendMail-service/sendMail.model';
import { BookService } from '../../../app-services/book-service/book.service';
import { Book } from '../../../app-services/book-service/book.model';
declare var $: any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],

})
export class BookCartComponent implements OnInit {
  constructor(private _router: Router, private _orderService: OrderService, private _orderDetailService: OrderDetailService,
    private _customerService: CustomerService, private _sendMail: SendMailService, private _bookService: BookService) {

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
  
  ngOnInit() {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    //   $('#up').click(function () {
    //     if ($('#myNumber').val() < 10) {
    //      $('#myNumber').val()(+$(this).prev().val() + 1);
    //     }
    // });
    // $('#down').click(function () {
    //     if ($('#myNumber').val() > 1) {
    //       if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
    //     }
    // });
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
     for(let j = 0; j < this.CartBook.length;j++){
      if(this.CartBook[j].count < 10){
        if (this.CartBook[j]._id == id) {
          this.CartBook[j].count++;
        this.updateCartBook(this.CartBook[j]._id, this.CartBook[j].count);
       }
      }
     } 
  }
   minus(id) {
    for(let j = 0; j < JSON.parse(localStorage.getItem("CartBook")).length;j++){
      if(this.CartBook[j].count != 0){
        if(this.CartBook[j]._id == id){
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
    $('#tongtien').html("&nbsp;" + this.TongTien.toString() + " đ");
    $('.cart_items').html(this.TongCount.toString());
    localStorage.setItem("TongTien", this.TongTien.toString());
    localStorage.setItem("TongCount", this.TongCount.toString());
  }
  //#endregion

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
      this.updateCartBook(id,event.target.value);
    }else
     {
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
  updateCartBook(id,count) {
    //kiểm tra book[id].count có bằng 0 không ,... nếu =0 thì ==> gửi qua hàm xóa
    if (this.checkedAddBook) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        //tìm id được chọn để edit 
        if (this.CartBook[i]._id == id) {
          if (count == 0) {
            this.deleteCartBook(id);
          }
          else{
            this.CartBook[i].count = count;
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
          this.CartBook.splice(i, 1);
          break;
        }
      }
      localStorage.setItem("CartBook", JSON.stringify(this.CartBook));
      this.ngOnInit();
    }
    else{
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
  goToShipping(){
    // if (this.statusLogin == null) { this._router.navigate(['/account']); }
    // else{
     
      if(JSON.parse(localStorage.getItem('accountSocial')) != null ){
        this._router.navigate(['/shipping']);
      }else{
        alert("Token is valid");
      }
    // }
}

}
