import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  selectedOrder: Order;
  order: Order[];
  readonly baseURL = 'http://localhost:3000/orders';
  constructor(private _http: HttpClient) { }
  getOrderList() {
    return this._http.get(this.baseURL);
  }
  putOrder(order: Order) {
    return this._http.put(this.baseURL + `/${order._id}`,order);
  }
  getOrderById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postOrder(order: Order) {
    return this._http.post(this.baseURL, order);
    
  }
  deleteOrder(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }

}
