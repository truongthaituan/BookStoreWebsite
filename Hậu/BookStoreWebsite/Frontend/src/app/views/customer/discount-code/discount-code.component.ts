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

  discountCodes: Array<DiscountCode> = new Array<DiscountCode>();

  //thông tin login
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');

  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    this.getDisCountCodeByUserID();
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
    this._discountCode.getDiscountCodeByUserIDAndStatus(this.accountSocial._id).subscribe(
      listDiscountCode => {
        this.discountCodes = listDiscountCode as DiscountCode[]
        console.log(this.discountCodes);
      },
      error => console.log(error)
    );
  }
}
