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
import { BookService} from '../app-services/book-service/book.service';
declare var $: any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],

})
export class BookCartComponent implements OnInit {

  constructor(private _router: Router, private _orderService: OrderService, private _orderDetailService: OrderDetailService, 
    private _customerService: CustomerService, private _sendMail : SendMailService,private _bookService :BookService) {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });
  }
  CartBook = [];
  CartUpdate = [];
  sendMail: SendMail= new SendMail;
  orders: Order = new Order;
  orderDetails: OrderDetail = new OrderDetail;
  customer: Customer = new Customer;
  TongTien = 0;
  userGoogle = JSON.parse(sessionStorage.getItem('userGoogle'));
  statusLogin = sessionStorage.getItem('statusLogin');
  //change info payment
  address = "";
  phone="";
  checkViewCart=false;
  ngOnInit() {
    //get tong tien
    this.CartBook = JSON.parse(sessionStorage.getItem("CartBook"));
    this.CartUpdate = JSON.parse(sessionStorage.getItem("CartBook"));
    console.log(this.CartBook);
    if(this.CartBook==null|| this.CartBook.length==0)
    {
      this.checkViewCart= true;
    }else{this.checkViewCart=false;}
    this.TongTien = 0;
    if (this.CartBook != null) {
      for (var i = 0; i < this.CartBook.length; i++) {
        this.TongTien += parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count);
      }
    }
  
  }

  getCountUpdate(event: any, id) {
    for (var i = 0; i < this.CartUpdate.length; i++) {
      if (this.CartUpdate[i]._id == id) {
        this.CartUpdate[i].count = event.target.value;
        break;
      }
    }
  }
  updateCartBook(id) {
    for (var i = 0; i < this.CartUpdate.length; i++) {
      if (this.CartUpdate[i]._id != id) {
        this.CartUpdate[i].count = this.CartBook[i].count;
      }
    }
    sessionStorage.setItem("CartBook", JSON.stringify(this.CartUpdate));
    // console.log(JSON.parse(sessionStorage.getItem("CartBook")));
    this.ngOnInit();
  }
  deleteCartBook(id) {
    var setconfirm = confirm('Bạn có muốn xóa cuốn sách này không ?')
    if (setconfirm == true) {

      for (var i = 0; i < this.CartBook.length; i++) {
        if (this.CartBook[i]._id == id) {
          this.CartBook.splice(i, 1);
          break;
        }
      }
      sessionStorage.setItem("CartBook", JSON.stringify(this.CartBook));
      this.ngOnInit();
    }
  }


  editAddress(event : any) {
    this.address = event.target.value;
    console.log(this.address);
  }
  editPhone(event : any) {
    this.phone = event.target.value;
  }

  //Lưu order và orderDetail
  public now: Date = new Date();
  checkout() {
    $(document).ready(function () {
      $('#cartModal').modal('show');
    });
  }
  payCheckOut() {
    //lưu order

    //set time
    this.now = new Date();
    this.orders.orderDate = this.now.toString().substring(0, 24);
    //set user
    this.orders.customerID = this.userGoogle._id;
    //set bill
    this.orders.totalPrice = this.TongTien;
    if (this.CartBook) {
      //SendMail
     
      this.sendMail.name=this.userGoogle.username;
      this.sendMail.address=this.address;
      this.sendMail.email=this.userGoogle.email;
      this.sendMail.phone=this.phone;
      this.sendMail.orderDate= this.orders.orderDate;
      this.sendMail.totalPrice= this.orders.totalPrice.toString();
      this.sendMail.imgBook="";
      this.sendMail.nameBook="";
      this.sendMail.count="";
      this.sendMail.price="";
      for (var i = 0; i < this.CartBook.length; i++) {
      this.sendMail.count+=this.CartBook[i].count+"next";
      this.sendMail.price+=(parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook)).toString()+"next";
      this._bookService.getBookById(   this.CartBook[i]._id).subscribe(
        getBook =>{
         
          this.sendMail.imgBook+= getBook['imgBook']+"next";
          this.sendMail.nameBook+=getBook['nameBook']+"next";
       
          console.log(i);
          console.log(this.CartBook.length);
          if(i==this.CartBook.length)
          {
            this._sendMail.postsendMail(this.sendMail).subscribe(
              postSendMail=>{
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
          
              this.customer.userID=this.userGoogle._id;
              this.customer.email=this.userGoogle.email;
              this.customer.address=this.address;
              this.customer.name=this.userGoogle.username;
              this.customer.nickName=this.userGoogle.username;
              this.customer.phone=this.phone;
              
              //tạo mới 
             if(Object.values(getcustomer).length==0){
             
              this._customerService.postCustomer(this.customer).subscribe(
                customerpost => {
            
                 console.log(customerpost);
                },
                error => console.log(error)
              );
             }
             //cập nhật
             else{
              //get id user để update
              this.customer._id= Object.values(getcustomer)[0]._id;
              
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
          for (var i = 0; i < this.CartBook.length; i++) {
            
            this.orderDetails = new OrderDetail;
            this.orderDetails.bookID = this.CartBook[i]._id;
            this.orderDetails.count = this.CartBook[i].count;
            this.orderDetails.orderID = orderdata['_id'];
            this.orderDetails.price = parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook);
            this._orderDetailService.postOrderDetail(this.orderDetails).subscribe(
              orderDetaildata => {
                sessionStorage.removeItem('CartBook');
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
