import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//favorite
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { Book } from 'src/app/app-services/book-service/book.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
declare var $: any;
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  constructor(private _router: Router,private _favoriteService:FavoriteService) { }
	alertMessage = "";
	alertSucess = false;
	alertFalse = false;
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy: String = ""
  favorite: Favorite = new Favorite
  listFavorite :any
  listBookFavorite:any
  ngOnInit() {
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    if (this.statusLogin == null) { this._router.navigate(['/account']); }
    this.loginBy = localStorage.getItem('loginBy');
    this.getAllFavoriteByUserId();
    this.getAllBookFavorite();
  }
getAllBookFavorite(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
		this._favoriteService.getAllBookFavoriteByUserID(this.accountSocial._id).subscribe(
			listFavorites =>{
        this.listBookFavorite = listFavorites as Book[];
        console.log(this.listBookFavorite)
			}
		)
}
}
// favorite Book
favoriteBook(bookID){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this.favorite.bookID=bookID;
  this.favorite.userID=this.accountSocial._id
  this._favoriteService.postFavorite(this.favorite).subscribe(
    aFavorite=>{ // aFavorite sẽ trả về all favorite by userID
      this.listFavorite = aFavorite as Favorite[];
  })
}else{
  this.alertMessage = "Bạn phải đăng nhập để thực hiện thao tác này";
  this.alertFalse = true;
  setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
}
}
getAllFavoriteByUserId(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this._favoriteService.getAllFavoriteByUserID(this.accountSocial._id).subscribe(
    listFavorites =>{
      this.listFavorite = listFavorites as Favorite[];
    }  )
}
}
//validate favorite 
validateFavorite(id) {
if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
for(let index in this.listFavorite)
{
  if(id==this.listFavorite[index].bookID)
  return true;
}
return false
}
return false
}








  
  moveToProfileDetail(){
    this._router.navigate(['/accountProfile'])
  }
  moveToProfileAccountSocial(){
    this._router.navigate(['/accountProfileSocial'])
  }
  goToOrderHistory(){
    this._router.navigate(['/orderHistory'])
  }
  goToDiscountCode(){
    this._router.navigate(['/discountCode'])
  }
  goToFavorite(){
    this._router.navigate(['/favorites'])
  }
}
