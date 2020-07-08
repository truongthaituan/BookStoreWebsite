import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/app-services/user-service/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Book } from 'src/app/app-services/book-service/book.model';
import { BookService } from 'src/app/app-services/book-service/book.service';
import { CategoryService } from 'src/app/app-services/category-service/category.service';
import { Category } from 'src/app/app-services/category-service/category.model';
import { AuthorService } from 'src/app/app-services/author-service/author.service';
import { Author } from 'src/app/app-services/author-service/author.model';
import { SeriService } from 'src/app/app-services/seri-service/seri.service';
import { Seri } from 'src/app/app-services/seri-service/seri.model';

@Component({
  selector: 'app-admin-manage-book',
  templateUrl: './admin-manage-book.component.html',
  styleUrls: ['./admin-manage-book.component.css']
})
export class AdminManageBookComponent implements OnInit {
  statusCRUD: String = ""
  displayedColumns: string[] = ['_id', 'empty0','imgBook', 'empty1', 'nameBook', 'priceBook', 'empty2', 'Details', 'Edit', 'Delete'];
  // dataSource: MatTableDataSource<Book>;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private _router: Router, private bookService: BookService, private authorService: AuthorService,
    private seriService: SeriService, private userService: UserService, private categoryService: CategoryService) {

  }
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));
  ngOnInit() {
    this.refreshBooksList();

    // this.getNameCategory();
  }
  refreshBooksList1() {
    this.bookService.getBookList().subscribe((res) => {
      this.bookService.book = res as Book[];

    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getBookById(bookId) {
    return this._router.navigate(["/bookDetails" + `/${bookId}`]);
  }
  updateBookById(bookId) {
    return this._router.navigate(["/updateBook" + `/${bookId}`]);
  }

  books: any
  listBook = [];
  refreshBooksList() {
    this.bookService.getBookList().subscribe((res) => {
      this.books = res;
      this.dataSource.data = this.books;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  // for (let i = 0; i < this.books.length; i++) {
  //   this.categoryService.getCategoryById(this.books[i].categoryID).subscribe(category => {
  //     this.authorService.getAuthorById(this.books[i].authorID).subscribe(author => {
  //       this.seriService.getSeriById(this.books[i].seriID).subscribe(series => {
  //         var info = {
  //           _id: this.books[i]._id, nameBook: this.books[i].nameBook,
  //           nameCategory: (category as Category).nameCategory, nameAuthor: (author as Author).nameAuthor,
  //           priceBook: this.books[i].priceBook,
  //           imgBook: this.books[i].imgBook, nameSeries: (series as Seri).nameSeri, sale: this.books[i].sale
  //         };
  //         this.listBook.push(info);
  //         console.log(this.listBook)
  //         this.dataSource.data = this.listBook;
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       })
  //     })
  //   })
  // }
  alertId(data) {
    console.log(data);
  }
  alertSuccess: boolean = false;
  alertMessage: string = "";
  deleteBookById(_id: string) {
    if (confirm('Bạn có muốn xóa cuốn sách này không ?') == true) {
      this.bookService.deleteBook(_id).subscribe(
        data => {
          console.log(data);
          this.ngOnInit();
          this.alertSuccess = true;
          this.alertMessage = "Xóa Thông Tin Tựa Sách Thành Công!";
          setTimeout(() => {
          this.alertSuccess = false;
            this.alertMessage = "";
          }, 2000);
        },
        error => console.log(error)
      )
    }
  }
  insertUser() {
    this._router.navigate(['/insertUser']);
  }
  addBook() {
    this._router.navigate(['/insertBook']);
  }
   
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
