import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../app-services/user-service/user.service';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
  AuthService
} from 'ng4-social-login';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Response } from '../app-services/response/response.model';
import { User } from '../app-services/user-service/user.model';
import { SocialaccountService } from '../app-services/socialAccount-service/socialaccount.service';
import { Socialaccount } from '../app-services/socialAccount-service/socialaccount.model';


declare var $: any;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  public user: any = SocialUser;
  errString: String = ""
  errRegister: String = ""
  statusRegister: Boolean
  showErrorMessage: Boolean = false;
  errorStr: string = ''
  statusLogin: Boolean = false
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    fullName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    cpass: new FormControl(null, Validators.required)
  })

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, Validators.required)
  });
  constructor(private _router: Router, private _userService: UserService,
    private socialAuthService: AuthService, private socialAccountService: SocialaccountService) {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });

  }
  
  socialUser: SocialUser;

  templogin = 0;
  ngOnInit() {
    this.initialAccount();
//set Tổng tiền và số lượng trên header
$('#tongtien').html("&nbsp;" +sessionStorage.getItem('TongTien') + " đ");
$('.cart_items').html(sessionStorage.getItem('TongCount'));
//
  }
  initialAccount() {
    this.socialAccountService.socialAccount = ({
      _id: null,
      email: '',
      username: '',
      imageUrl: '',
      facebook_id: '',
      google_id: '',
      typeAccount: 0
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
        // console.log(JSON.stringify(this.registerForm.value));
        this._userService.register(JSON.stringify(this.registerForm.value))
          .subscribe(
            data => {
              console.log(data);
              this._router.navigate(['/account']);
              this.registerForm.reset();
              this.statusRegister = true;
            },
            error => {
              console.log(error);
              this.errRegister = "Tài khoản có thể đã tồn tại!";
            })
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
          console.log(response.message)
          this.errString = "Email hoặc password không đúng!";
        }
        else {
          sessionStorage.setItem("token", response.token)
          //admin
          if ((response.obj as User).roleID == "1") {
            this._router.navigate(['/adminPage'])
            sessionStorage.setItem('userLogin', JSON.stringify((response.obj as User)));
            sessionStorage.setItem('loginBy', "loginbt");
          }
          //member
          else {
            this._router.navigate(['/booksCategory'])
            sessionStorage.setItem('fullName', JSON.stringify((response.obj as User)));
            sessionStorage.setItem('loginBy', "loginbt");
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
          
              sessionStorage.setItem('accountSocial', JSON.stringify((response.obj as Socialaccount)));
              console.log("created");
              this._router.navigate(['/booksCategory']);
              this.statusLogin = true;
              sessionStorage.setItem('statusLogin', String(this.statusLogin));
            }
          });
        }
        else {
    
          sessionStorage.setItem('loginBy', "loginGoogle");
          if ((response.obj as Socialaccount).typeAccount == 1) {
            this._router.navigate(['/adminPage']);
          }
          else {

            window.location.href = "/"
            sessionStorage.setItem('accountSocial', JSON.stringify((response.obj as Socialaccount)));
            console.log(response.obj as Socialaccount);
            this.statusLogin = true;
            sessionStorage.setItem('statusLogin', String(this.statusLogin));
     
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
            else {
              sessionStorage.setItem('accountSocial', JSON.stringify((response.obj as Socialaccount)));
              this._router.navigate(['/login']);
            }
          });
        }
        else {
          window.location.href = "/"
          sessionStorage.setItem('accountSocial', JSON.stringify((response.obj as Socialaccount)));
          console.log(response.obj as Socialaccount);
          this.statusLogin = true;
          sessionStorage.setItem('statusLogin', String(this.statusLogin));;
          sessionStorage.setItem('loginBy', "loginFacebook");
        }
      });
    });
  }
}
