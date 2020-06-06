import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../app-services/user-service/user.service';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
  AuthService
} from 'ng4-social-login';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Response } from '../../app-services/response/response.model';
import { User } from '../../app-services/user-service/user.model';
import { SocialaccountService } from '../../app-services/socialAccount-service/socialaccount.service';
import { SocialAccount } from 'src/app/app-services/socialAccount-service/socialaccount.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


declare var $: any;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  public user: any = SocialUser;
  errStringLogin: String = ""
  errRegister: String = ""
  statusRegister: Boolean
  showErrorMessage: Boolean = false;
  errorStr: string = ''
  statusLogin: Boolean = false
  alertMessage: string = ''
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    cpass: new FormControl(null, Validators.required),
    imageUrl: new FormControl(null),
  })

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, Validators.required)
  });
  constructor(private _router: Router, private _userService: UserService,private spinnerService: Ng4LoadingSpinnerService,
    private socialAuthService: AuthService, private socialAccountService: SocialaccountService) {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });

  }
  
  socialUser: SocialUser;
  CartBook = [];
	TongTien = 0;
  TongCount = 0;
  lengthCartBook = 0;
  templogin = 0;
  ngOnInit() {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });
    this.initialAccount();
    this.getTotalCountAndPrice();
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
  initialAccount() {
    this.socialAccountService.socialAccount = ({
      _id: null,
      email: '',
      username: '',
      imageUrl: '',
      facebook_id: '',
      google_id: '',
      role: ""
    });
  }
  register() {
    if (!this.registerForm.valid) {
      alert("Mời nhập đầy đủ thông tin và nhập email theo cú pháp ***@***.***")
      return;
    }
    else
      if (this.registerForm.controls.password.value != this.registerForm.controls.cpass.value) {
        alert("Xác nhận mật khẩu không đúng!");
        return;
      }
      else {
        this.registerForm.value.role = "CUSTOMER";
        // console.log(JSON.stringify(this.registerForm.value)); 
        this.spinnerService.show();
        setTimeout(()=>this.spinnerService.hide(),3300)
        this._userService.register(JSON.stringify(this.registerForm.value))
          .subscribe(
            data => {
            //   const response: Response = data as Response;
            // if (response.status == false) {
            //   console.log(response.message)
            //   this.errRegister = "Email đã tồn tại! Vui lòng chọn email khác!";
            //   setTimeout(() => {  this.errRegister = null; }, 3000);
            // }
            // else {
            //   // console.log(data);
            //   this.statusRegister = true;
            //   setTimeout(() => {  this.statusRegister = false; }, 3000);
            //   this.registerForm.reset();
            //   console.log("Add User Successfully!");
            //   }
           
              if(data == "Email has been sent--Please confirm"){
                this.statusRegister = true;
                  setTimeout(() => {  this.statusRegister = false; }, 3000);
                  this.registerForm.reset();
                  // console.log("Add User Successfully!");
              }
            });
          }
  }

  login() {
    if (!this.loginForm.valid) {
      alert("Mời nhập đầy đủ thông tin và nhập email theo cú pháp ***@***.***");
      return;
    }
    else {
      this.showErrorMessage = false;
      //goij method login từ userService
      this._userService.login(JSON.stringify(this.loginForm.value)).subscribe((res) => {
        //gọi object response
        const response: Response = res as Response;
        if (response.status == false) {
          // console.log(response.message)
          this.errStringLogin = response.message
        }
        else {
          localStorage.setItem("token", response.token)
          //admin
          if ((response.obj as User).role == "ADMIN") {
            window.location.href = "/dashboard"
            localStorage.setItem('accountSocial', JSON.stringify((response.obj as User)));
            this.statusLogin = true;
            localStorage.setItem('statusLogin', String(this.statusLogin));
            localStorage.setItem('loginBy', "loginbt");
          }
          //member
          else  if((response.obj as User).role == "CUSTOMER"){
            window.location.href = "/"
            console.log(response.obj as User)
            localStorage.setItem('accountSocial', JSON.stringify((response.obj as User)));
            this.statusLogin = true;
            localStorage.setItem('statusLogin', String(this.statusLogin));
            localStorage.setItem('loginBy', "loginbt");
          }
        }
      })
    }
  }
  //Login with google
  googleLogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user.id);
      //Call method loginGoogle from SocialAccountService
      this.socialAccountService.loginGoogle(this.user.id).subscribe((res) => {
        const response: Response = res as Response;
        //if status from back-end is false
        if (!response.status) {
          //Add account google into DB
          this.socialAccountService.socialAccount.google_id = this.user.id;
          this.socialAccountService.socialAccount.username = this.user.name;
          this.socialAccountService.socialAccount.email = this.user.email;
          this.socialAccountService.socialAccount.imageUrl = this.user.photoUrl;
          console.log("Account " + this.socialAccountService.socialAccount);
          //Call method SignUpGoogle from SocialAccountService
          this.socialAccountService.signUp(this.socialAccountService.socialAccount).subscribe((res) => {
            const response: Response = res as Response;
            if (!response.status) {
              this.errorStr = response.message;
            }
            else {
              localStorage.setItem("token", response.token)
              localStorage.setItem('loginBy', "loginSocial");
              localStorage.setItem('accountSocial', JSON.stringify((response.obj as SocialAccount)));
              console.log("created");
              window.location.href = "/";
              this.statusLogin = true;
              localStorage.setItem('statusLogin', String(this.statusLogin));
            }
          });
        }
        else {
          localStorage.setItem('loginBy', "loginSocial");
          if ((response.obj as SocialAccount).role == "ADMIN") {
            localStorage.setItem("token", response.token)
            this._router.navigate(['/dashboard']);
            localStorage.setItem('accountSocial', JSON.stringify((response.obj as SocialAccount)));
            this.statusLogin = true;
            localStorage.setItem('statusLogin', String(this.statusLogin));
          }
          else  if ((response.obj as SocialAccount).role == "CUSTOMER") {
            localStorage.setItem("token", response.token)
            window.location.href = "/"
            localStorage.setItem('accountSocial', JSON.stringify((response.obj as SocialAccount)));
            console.log(response.obj as SocialAccount);
            this.statusLogin = true;
            localStorage.setItem('statusLogin', String(this.statusLogin));
     
          }
        }
      });
    });
  }
  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user.id);
      this.socialAccountService.loginFacebook(this.user.id).subscribe((res) => {
        const response: Response = res as Response;
        console.log(res);
        console.log("hello123");
        if (!response.status) {
          this.socialAccountService.socialAccount.facebook_id = this.user.id;
          this.socialAccountService.socialAccount.username = this.user.name;
          this.socialAccountService.socialAccount.imageUrl = this.user.photoUrl;
          console.log(this.socialAccountService.socialAccount);

          this.socialAccountService.signUp(this.socialAccountService.socialAccount).subscribe((res: any) => {
            const response: Response = res as Response;
            if (!response.status) {
              this.errorStr = response.message;
            }
            else 
            {
              localStorage.setItem("token", response.token)
              localStorage.setItem('loginBy', "loginSocial");
              localStorage.setItem('accountSocial', JSON.stringify((response.obj as SocialAccount)));
              console.log("created");
              // this._router.navigate(['/booksCategory']);
              window.location.href = "/";
              this.statusLogin = true;
              localStorage.setItem('statusLogin', String(this.statusLogin));
            } 
          });

        }
        else {    
          localStorage.setItem('loginBy', "loginSocial");
          if ((response.obj as SocialAccount).role == "ADMIN") {
            localStorage.setItem("token", response.token)
            this._router.navigate(['/dashboard']);
          }
          else  if ((response.obj as SocialAccount).role == "CUSTOMER") {
            localStorage.setItem("token", response.token)
            window.location.href = "/"
            localStorage.setItem('accountSocial', JSON.stringify((response.obj as SocialAccount)));
            this.statusLogin = true;
            localStorage.setItem('statusLogin', String(this.statusLogin));
          }
        }
      });
    });
  }
}
