import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
  AuthService
} from 'ng4-social-login';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Response } from '../response/response.model';
import { User } from '../user-service/user.model';
import { SocialaccountService } from '../socialAccount-service/socialaccount.service';
import { Socialaccount } from '../socialAccount-service/socialaccount.model';


declare var $:any;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  public user:any = SocialUser;
  errString: String = ''
  statusRegister: Boolean
  showErrorMessage:Boolean = false;
  errorStr: string = ''
registerForm: FormGroup = new FormGroup({
  email:new FormControl(null,[Validators.email,Validators.required]),
  fullName:new FormControl(null,Validators.required),
  password:new FormControl(null,Validators.required),
  cpass:new FormControl(null,Validators.required)
})

loginForm : FormGroup=new FormGroup({
  email:new FormControl(null,[Validators.email,Validators.required]),
  password:new FormControl(null, Validators.required)
});
  constructor(private _router:Router,  private _userService:UserService, 
    private socialAuthService: AuthService, private socialAccountService: SocialaccountService) {

      $(function(){
        $("#scrollToTopButton").click(function () {
          $("html, body").animate({scrollTop: 0}, 1000);
         });
      });
    
      }

     socialUser: SocialUser;


  ngOnInit() {
    this.initialAccount();
   
  }
  initialAccount() {
    this.socialAccountService.socialAccount =  ({
      _id: null,
      email: '',
      username: '',
      imageUrl: '',
      facebook_id: '',
      google_id: '',
      typeAccount: 0
    });
  }

  register(){
    if(!this.registerForm.valid)
    {
        alert("Mời nhập đầy đủ thông tin và nhập email theo cú pháp ***@***.***")
        return;
    } 
    else
    if (this.registerForm.controls.password.value != this.registerForm.controls.cpass.value){
      alert("Xác nhận mật khẩu không đúng!");
      return;
    }
    else{
    // console.log(JSON.stringify(this.registerForm.value));
    this._userService.register(JSON.stringify(this.registerForm.value))
    .subscribe(
      data=> {console.log(data); this._router.navigate(['/account']);
      this.registerForm.reset();
      this.statusRegister = true;},
      error=>console.error(error)
    )
    }
  }
  login(){
    if(!this.loginForm.valid){
    alert("Mời nhập đầy đủ thông tin và nhập email theo cú pháp ***@***.***");
    return;
    }
    else{
      this.showErrorMessage = false;
      this._userService.login(JSON.stringify(this.loginForm.value)).subscribe((res) => {
        const response: Response = res as Response;
        if (response.status == false) {
          console.log(response.message)
          this.errString = "Email hoặc password không đúng!";
        }
        else{
          console.log(response.obj as User);
          console.log(response.token);
          sessionStorage.setItem("token",response.token)
          if((response.obj as User).roleID == "1"){
            this._router.navigate(['/adminPage'])
            sessionStorage.setItem('fullName',(response.obj as User).fullName);
            sessionStorage.setItem('loginBy',"loginbt");
          }
          else{
            console.log((response.obj as User).fullName);
            this._router.navigate(['/booksCategory'])
            sessionStorage.setItem('fullName',(response.obj as User).fullName);
            sessionStorage.setItem('loginBy',"loginbt");
          }
        }
      })
    }
  }
  //Login with google
  googleLogin(){
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
          console.log((response.obj as Socialaccount).google_id);
          console.log((response.obj as Socialaccount).email);
          sessionStorage.setItem('account', (response.obj as Socialaccount)._id);
          console.log("created");
          this._router.navigate(['/booksCategory']);
          }
        });
    }
        else {
          //if google account already exist, it's will router to booksCategory
          console.log(response.obj as Socialaccount);
          console.log( (response.obj as Socialaccount).email);
          sessionStorage.setItem('loginBy',"loginGoogle");
          if((response.obj as Socialaccount).typeAccount == 1){
            this._router.navigate(['/adminPage']);
          }
         else {
          this._router.navigate(['/booksCategory']);
          }
        }
      });
    });
  }
  facebookLogin(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) =>
    {
      this.user = userData;
      console.log(this.user.id);
      this.socialAccountService.loginFacebook(this.user.id).subscribe((res) => {
        const response: Response = res as Response;
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
              console.log((response.obj as Socialaccount).facebook_id);
              sessionStorage.setItem('account', (response.obj as Socialaccount)._id);
              console.log( (response.obj as Socialaccount)._id);
              this._router.navigate(['/login']);
            }
          });
        }
        else {
          console.log(response.obj as Socialaccount);
          console.log(response.token);
          sessionStorage.setItem('loginBy',"loginFacebook");
          this._router.navigate(['/booksCategory']);
        }
      });
    });
  }
}
