import { Injectable } from '@angular/core';
import { Socialaccount } from './socialaccount.model';
import { HttpClient } from '@angular/common/http';
import { HostService } from '../aHost/Host.service';

@Injectable({
  providedIn: 'root'
})
export class SocialaccountService {
  accountSocials: Socialaccount[];
  socialAccount: Socialaccount;


  constructor(private _http: HttpClient ,private _host:HostService) { }
  readonly baseURL = this._host.host()+':3000';
  loginFacebook(facebook_id: String) {
    return this._http.post(this.baseURL + "/social/facebook",{
      facebook_id: facebook_id
    });
  }
  loginGoogle(google_id: String) {
    return this._http.post(this.baseURL + "/social/google",{
      google_id: google_id
    });
  }
  signUp(socialAccount: Socialaccount){
    return this._http.post(this.baseURL + "/addAccount",socialAccount);
  }
  getAllAccountSocial(){
    return this._http.get(this.baseURL+"/socials");
  }
  getUserByID(id_user:String){
    return this._http.get(this.baseURL+"/socials" + `/${id_user}`);
  }
}
