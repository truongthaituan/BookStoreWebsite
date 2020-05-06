import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { User } from 'src/app/app-services/user-service/user.model';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-details-edit',
  templateUrl: './user-details-edit.component.html',
  styleUrls: ['./user-details-edit.component.css']
})
export class UserDetailsEditComponent implements OnInit {

  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  constructor(private _router: Router, private userService: UserService,
    private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getUserById(id);
    }
  getUserById(id){
    this.userService.getUserById(id).subscribe(res => {
      console.log(res)
      this.userService.selectedUser = res as User;
    })
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.userService.selectedUser = {
      _id: null,
      email: "",
      username: "",
      role: null,
      password: null,
      imageUrl: null
    }
  }
  alertMessage: string = ""
  alertSucess: boolean = false
  onSubmit(form: NgForm) {
    let id = this.route.snapshot.paramMap.get('id');
    if (confirm('Do you want to update your profile ?') == true) {
      this.userService.getUserById(id).subscribe(res => {
        this.userService.selectedUser = res as User;
        this.userService.selectedUser.email = form.value.email;
        this.userService.selectedUser.username = form.value.username;
        this.userService.selectedUser.role = form.value.role;
        this.userService.updateUser(this.userService.selectedUser).subscribe(
          data => {
            console.log(data);
            this.userService.selectedUser = data as User;
            this.alertSucess = true;
            // this.alertMessage = "Update Profile Successfully!";
            setTimeout(() => {  this.location.back(); }, 1000);
         },
          error => console.log(error)
         );
      })
   
     console.log('Your form data: '+  form.value)
      }
    }

    cancel(){
      this.location.back();    
    }
    logout(){
      localStorage.clear();
      document.location.href = "/homePage";
    }
}
