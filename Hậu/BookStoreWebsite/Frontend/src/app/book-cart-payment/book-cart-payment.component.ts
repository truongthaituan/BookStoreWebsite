
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
declare let paypal: any;

@Component({
  selector: 'app-book-cart-payment',
  templateUrl: './book-cart-payment.component.html',
  styleUrls: ['./book-cart-payment.component.css']
})
export class BookCartPaymentComponent implements OnInit {
  constructor(private _router: Router,private route: ActivatedRoute, private _orderService: OrderService, private _orderDetailService: OrderDetailService,
    private _customerService: CustomerService, private _sendMail: SendMailService, private _bookService: BookService) {

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
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  lengthCartBook = 0;

  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  //paypal
  public loading: boolean = true;
  ngOnInit() {
    if(localStorage.getItem('statusLogin') == 'true'){
      $("#checkLogin").addClass("active");
      $("#customer").addClass("active");
      $("#payment").addClass("active");
    }
    //paypal
    if(!this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-button');
        this.loading = false;
      });
    }
  let customer_id = this.route.snapshot.paramMap.get("customer_id");
  this.getTotalCountAndPrice();
  this.getCustomerByID(customer_id);
  console.log(this.CartBook);
 
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
  
  //get customer By ID
  getCustomerByID(id){
    this._customerService.getCustomerById(id).subscribe(
            getcustomer => {
              this.customer = getcustomer as Customer;
              console.log(this.customer);
              this.createJson(this.CartBook);
            },
            error => console.log(error)
          );
  }
  goToBookCart()
  {
    this._router.navigate(['/cartBook']);
  }
  goToShipping()
  {
    this._router.navigate(['/shipping']);
  }
//   //Lưu order và orderDetail
  public now: Date = new Date();

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
      this.sendMail.name = this.customer.name;
      this.sendMail.address = this.customer.address+','+this.customer.wards+','+this.customer.districts+','+this.customer.city;
      this.sendMail.email = this.customer.email;
      this.sendMail.phone = this.customer.phone;
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
            if (this.CartBook[this.lengthCartBook - 1]._id == getBook['_id']) {
              //sendmail -->thực hiện lưu db (order - orderDetail - customer )
              console.log(this.sendMail);
              this.sendMailCartBook(this.sendMail);
            }
          },
          error => console.log(error)
        );
      }

    }
  }

  // sendmail
  sendMailCartBook(sendMail: SendMail) {
    this._sendMail.postsendMail(sendMail).subscribe(
      postSendMail => {
     
          console.log("SendMail Success");
          //show alert
          this.alertMessage = "Thanh toán thành công, mọi thông tin thanh toán đã được gửi qua email " + sendMail.email;
          this.alertSucess = true;
          setTimeout(() => { this.alertMessage = ""; this.alertSucess = false }, 6000);
          //thực hiện lưu db (order - orderDetail - customer )
          this.postOrder(this.orders);
        

      },
      error => console.log(error)
    );
  }
  
//post order
postOrder(orders: Order) {
  orders.customerID=this.customer._id;
  this.now = new Date();
  orders.orderDate = this.now.toString().substring(0, 24);
  orders.totalPrice= this.TongTien;
  this._orderService.postOrder(orders).subscribe(
    orderdata => {
     
      //lưu order detail
      for (var i = 0; i < this.lengthCartBook; i++) {

        this.orderDetails = new OrderDetail;
        this.orderDetails.bookID = this.CartBook[i]._id;
        this.orderDetails.count = this.CartBook[i].count;
        this.orderDetails.orderID = orderdata['_id'];
        this.orderDetails.price = parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook);
        //post order Detail
        this.postOrderDetail(this.orderDetails);
      }

    },
    error => console.log(error)
  );
} 
  //post order Detail
  postOrderDetail(orderDetails: OrderDetail) {
    this._orderDetailService.postOrderDetail(orderDetails).subscribe(
      orderDetaildata => {
        localStorage.removeItem('CartBook');
        this.getTotalCountAndPrice();
        setTimeout(() => { this._router.navigate(['/']); }, 8000);

      },
      error => console.log(error)
    );
  }

//#region paypal
//create a json for paypal
JsonCartBook :any
createJson(CartBook:any){
  this.JsonCartBook="";
  for (var i = 0; i < this.lengthCartBook; i++) {
    this.JsonCartBook+='{"name":"'+this.customer.name+'","price":"'+CartBook[i].priceBook+'","currency":"USD","quantity":"'+CartBook[i].count+'" },'
  }
console.log("--------->");

console.log(this.JsonCartBook);
console.log("--------->");
}
  title = 'app';
  public didPaypalScriptLoad: boolean = false;
  public paymentAmount: number = 1000;
  totalcount = 150
  public paypalConfig: any = {
    env: 'sandbox',
    client: {
      sandbox: 'AXOgVTEdHkhFIylRT0CKOVDP8sQBp-qN-_OKdpI97zqA5rfD9glaEjAIljJ3vbZZhSSG9M4Fl2Vvl8ba',
      production: 'xxxxxxxxxx'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: 
          [{
            "item_list": {
              "items":[{"name":"undefined","price":"46900","currency":"USD","quantity":"2" },{"name":"undefined","price":"52500","currency":"USD","quantity":"5" },{"name":"undefined","price":"52900","currency":"USD","quantity":"3" },{"name":"undefined","price":"73500","currency":"USD","quantity":"10" },]
            },
            "amount": {
                "currency": "USD",
                "total": this.TongTien,
                  "details": {
                    "subtotal": this.TongTien
   
                  }
            },
            "description": "This is the payment description."
        }]

          // [
          //   { amount: { total: this.paymentAmount, currency: 'USD' } }
          // ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        this.postOrder(this.orders);
      });
    }
  };
  public loadPaypalScript(): Promise<any> {
    this.didPaypalScriptLoad = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }
//#endregion  
}
