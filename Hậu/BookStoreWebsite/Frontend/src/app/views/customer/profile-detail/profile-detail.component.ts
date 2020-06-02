import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../app-services/user-service/user.service';
import { User } from '../../../app-services/user-service/user.model';
import { Location } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {

  constructor(private _router: Router, private userService: UserService,private location: Location, private route: ActivatedRoute) { }

  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    let id = JSON.parse(localStorage.getItem("accountSocial"))._id;
    this.getUserById(id);
  }
  getUserByUsername(email){
    this.userService.getUserByEmail(email).subscribe(res => {
      console.log(res)
      this.userService.selectedUser = res as User;
    })
  }
  getUserById(id){
    this.userService.getUserById(id).subscribe(res => {
      console.log(res)
      this.userService.selectedUser = res as User;
    })
  }
  moveToProfileEdit(userId)
  {
    return this._router.navigate(["/accountProfileEdit" + `/${userId}`]);
  }
  cancel(){
    this._router.navigate(['/profile']);
  }
  moveToProfileChangePassword(userId)
  {
    return this._router.navigate(["/changePassword" + `/${userId}`]);
  }
}
