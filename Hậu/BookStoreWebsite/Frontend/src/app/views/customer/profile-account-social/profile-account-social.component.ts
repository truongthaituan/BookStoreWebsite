import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialaccountService } from 'src/app/app-services/socialAccount-service/socialaccount.service';
import { Location } from '@angular/common';
import { SocialAccount } from 'src/app/app-services/socialAccount-service/socialaccount.model';
declare var $:any;
@Component({
  selector: 'app-profile-account-social',
  templateUrl: './profile-account-social.component.html',
  styleUrls: ['./profile-account-social.component.css']
})
export class ProfileAccountSocialComponent implements OnInit {

  constructor(private _router: Router, private socialAccountService: SocialaccountService,
     private location: Location, private route: ActivatedRoute) { }
     loginBy: String = ""
     statusLogin = localStorage.getItem('statusLogin');
  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    let googleID = JSON.parse(localStorage.getItem("accountSocial")).google_id;
    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    this.loginBy = localStorage.getItem('loginBy');
    this.getSocialAccountByGoogleID(googleID);
  }
  getSocialAccountByGoogleID(googleID){
    this.socialAccountService.getSocialAccountByGoogleID(googleID).subscribe(res => {
      console.log(res)
      this.socialAccountService.socialAccount = res as SocialAccount;
    })
  }
  cancel(){
    this.location.back();
  }
  moveToProfileDetail(){
    this._router.navigate(['/accountProfile'])
  }
  moveToProfileAccountSocial(){
    this._router.navigate(['/accountProfileSocial'])
  }
  goToOrderHistory(){
    this._router.navigate(['/orderHistory'])
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode'])
  }
  goToFavorite(){
    this._router.navigate(['/favorites'])
  }
}
