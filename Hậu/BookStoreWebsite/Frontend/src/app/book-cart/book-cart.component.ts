import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../../app-service/author-service/author.service';
import { Author } from '../../app-service/author-service/author.model';
import { BookService } from '../../app-service/book-service/book.service';
import { Book } from '../../app-service/book-service/book.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Order} from '../../app-service/order-service/order.model';
import { OrderService} from '../../app-service/order-service/order.service';
import { OrderDetail} from '../../app-service/orderDetail-service/orderDetail.model';
import { OrderDetailService} from '../../app-service/orderDetail-service/orderDetail.service';
declare var $: any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],

})
export class BookCartComponent implements OnInit {

  constructor(private _router: Router,private _orderService :OrderService ,private _orderDetailService: OrderDetailService) {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });
  }
  CartBook = [];
  CartUpdate = [];
  orders : Order= new Order;
  orderDetails : OrderDetail= new OrderDetail;
  TongTien = 0;
  
  ngOnInit() {
    //get tong tien
    this.CartBook = JSON.parse(sessionStorage.getItem("CartBook"));
    this.CartUpdate = JSON.parse(sessionStorage.getItem("CartBook"));
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
			if (this.CartBook[i]._id== id) {
				this.CartBook.splice(i, 1);
				break;
			}
		}
		sessionStorage.setItem("CartBook",JSON.stringify(this.CartBook));
    this.ngOnInit();
    }
  }
  //Lưu order và orderDetail
  public now: Date = new Date();
  checkout() {
    //lưu order

    //set time
    this.now = new Date();
    this.orders.orderDate = this.now.toString().substring(0,24);
    //set user
    this.orders.customerID="hau";
    //set bill
    this.orders.totalPrice=this.TongTien;
    this._orderService.postOrder(this.orders).subscribe(
      orderdata => {
        //lưu order detail
        for(var i=0;i<this.CartBook.length;i++)
        {
      
          this.orderDetails = new OrderDetail;
          this.orderDetails.bookID=this.CartBook[i]._id;
          this.orderDetails.count=this.CartBook[i].count;
          this.orderDetails.orderID=orderdata['_id'];
          this.orderDetails.price=parseInt(this.CartBook[i].count)* parseInt(this.CartBook[i].priceBook);
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
