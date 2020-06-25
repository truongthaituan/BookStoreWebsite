
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

import { CartBookService } from 'src/app/app-services/cartBook-service/cartBook.service';
import { CartBook } from 'src/app/app-services/cartBook-service/cartBook.model';
import { Point } from 'src/app/app-services/point-service/point.model';
import { PointService } from 'src/app/app-services/point-service/point.service';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
declare var $: any;
declare let paypal: any;
//dataset Recommend
import { datasetRecommend } from '../../../app-services/recommendSys-service/dataRecommend-service/dataRecommend.model'
import { DatasetRecommendService } from 'src/app/app-services/recommendSys-service/dataRecommend-service/dataRecommend.service';

@Component({
  selector: 'app-book-cart-payment',
  templateUrl: './book-cart-payment.component.html',
  styleUrls: ['./book-cart-payment.component.css']
})
export class BookCartPaymentComponent implements OnInit {
  constructor(private _router: Router, private route: ActivatedRoute, private _orderService: OrderService, private _orderDetailService: OrderDetailService,
    private _customerService: CustomerService, private _sendMail: SendMailService, private _bookService: BookService, private _cartBookDB: CartBookService
    , private _pointService: PointService,private _discountCode : DiscountCodeService, private _datasetRecommend : DatasetRecommendService) {

  }
  //chứa thông tin giỏ hàng
  CartBook = [];
  //chứa thông tin giỏ hàng dùng trong edit/update
  CartUpdate = [];
  sendMail: SendMail = new SendMail;
  orders: Order = new Order;
  orderDetails: OrderDetail = new OrderDetail;
  customer: Customer = new Customer;
  point: Point = new Point;
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
  cartBookDB: CartBook = new CartBook;
  public loading: boolean = true;
  discountCode: DiscountCode = new DiscountCode;
  paymentLoading=false;
  datasetRecommend : datasetRecommend = new datasetRecommend;
  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    if(localStorage.getItem('DiscountCode')!=null){
      this.discountCode=JSON.parse(localStorage.getItem('DiscountCode'));
    }else{
      this.discountCode.discountCode=0;
    }
    if (localStorage.getItem('statusLogin') == 'true') {
      $("#checkLogin").addClass("active");
      $("#customer").addClass("active");
      $("#payment").addClass("active");
    }
    //paypal
    if (!this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-button');
        this.loading = false;
      });
    }
    let customer_id = this.route.snapshot.paramMap.get("customer_id");
    this.getTotalCountAndPrice();
    this.getCustomerByID(customer_id);
    console.log(this.CartBook);
    this.paymentLoading=false;
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
  addPoint = 0;
  getTotalCountAndPrice() {
    this.TongTien = 0;
    this.TongCount = 0;
    this.addPoint = 0;
    this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
    this.cartBookLength(this.CartBook);
    if (this.CartBook != null) {
      for (var i = 0; i < this.lengthCartBook; i++) {
        this.TongTien += parseInt((parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count)*(100-this.CartBook[i].sale)/100).toFixed(0));
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
  //get customer By ID
  getCustomerByID(id) {
    this._customerService.getCustomerById(id).subscribe(
      getcustomer => {
        this.customer = getcustomer as Customer;
        console.log(this.customer);
        this.createJson(this.CartBook);
      },
      error => console.log(error)
    );
  }
  goToBookCart() {
    this._router.navigate(['/cartBook']);
  }
  goToShipping() {
    this._router.navigate(['/shipping']);
  }
  //   //Lưu order và orderDetail
  public now: Date = new Date();

  payCheckOut() {
    //lưu order
    //set time
    this.now = new Date();
    this.orders.orderDate = this.now.toUTCString();
    //set user
    this.orders.customerID = this.accountSocial._id;
    //set bill

    if (this.CartBook) {
      //SendMail
      this.sendMail.name = this.customer.name;
      this.sendMail.address = this.customer.address ;
      this.sendMail.email = this.customer.email;
      this.sendMail.phone = this.customer.phone;
      this.sendMail.orderDate = this.orders.orderDate;
      this.sendMail.sale= "";
      this.sendMail.imgBook = "";
      this.sendMail.nameBook = "";
      this.sendMail.count = "";
      this.sendMail.price = "";
      this.sendMail.paymentOption = this.orders.paymentOption;

      //khai báo độ dài cartBook

      for (var i = 0; i < this.lengthCartBook; i++) {

        this.sendMail.count += this.CartBook[i].count + "next";
        if (this.IsPaypal) {
          this.sendMail.price += (this.CartBook[i].priceBook / 23632*(100-this.CartBook[i].sale)/100).toFixed(2) + "next";
          this.sendMail.feeShip =  parseFloat((this.customer.feeShip/23632*(100-this.CartBook[i].sale)/100).toFixed(2));
        } else {
          this.sendMail.price += this.CartBook[i].priceBook + "next";
          this.sendMail.feeShip =  this.customer.feeShip;
        }
        this._bookService.getBookById(this.CartBook[i]._id).subscribe(
          getBook => {
            this.sendMail.imgBook += getBook['imgBook'] + "next";
            this.sendMail.nameBook += getBook['nameBook'] + "next";
            this.sendMail.sale += getBook['sale'] + "next";
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

    if(this.discountCode._id!=null){
      //update discount code
      this.discountCode.status=1;
      this.putDiscountCode(this.discountCode);
    }
    this.sendMail.discountCode =  this.discountCode.discountCode;
    
    if (this.IsPaypal) {
      this.sendMail.totalPrice = this.TongTienPayPal.toString();
      this._sendMail.postsendMailPayPal(sendMail).subscribe(
        postSendMail => {

          console.log("SendMail Success");
          //show alert
          this.alertMessage = "Thanh toán thành công, mọi thông tin thanh toán đã được gửi qua email " + sendMail.email;
          this.alertSucess = true;
          setTimeout(() => { this.alertMessage = ""; this.alertSucess = false }, 4000);
          //thực hiện lưu db (order - orderDetail - customer )
          this.postOrder(this.orders);


        },
        error => console.log(error)
      );

    } else {
      this.sendMail.totalPrice = this.TongTien.toString();
      this._sendMail.postsendMail(sendMail).subscribe(
        postSendMail => {

          console.log("SendMail Success");
          //show alert
          this.alertMessage = "Thanh toán thành công, mọi thông tin thanh toán đã được gửi qua email " + sendMail.email;
          this.alertSucess = true;
          setTimeout(() => { this.alertMessage = ""; this.alertSucess = false }, 4000);
          //thực hiện lưu db (order - orderDetail - customer )
          this.postOrder(this.orders);


        },
        error => console.log(error)
      );
    }
  }

  //post order
  postOrder(orders: Order) {
    orders.customerID = this.customer._id;
    this.now = new Date();
    orders.orderDate = this.now.toString().substring(0, 24);
    orders.totalPrice = this.TongTien;
    orders.discountCode= this.discountCode.discountCode;
    orders.feeShip= this.customer.feeShip;
    this._orderService.postOrder(orders).subscribe(
      orderdata => {

        //lưu order detail
        for (var i = 0; i < this.lengthCartBook; i++) {

          this.orderDetails = new OrderDetail;
          this.orderDetails.bookID = this.CartBook[i]._id;
          this.orderDetails.count = this.CartBook[i].count;
          this.orderDetails.orderID = orderdata['_id'];
          this.orderDetails.price = this.CartBook[i].priceBook;
          this.orderDetails.sale =  this.CartBook[i].sale;
          //post order Detail
          this.postOrderDetail(this.orderDetails);

        }

      },
      error => console.log(error)
    );
  }
  //post order Detail
  postOrderDetail(orderDetails: OrderDetail) {
    this.DataSetRecommend(orderDetails.bookID,orderDetails.count,0,0)
    this._orderDetailService.postOrderDetail(orderDetails).subscribe(
      orderDetaildata => {
        localStorage.removeItem('CartBook');
        localStorage.removeItem('DiscountCode');
        //delete allcartbookDB by userID
        this.deleteAllCartBookDBByUserID(this.accountSocial._id);
        this.getTotalCountAndPrice();
        this.IsPaypal = false;
        
        
        this._router.navigate(['/']);
      },
      error => console.log(error)
    );
  }
  //pay by cash

  payByCash() {
    this.paymentLoading=true;
    this.orders.paymentOption = "Cash";
    this.payCheckOut();
  }
  //#region paypal
  //create a json for paypal
  JsonCartBook: any
  CartBook2 = []
  TongTienPayPal: any
  IsPaypal = false

  createJson(CartBook: any) {
    this.TongTienPayPal = 0;
    for (var i = 0; i < this.lengthCartBook; i++) {
        var infoCart = {
        name: CartBook[i].nameBook, price: parseFloat((CartBook[i].priceBook / 23632*(100-CartBook[i].sale)/100).toFixed(2)),
        currency: "USD", quantity: CartBook[i].count
      };
  
      this.CartBook2.push(infoCart);
      this.TongTienPayPal += CartBook[i].count * parseFloat((CartBook[i].priceBook / 23632*(100-CartBook[i].sale)/100).toFixed(2));
        }
    this.TongTienPayPal = this.TongTienPayPal.toFixed(2);
  
  }
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
                "items": this.CartBook2
                ,"shipping_address": {
                  "recipient_name": this.customer.name,
                  "line1": this.customer.address,
                  "line2": "",
                  "city": ".",
               
                  "phone": this.customer.phone,
                  "postal_code": ".",
                  "country_code": "VN"
                }
              },
              "amount": {
                "currency": "USD",
                "total": this.TongTienPayPal,
                "details": {
                  "subtotal": this.TongTienPayPal
                }
              },
              "description": "This is the payment description."
            }
          ]

          // [
          //   { amount: { total: this.paymentAmount, currency: 'USD' } }
          // ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        this.IsPaypal = true;
        this.orders.paymentOption = "Online";
        this.payCheckOut();

      });
    }
  };
  public loadPaypalScript(): Promise<any> {
  
    this.paymentLoading=true;
    this.didPaypalScriptLoad = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    })
   
  }
  //#endregion  
  deleteAllCartBookDBByUserID(id) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {

      this._cartBookDB.deleteAllCartBookByUserID(id).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }
  //update discount code
  putDiscountCode(discountCode:DiscountCode) {
      this._discountCode.putDiscountCode(discountCode).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
    DataSetRecommend(bookId,buy,rate,view){
      if(this.accountSocial._id){
        this.datasetRecommend.userID = this.accountSocial._id;
        this.datasetRecommend.bookID = bookId;
        //các value == 0 trừ click xem = 1  ...--> vào trong backend sẽ tự cộng
        this.datasetRecommend.buy =buy ; 
        this.datasetRecommend.rate=rate;
        this.datasetRecommend.click=view;
        console.log(this.datasetRecommend)
        this._datasetRecommend.putOrPostDatasetRecommend(this.datasetRecommend).subscribe(
          req => {
            console.log(req);
          },
          error => console.log(error)
        );
      }
    }
}
