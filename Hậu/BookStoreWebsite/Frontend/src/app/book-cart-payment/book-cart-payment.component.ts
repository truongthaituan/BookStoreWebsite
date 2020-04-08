
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
    //paypal
    if(!this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-button');
        this.loading = false;
      });
    }
  let customer_id = this.route.snapshot.paramMap.get("customer_id");
  this.getCustomerByID(customer_id);
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
            },
            error => console.log(error)
          );
  }
//   //Lưu order và orderDetail
//   public now: Date = new Date();

//   // sendmail
//   sendMailCartBook(sendMail: SendMail) {
//     this._sendMail.postsendMail(sendMail).subscribe(
//       postSendMail => {
//         if (postSendMail == "Please check your email") {
//           this.EmailCheck = false;
//           console.log("SendMail False");
//           //show alert
//           this.alertMessage = "Thanh toán thất bại , vui lòng kiểm tra lại thông tin cá nhân trước khi thanh toán"
//           this.alertFalse = true;
//           setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 6000);

//         } else {
//           console.log("SendMail Success");
//           //show alert
//           this.alertMessage = "Thanh toán thành công, mọi thông tin thanh toán đã được gửi qua email " + sendMail.email;
//           this.alertSucess = true;
//           setTimeout(() => { this.alertMessage = ""; this.alertSucess = false }, 6000);
//           //thực hiện lưu db (order - orderDetail - customer )
//           this.postOrder(this.orders);
//         }

//       },
//       error => console.log(error)
//     );
//   }
  
//   //get customer by userID
//   getCustomerByUserID(Userid) {
//     this._customerService.getCustomerByUserID(Userid).subscribe(
//       getcustomer => {
//         this.customer.userID = this.accountSocial._id;
//         this.customer.email = this.email;
//         this.customer.address = this.address;
//         this.customer.name = this.username;
 
//         this.customer.phone = this.phone;
//       },
//       error => console.log(error)
//     );
//   }

  
//   //post order Detail
//   postOrderDetail(orderDetails: OrderDetail) {
//     this._orderDetailService.postOrderDetail(orderDetails).subscribe(
//       orderDetaildata => {
//         localStorage.removeItem('CartBook');
//         this.getTotalCountAndPrice();
//         setTimeout(() => { this._router.navigate(['/']); }, 8000);

//       },
//       error => console.log(error)
//     );
//   }
// //post order
// postOrder(orders: Order) {
//   this._orderService.postOrder(orders).subscribe(
//     orderdata => {
//       //Kiểm tra userInfo customer ( nếu chưa có thì tạo , có rồi thì cập nhật)
//       this.getCustomerByUserID(orders.customerID);
//       //lưu order detail
//       for (var i = 0; i < this.lengthCartBook; i++) {

//         this.orderDetails = new OrderDetail;
//         this.orderDetails.bookID = this.CartBook[i]._id;
//         this.orderDetails.count = this.CartBook[i].count;
//         this.orderDetails.orderID = orderdata['_id'];
//         this.orderDetails.price = parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook);
//         //post order Detail
//         this.postOrderDetail(this.orderDetails);
//       }

//     },
//     error => console.log(error)
//   );
// } 
//   payCheckOut() {
//     //lưu order
//     //set time
//     this.now = new Date();
//     this.orders.orderDate = this.now.toString().substring(0, 24);
//     //set user
//     this.orders.customerID = this.accountSocial._id;
//     //set bill
//     this.orders.totalPrice = this.TongTien;
//     if (this.CartBook) {
//       //SendMail
//       this.sendMail.name = this.username;
//       this.sendMail.address = this.address;
//       this.sendMail.email = this.email;
//       this.sendMail.phone = this.phone;
//       this.sendMail.orderDate = this.orders.orderDate;
//       this.sendMail.totalPrice = this.orders.totalPrice.toString();
//       this.sendMail.imgBook = "";
//       this.sendMail.nameBook = "";
//       this.sendMail.count = "";
//       this.sendMail.price = "";

//       //khai báo độ dài cartBook

//       for (var i = 0; i < this.lengthCartBook; i++) {

//         this.sendMail.count += this.CartBook[i].count + "next";
//         this.sendMail.price += (parseInt(this.CartBook[i].count) * parseInt(this.CartBook[i].priceBook)).toString() + "next";
//         this._bookService.getBookById(this.CartBook[i]._id).subscribe(
//           getBook => {
//             this.sendMail.imgBook += getBook['imgBook'] + "next";
//             this.sendMail.nameBook += getBook['nameBook'] + "next";
//             //nếu chạy tới cuốn sách cuối 
//             if (this.CartBook[this.lengthCartBook - 1]._id == getBook['_id']) {
//               //sendmail -->thực hiện lưu db (order - orderDetail - customer )
//               console.log(this.sendMail);
//               this.sendMailCartBook(this.sendMail);
//             }
//           },
//           error => console.log(error)
//         );
//       }

//     }
//   }



//#region paypal
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
                "items": [{
                    "name": "books",
                    "sku": "sờ cu",
                    "price": "50.00",
                    "currency": "USD",
                    "quantity": 2
                },
                {
                  "name": "books2",
                  "sku": "sờ cu",
                  "price": "50.00",
                  "currency": "USD",
                  "quantity": 1
              }]
            },
            "amount": {
                "currency": "USD",
                "total": this.totalcount,
                  "details": {
                    "subtotal": this.totalcount
                    // "tax": "0.07",
                    // "shipping": "0.03",
                    // "handling_fee": "1.00",
                    // "shipping_discount": "-1.00",
                    // "insurance": "0.01"
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
        // show success page
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
