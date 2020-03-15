import { Injectable } from '@angular/core';
import { Socialaccount } from './socialaccount.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocialaccountService {

  socialAccount: Socialaccount;
  readonly baseURL = 'http://localhost:3000';
  constructor(private _http: HttpClient) { }
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
}
