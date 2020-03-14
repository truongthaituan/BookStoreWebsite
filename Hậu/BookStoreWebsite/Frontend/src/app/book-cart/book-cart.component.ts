import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../author-service/author.service';
import { Author } from '../author-service/author.model';
import { BookService } from '../book-service/book.service';
import { Book } from '../book-service/book.model';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-book-cart',
  templateUrl: './book-cart.component.html',
  styleUrls: ['./book-cart.component.css'],

})
export class BookCartComponent implements OnInit {

  constructor(private _router: Router, ) {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });
    });
  }
  CartBook = JSON.parse(sessionStorage.getItem("CartBook"));
  CartUpdate = JSON.parse(sessionStorage.getItem("CartBook"));
  ngOnInit() {

  }

  getCountUpdate(event: any,id){
      for(var i=0;i<this.CartUpdate.length;i++)
      {
        if(this.CartUpdate[i]._id==id)
        {
          this.CartUpdate[i].count=event.target.value;
          break;
        }
      }

  }

  updateCartBook(id){
    for(var i=0;i<this.CartUpdate.length;i++)
    {
      if(this.CartUpdate[i]._id!=id)
      {
        this.CartUpdate[i].count=this.CartBook[i].count;
      }
    }
    sessionStorage.setItem("CartBook", JSON.stringify(this.CartUpdate));
    // console.log(JSON.parse(sessionStorage.getItem("CartBook")));
    window.location.reload();
  }
  deleteCartBook(id) {
    var setconfirm =confirm('Bạn có muốn xóa cuốn sách này không ?')
    if (setconfirm == true) {
      var temp = 0;   // =1 if find id need delete
      if (JSON.parse(sessionStorage.getItem("CartBook")).length != 1) {
        for (var i = 0; i < JSON.parse(sessionStorage.getItem("CartBook")).length; i++) {
          if (temp == 0) {
           
            if (this.CartBook[i]._id == id) {
              temp = 1;
              i--;
            }
          }
          else {
            if (JSON.parse(sessionStorage.getItem("CartBook")).length - 2 == i) {
              break;
            } else
              this.CartBook[i] = JSON.parse(sessionStorage.getItem("CartBook"))[i + 1];
          }
        }
      }
      else{
        this.CartBook =[];
      }
      
      sessionStorage.setItem("CartBook", JSON.stringify(this.CartBook));
      // console.log(JSON.parse(sessionStorage.getItem("CartBook")));
     window.location.reload();
      }
 
  }

}
