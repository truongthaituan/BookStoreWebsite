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
declare var $: any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],

})
export class BookCartComponent implements OnInit {
  constructor(private _router: Router, private _orderService: OrderService, private _orderDetailService: OrderDetailService,
    private _customerService: CustomerService, private _sendMail: SendMailService, private _bookService: BookService) {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });
  }
  //chứa thông tin giỏ hàng
  CartBook = [];
  //chứa thông tin giỏ hàng dùng trong edit/update
  CartUpdate = [];
  sendMail: SendMail = new SendMail;
  orders: Order = new Order;
  orderDetails: OrderDetail = new OrderDetail;
  customer: Customer = new Customer;

  TongTien = 0;
  TongCount = 0;
  //thông tin login
  accountSocial = JSON.parse(sessionStorage.getItem('accountSocial'));
  statusLogin = sessionStorage.getItem('statusLogin');
  //change info payment
  address = "";
  phone = "";
  checkViewCart = false;
  lengthCartBook=0;
  ngOnInit() {
    //get giỏ hàng
    this.CartBook = JSON.parse(sessionStorage.getItem("CartBook"));
    this.CartUpdate = JSON.parse(sessionStorage.getItem("CartBook"));
    this.lengthCartBook =this.CartBook.length;
    // Hiện ra label khi giỏ hàng rỗng
    if (this.CartBook == null || this.lengthCartBook == 0) {
      this.checkViewCart = true;
    }
    else {
      this.checkViewCart = false;
    }
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
   
  }
  //get total count and price 
  getTotalCountAndPrice() {
  this.TongTien = 0;
    this.TongCount = 0;
    if (this.CartBook != null) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        this.TongTien += parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count);
        this.TongCount += parseInt(this.CartBook[i].count);

      }
    }
    $('#tongtien').html("&nbsp;" + this.TongTien.toString() + " đ");
    $('.cart_items').html(this.TongCount.toString());
    sessionStorage.setItem("TongTien",this.TongTien.toString());
    sessionStorage.setItem("TongCount",this.TongCount.toString());
  }
  getCountUpdate(event: any, id) {
    for (var i = 0; i < this.CartUpdate.length; i++) {
      if (this.CartUpdate[i]._id == id) {
        this.CartUpdate[i].count = event.target.value;
        break;
      }
    }
  }
  //edit count in cart
  updateCartBook(id) {
    //kiểm tra book[id].count có bằng 0 không ,... nếu =0 thì ==> gửi qua hàm xóa
    for (var i = 0; i < this.CartUpdate.length; i++) {
      //tìm id được chọn để edit 
      //nếu không phải thì backup 
      if (this.CartUpdate[i]._id == id) {
        if(this.CartUpdate[i].count==0)
        {
          this.deleteCartBook(id);
        }
      }
    }
    for (var i = 0; i < this.CartUpdate.length; i++) {
      //tìm id được chọn để edit 
      //nếu không phải thì backup 
      if (this.CartUpdate[i]._id != id) {
        this.CartUpdate[i].count = this.CartBook[i].count;
      }
    }
    sessionStorage.setItem("CartBook", JSON.stringify(this.CartUpdate));
   
    this.ngOnInit();
  }
  deleteCartBook(id) {
    var setconfirm = confirm('Bạn có muốn xóa cuốn sách này không ?')
    if (setconfirm == true) {

      for (var i = 0; i < this.lengthCartBook; i++) {
        if (this.CartBook[i]._id == id) {
          this.CartBook.splice(i, 1);
          break;
        }
      }
      sessionStorage.setItem("CartBook", JSON.stringify(this.CartBook));
      this.ngOnInit();
    }
  }
  editAddress(event: any) {
    this.address = event.target.value;
    console.log(this.address);
  }
  editPhone(event: any) {
    this.phone = event.target.value;
  }

  //click vào hình chuyển về detail
  ViewBookDetail(idBook){
    return this._router.navigate(["/bookDetail" + `/${idBook}`]);
  }
  //Lưu order và orderDetail
  public now: Date = new Date();
  checkoutWhenNull(){
    var setconfirm=confirm('Giỏ hàng của bạn đang trống , bạn có muốn dạo mua một vòng không ?')
    if (setconfirm == true) {
      this._router.navigate(['/bookCategory']);
    }
  }

  checkout() {
    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    else {
      this._customerService.getCustomerByUserID( this.accountSocial._id).subscribe(
        getcustomer => {
      
        this.phone=Object.values(getcustomer)[0].phone;
         this.address=Object.values(getcustomer)[0].address;
        });
      $(document).ready(function () {
        $('#cartModal').modal('show');
      });
    }
  }
  payCheckOut() {
    //lưu order
    //set time
    this.now = new Date();
    this.orders.orderDate = this.now.toString().substring(0, 24);
    //set user
    this.orders.customerID = this.accountSocial._id;
    //set bill
    this.orders.totalPrice = this.TongTien;
    if (this.CartBook) {
      //SendMail
      this.sendMail.name = this.accountSocial.username;
      this.sendMail.address = this.address;
      this.sendMail.email = this.accountSocial.email;
      this.sendMail.phone = this.phone;
      this.sendMail.orderDate = this.orders.orderDate;
      this.sendMail.totalPrice = this.orders.totalPrice.toString();
      this.sendMail.imgBook = "";
      this.sendMail.nameBook = "";
      this.sendMail.count = "";
      this.sendMail.price = "";

      //khai báo độ dài cartBook
      
      for (var i = 0; i < this.lengthCartBook; i++) {
      
        this.sendMail.count += this.CartBook[i].count + "next";
        this.sendMail.price += (parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook)).toString() + "next";
        this._bookService.getBookById(this.CartBook[i]._id).subscribe(
          getBook => {
            this.sendMail.imgBook += getBook['imgBook'] + "next";
            this.sendMail.nameBook += getBook['nameBook'] + "next";
           //nếu chạy tới cuốn sách cuối 
            if (this.CartBook[this.lengthCartBook-1]._id == getBook['_id']) {
              //sendmail
              this._sendMail.postsendMail(this.sendMail).subscribe(
                postSendMail => {
                  console.log("SendMail Success");
                },
                error => console.log(error)
              );
            }
          },
          error => console.log(error)
        );
      }
      //thực hiện lưu db (order - orderDetail - customer )
      this._orderService.postOrder(this.orders).subscribe(
        orderdata => {
          //Kiểm tra userInfo customer ( nếu chưa có thì tạo , có rồi thì cập nhật)
          this._customerService.getCustomerByUserID(this.orders.customerID).subscribe(
            getcustomer => {
              this.customer.userID = this.accountSocial._id;
              this.customer.email = this.accountSocial.email;
              this.customer.address = this.address;
              this.customer.name = this.accountSocial.username;
              this.customer.nickName = this.accountSocial.username;
              this.customer.phone = this.phone;
              //tạo mới 
              if (Object.values(getcustomer).length == 0) {

                this._customerService.postCustomer(this.customer).subscribe(
                  customerpost => {

                    console.log(customerpost);
                  },
                  error => console.log(error)
                );
              }
              //cập nhật
              else {
                //get id user để update
                this.customer._id = Object.values(getcustomer)[0]._id;

                this._customerService.putCustomer(this.customer).subscribe(
                  customerput => {

                    console.log(customerput);
                  },
                  error => console.log(error)
                );
              }
            },
            error => console.log(error)
          );
          //lưu order detail
          for (var i = 0; i < this.lengthCartBook; i++) {

            this.orderDetails = new OrderDetail;
            this.orderDetails.bookID = this.CartBook[i]._id;
            this.orderDetails.count = this.CartBook[i].count;
            this.orderDetails.orderID = orderdata['_id'];
            this.orderDetails.price = parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook);
            this._orderDetailService.postOrderDetail(this.orderDetails).subscribe(
              orderDetaildata => {
                sessionStorage.removeItem('CartBook');
                this.getTotalCountAndPrice();
                this._router.navigate(['/']);
              },
              error => console.log(error)
            );
          }

        },
        error => console.log(error)
      );
    }
  }
}
