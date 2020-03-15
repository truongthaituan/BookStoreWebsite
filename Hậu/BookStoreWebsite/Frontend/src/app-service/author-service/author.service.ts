import { Injectable } from '@angular/core';
import { Author } from './author.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  author: Author[];
  readonly baseURL = 'http://localhost:3000/authors';
  constructor(private _http: HttpClient) { }
  getAuthorList() {
    return this._http.get(this.baseURL);
  }
  putAuthor(author: Author) {
    return this._http.put(this.baseURL + `/${author._id}`,author);
  }
  getAuthorById(_id: String) {
    return this._http.get(this.baseURL + "/" + _id);
  }
  postAuthor(author: Author) {
    return this._http.post(this.baseURL, author);
  }
  deleteAuthor(_id: string) {
    return this._http.delete(this.baseURL + `/${_id}`);
  }
}
