import { Injectable } from '@angular/core';
import { Category } from './category.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  selectedCateggory: Category;
  category: Category[];
  readonly baseURL = 'http://localhost:3000/categories';
  constructor(private _http: HttpClient) { }
  getCategoryList() {
    return this._http.get(this.baseURL);
  }
  putCategory(category: Category) {
    return this._http.put(this.baseURL + `/${category._id}`,category);
  }
  getCategoryById(_id: String) {
    return this._http.get(this.baseURL  + `/${_id}`);
  }
  postCategory(category: Category) {
    return this._http.post(this.baseURL, category);
  }
  deleteCategory(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
}
