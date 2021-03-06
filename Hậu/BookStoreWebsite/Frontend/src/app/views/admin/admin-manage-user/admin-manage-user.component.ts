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
  selector: 'app-admin-manage-user',
  templateUrl: './admin-manage-user.component.html',
  styleUrls: ['./admin-manage-user.component.css']
})
export class AdminManageUserComponent implements OnInit {
  statusCRUD: String = ""
  displayedColumns: string[] = ['imageUrl', 'empty1', 'email', 'username', 'empty2', 'Details', 'Edit', 'Delete'];
  // dataSource: MatTableDataSource<Book>;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private _router: Router, private userService: UserService) {

  }
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));
  ngOnInit() {
    this.refreshUserList();

    // this.getNameCategory();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUserById(userId) {
    return this._router.navigate(["/userDetail" + `/${userId}`]);
  }
  updateUserById(userId) {
    return this._router.navigate(["/userDetailEdit" + `/${userId}`]);
  }

  users: any
  refreshUserList() {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res;
      this.dataSource.data = this.users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  alertId(data) {
    console.log(data);
  }
  alertSuccess: boolean = false;
  alertMessage: string = "";
  deleteUserById(_id: string) {
    if (confirm('Bạn có muốn xóa khách hàng này không ?') == true) {
      this.userService.deleteUser(_id).subscribe(
        data => {
          console.log(data);
          this.ngOnInit();
          this.alertSuccess = true;
          this.alertMessage = "Xóa Thông Tin Người Dùng Thành Công!";
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
   
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
