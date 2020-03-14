import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  selectedBook: Book;
  book: Book[];
  readonly baseURL = 'http://localhost:3000/books';
  constructor(private _http: HttpClient) { }
  getBookList() {
    return this._http.get(this.baseURL);
  }
  putBook(book: Book) {
    return this._http.put(this.baseURL + `/${book._id}`,book);
  }
  getBookById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postBook(book: Book) {
    return this._http.post(this.baseURL, book);
  }
  deleteBook(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
  getBookByCategoryId(category_id: string) {
    return this._http.get(this.baseURL +"/findbycategory"+ `/${category_id}`);
  }
}
