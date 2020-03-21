import { Injectable } from '@angular/core';
import { SendMail } from './sendMail.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {
  selectedsendMail: SendMail;
  sendMail: SendMail[];
  readonly baseURL = 'http://localhost:3000/send';
  constructor(private _http: HttpClient) { }

  postsendMail(sendMail: SendMail) {
    return this._http.post(this.baseURL, sendMail);
  }

}
