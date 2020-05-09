import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../../app-services/customer-service/Customer.model';
import { OrderService } from '../../../app-services/order-service/order.service';
import { OrderDetailService } from '../../../app-services/orderDetail-service/orderDetail.service';
import { Order } from '../../../app-services/order-service/order.model';
import { OrderDetail } from '../../../app-services/orderDetail-service/orderDetail.model';
import { CustomerService } from '../../../app-services/customer-service/customer.service';
import { Book } from '../../../app-services/book-service/book.model';
import { BookService } from '../../../app-services/book-service/book.service';
import { Point } from 'src/app/app-services/point-service/point.model';
import { PointService } from 'src/app/app-services/point-service/point.service';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
declare var $: any;
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit {

  constructor(private _router: Router, private _order: OrderService, private _customer: CustomerService, private _orderDetail: OrderDetailService, private _book: BookService, private _pointService: PointService) { }
  //chứa thông tin giỏ hàng
  CartBook = [];

  orders: Order = new Order;
  list_all_customer: Array<Customer>;
  list_Order: Array<Order>;
  list_OrderDetail: Array<OrderDetail>;
  list_Book: Array<Book>;
  TongTien = 0;
  TongCount = 0;
  point: Point = new Point;
  lengthCartBook = 0;
  //thông tin login
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');

  ngOnInit() {
    this.script_Frontend();
    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    this.getAllOrder();
    this.getAllCustomer();
    this.getAllOrderDetail();
    this.getAllBook();

    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    // this.sortByDate();


  }
  script_Frontend() {
    $('#future-orders').css('display', 'none');
    $('#done-orders').css('display', 'none');

    $('#toggle-orders li').click(function () {
      $('#toggle-orders li').not(this).removeClass('selected');
      $(this).addClass('selected');
    });


    $('.fo').click(function () {
      $('#order-history').hide();
      $('#done-orders').hide();
      $('#future-orders').fadeIn('fast');
    });

    $('.oh').click(function () {
      $('#order-history').fadeIn('fast');
      $('#future-orders').hide();
      $('#done-orders').hide();
    });

    $('.com').click(function () {
      $('#order-history').hide();
      $('#future-orders').hide();
      $('#done-orders').fadeIn('fast');
    });

    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
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
  // get order by userID
  getAllOrder() {
    this._order.getOrderList().subscribe(
      listOrder => {
        this.list_Order = listOrder as Order[]; 
      // console.log(Date.parse((this.list_Order[0].orderDate).toString()))
      // console.log(Date.parse((this.list_Order[1].orderDate).toString()))
      },
      error => console.log(error)
    );
  }
   sortByDueDate() {
}
  getAllCustomer() {
    this._customer.getCustomerList().subscribe(
      allCustomerlist => {
        this.list_all_customer = allCustomerlist as Customer[];
      });
  }
  getAllOrderDetail() {
    this._orderDetail.getOrderDetailList().subscribe(
      allOrderDetailList => {
        this.list_OrderDetail = allOrderDetailList as OrderDetail[];
      });
  }
  getAllBook() {
    this._book.getBookList().subscribe(
      allBookList => {
        this.list_Book = allBookList as Book[]
      });
  }
  //update 
  ClickGiaoHang(orders: Order) {
    orders.status = "Inprogress";
    this._order.putOrder(orders).subscribe(
      order => {
        
        this.ngOnInit();

      });
  }
 
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

  ClickDaGiao(orders: Order) {
    orders.status = "Done";
    console.log(orders)
    this._customer.getUserIDByCustomerID(orders.customerID).subscribe(
      UserID => {


        this._order.putOrder(orders).subscribe(
          order => {
            this.point.point = parseInt((orders.totalPrice / 10000).toFixed(0));
            this.point.userID = Object.values(UserID)[0].userID;
            console.log(this.point);
            this._pointService.putPointByUserID(this.point).subscribe(
              pointNew => {
                
                localStorage.setItem("Point", Object.values(pointNew)[2]);
                // this.ngOnInit();  
              }
            );



          });
      }
    )

  }
}
