import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../app-services/user-service/user.service';
import { User } from '../../../app-services/user-service/user.model';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-detail-edit',
  templateUrl: './profile-detail-edit.component.html',
  styleUrls: ['./profile-detail-edit.component.css']
})
export class ProfileDetailEditComponent implements OnInit {

  constructor(private _router: Router, private route: ActivatedRoute,private userService: UserService, private location: Location) { }

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
        this.userService.updateUser(this.userService.selectedUser).subscribe(
          data => {
            console.log(data);
            this.userService.selectedUser = data as User;
            this.alertSucess = true;
            this.alertMessage = "Update Profile Successfully!";
            setTimeout(() => {  window.location.href = "/accountProfile" }, 3000);
            localStorage.removeItem("accountSocial");
           localStorage.setItem("accountSocial", JSON.stringify(data)); 
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
}
