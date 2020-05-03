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
  displayedColumns: string[] = ['imgBook', 'empty1', 'nameBook', 'Category', 'Author', 'Series', 'Details', 'Edit', 'Delete'];
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
      for (let i = 0; i < this.books.length; i++) {
        this.categoryService.getCategoryById(this.books[i].categoryID).subscribe(category => {
          this.authorService.getAuthorById(this.books[i].authorID).subscribe(author => {
            this.seriService.getSeriById(this.books[i].seriID).subscribe(series => {
              var info = {
                _id: this.books[i]._id, nameBook: this.books[i].nameBook,
                nameCategory: (category as Category).nameCategory, nameAuthor: (author as Author).nameAuthor,
                priceBook: this.books[i].priceBook,
                imgBook: this.books[i].imgBook, nameSeries: (series as Seri).seriName, sale: this.books[i].sale
              };
              this.listBook.push(info);
              console.log(this.listBook)
              this.dataSource.data = this.listBook;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            })
          })
        })
      }

    });
  }
  alertId(data) {
    console.log(data);
  }
  // deleteById(id)
  // {
  //   if (confirm('Do you want to remove this user?') == true) {
  //   this.userService.getUserById(id).subscribe((res) => {
  //   this.userService.user = res as User; 
  //   console.log(this.userService.user)
  //   this.userForm.value.userId = this.userService.user.userId;
  //   this.userForm.value.roles = [];
  //   this.userForm.value.avatar = this.userService.user.avatar;
  //   this.userForm.value.userName = this.userService.user.userName;  
  //   this.userForm.value.status = this.userService.user.status;  
  //   this.userForm.value.phoneNumber = this.userService.user.phoneNumber;  
  //   console.log(JSON.stringify(this.userForm.value)); 
  //   this.userService.updateUser(this.userForm.value).subscribe((res) => {  
  //     console.log(res);
  //     this.userService.deleteUser(id).subscribe(
  //       data=>{ 
  //         console.log(data);
  //        this.statusCRUD = "Delete User Successfully!";
  //        setTimeout(() => {  this.statusCRUD = ""; }, 4000);
  //         this.ngOnInit();
  //       },
  //     error=>console.log(error)
  //     )
  //   });    
  //   },err => console.log(err));
  //   }
  // }
  insertUser() {
    this._router.navigate(['/insertUser']);
  }
  addBook(){
    this._router.navigate(['/insertBook']);
  }
}
