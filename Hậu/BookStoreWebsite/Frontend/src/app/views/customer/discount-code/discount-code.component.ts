import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
declare var $: any;
@Component({
  selector: 'app-discount-code',
  templateUrl: './discount-code.component.html',
  styleUrls: ['./discount-code.component.css']
})
export class DiscountCodeComponent implements OnInit {

  constructor(private _router: Router,private _discountCode : DiscountCodeService) { }
  //chứa thông tin giỏ hàng
  CartBook = [];
  TongTien = 0;
  TongCount = 0;
  lengthCartBook = 0;
  discountCodes: Array<DiscountCode> = new Array<DiscountCode>();

  //thông tin login
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');

  ngOnInit() {

    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    this.getDisCountCodeByUserID();
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
  goToOrderHistory(){
    this._router.navigate(['/orderHistory'])
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode'])
  }
  goToBookCart(Object:any){
    localStorage.setItem("DiscountCode",JSON.stringify(Object));
    this._router.navigate(['/cartBook'])
  }
  getDisCountCodeByUserID(){
    this._discountCode.getDiscountCodeByUserID(this.accountSocial._id).subscribe(
      listDiscountCode => {
        this.discountCodes = listDiscountCode as DiscountCode[]
        console.log(this.discountCodes);
      },
      error => console.log(error)
    );
  }
}
