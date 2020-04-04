import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../app-services/order-service/order.service';
import { OrderDetailService } from '../app-services/orderDetail-service/orderDetail.service';
import { Order } from '../app-services/order-service/order.model';
import { OrderDetail } from '../app-services/orderDetail-service/orderDetail.model';
import { CustomerService } from '../app-services/customer-service/customer.service';
import { Customer } from '../app-services/customer-service/Customer.model';
import { SendMailService } from '../app-services/sendMail-service/sendMail.service';
import { SendMail } from '../app-services/sendMail-service/sendMail.model';
import { BookService } from '../app-services/book-service/book.service';
import { Book } from '../app-services/book-service/book.model';
declare var $: any;
@Component({
  selector: 'app-book-cart-cus-info',
  templateUrl: './book-cart-cus-info.component.html',
  styleUrls: ['./book-cart-cus-info.component.css']
})
export class BookCartCusInfoComponent implements OnInit {
  constructor(private _router: Router, private _orderService: OrderService, private _orderDetailService: OrderDetailService,
    private _customerService: CustomerService, private _sendMail: SendMailService, private _bookService: BookService) {

  }

  //chứa thông tin giỏ hàng
  CartBook = [];
  customer: Customer = new Customer;
  TongTien = 0;
  TongCount = 0;
  //thông tin login
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  //change info payment
  address = "";
  phone = "";
  email = "";
  username = "";
  lengthCartBook = 0;
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  ngOnInit() {
    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });
    if (this.accountSocial) {
      this.email = this.accountSocial.email;
      this.username = this.accountSocial.username;
    }//get giỏ hàng
    this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
  
    //set độ dài cartBook
    this.cartBookLength(this.CartBook);
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();

  }

  // set độ dài của giỏ hàng
  cartBookLength(CartBook) {
    if (CartBook == null) {
      this.lengthCartBook = 0;
    } else {
      this.lengthCartBook = CartBook.length;
    }
  }
  //get total count and price 
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


  

  //eidt customer info
  editEmail(event: any) {
    this.email = event.target.value;
    console.log(this.email);
  }
  editUserName(event: any) {
    this.username = event.target.value;
  }
  editAddress(event: any) {
    this.address = event.target.value;
    console.log(this.address);
  }
  editPhone(event: any) {
    this.phone = event.target.value;
  }

  //click vào hình chuyển về detail
  ViewBookDetail(idBook) {
    return this._router.navigate(["/bookDetail" + `/${idBook}`]);
  }
 
 
  goToBookCategory() {
    this._router.navigate(['/booksCategory']);
  }


  


 



}
