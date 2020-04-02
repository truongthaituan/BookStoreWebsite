import { Injectable } from '@angular/core';
import { Customer } from './Customer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  selectedCustomer: Customer;
  customer: Customer[];
  readonly baseURL = 'http://localhost:3000/customers';
  constructor(private _http: HttpClient) { }
  getCustomerList() {
    return this._http.get(this.baseURL);
  }
  putCustomer(customer: Customer) {
    return this._http.put(this.baseURL + `/${customer._id}`,customer);
  }
  getCustomerById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postCustomer(customer: Customer) {
    return this._http.post(this.baseURL, customer);
    
  }
  deleteCustomer(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
  getCustomerByUserID(_id: String) {
    return this._http.get(this.baseURL + "/UserID/" + _id);
  }

}
