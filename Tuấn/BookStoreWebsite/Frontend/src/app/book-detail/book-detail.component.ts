import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorService } from '../app-services/author-service/author.service';
import { Author } from '../app-services/author-service/author.model';
import { BookService } from '../app-services/book-service/book.service';
import { Book } from '../app-services/book-service/book.model';
import { RatingService } from '../app-services/rating-service/rating.service';
import { Rating } from '../app-services/rating-service/rating.model';
import { NgForm } from '@angular/forms';
import { SocialaccountService } from '../app-services/socialAccount-service/socialaccount.service';
import { Socialaccount } from '../app-services/socialAccount-service/socialaccount.model';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var $:any
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  private subscription: Subscription;
  private timer: Observable<any>;
  books: Array<Book>;
  id_category:String = ""
  user_social: Array<Socialaccount>;
  constructor(private _router: Router,  private route: ActivatedRoute, 
    private authorService:AuthorService,private bookService: BookService, 
    private ratingService: RatingService, private accountSocialService: SocialaccountService) {
//#region js for star
    var wc_single_product_params = {"i18n_required_rating_text":"Please select a rating","review_rating_required":"yes"};
    $(function(a){return"undefined"!=typeof wc_single_product_params&&(a("body")
    .on("init",".wc-tabs-wrapper, .woocommerce-tabs",function(){
      a(".wc-tab, .woocommerce-tabs .panel:not(.panel .panel)").hide();
      var b=window.location.hash,c=window.location.href,d=a(this).find(".wc-tabs, ul.tabs").first();
      b.toLowerCase().indexOf("comment-")>=0||"#reviews"===b||"#tab-reviews"===b?d.find("li.reviews_tab a")
      .click():c.indexOf("comment-page-")>0||c.indexOf("cpage=")>0?d.find("li.reviews_tab a").click():d.find("li:first a").click()})
      .on("click",".wc-tabs li a, ul.tabs li a",function(b){b.preventDefault();
        var c=a(this),d=c.closest(".wc-tabs-wrapper, .woocommerce-tabs"),e=d.find(".wc-tabs, ul.tabs");e.find("li")
        .removeClass("active"),d.find(".wc-tab, .panel:not(.panel .panel)").hide(),c.closest("li").addClass("active"),
        d.find(c.attr("href")).show()}).on("click","a.woocommerce-review-link",function(){return a(".reviews_tab a")
        .click(),!0}).on("init","#rating",function(){a("#rating").hide()
        .before('<p class="stars"><span><a class="star-1" href="#">1</a><a class="star-2" href="#">2</a><a class="star-3" href="#">3</a><a class="star-4" href="#">4</a><a class="star-5" href="#">5</a></span></p>')})
        .on("click","#respond p.stars a",function(){var b=a(this),c=a(this).closest("#respond").find("#rating"),
        d=a(this).closest(".stars");return c.val(b.text()),b.siblings("a").removeClass("active"),b.addClass("active"),
        d.addClass("selected"),!1}).on("click","#respond #submit",function(){var b=a(this).closest("#respond")
        .find("#rating"),c=b.val();if(b.length>0&&!c&&"yes"===wc_single_product_params.review_rating_required)
        return window.alert(wc_single_product_params.i18n_required_rating_text),!1}),
        void a(".wc-tabs-wrapper, .woocommerce-tabs, #rating").trigger("init"))
      });
//#endregion
      $(function() {
        $('.pop').click(function (e) {
          $('.imagepreview').attr('src', $(this).find('img').attr('src'));
          $('#imagemodal').modal('show');   
        });		
          $("#scrollToTopButton").click(function () {
            $("html, body").animate({scrollTop: 0}, 1000);
           });
        
    });
   }

  ngOnInit() {
    this.resetForm();
    let id = this.route.snapshot.paramMap.get('id');
  
    this.getBookById(id);
    this.getAllAccount();
    this.getRatingsByBookID(id);

    //set Tổng tiền và số lượng trên header
    $('#tongtien').html("&nbsp;" +sessionStorage.getItem('TongTien') + " đ");
    $('.cart_items').html(sessionStorage.getItem('TongCount'));
    //
  }
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.ratingService.selectedRating = {
      _id: "",
      bookID: "",
      userID: "",
      star: "",
      review: ""
    };
  }
  getAuthorById(id:string) {
    this.authorService.getAuthorById(id).subscribe((res) => {
      this.authorService.author = res as Author[];
      console.log(res);
    });
  }
  detailBook(book: Book) {
    return this._router.navigate(["/bookDetail" + `/${book._id}`]);
  }
  getBookById(id:string) {
    var books:any
    this.bookService.getBookById(id).subscribe((res) => {
      this.bookService.book = res as Book[];
      books = res;
     this.getAuthorById(books.authorID);
      this.gettypeCategory(books.categoryID);
       this.getRatingsByBookID(id);
      window.scrollTo(0, 0)
    });
  }
  gettypeCategory(id){
    this.bookService.getBookByCategoryId(id)
    .subscribe(resCategoryData => {
      // console.log(resCategoryData);
      this.books = resCategoryData as Book[];
      console.log(this.books);
    });
  }
  account_social = [];
  getRatingsByBookID(id: string) {
		this.ratingService.getRatingsByBook(id).subscribe((res) => {
      this.ratingService.rating = res as Rating[];
		  });
  }
  getAllAccount(){
    this.accountSocialService.getAllAccountSocial().subscribe(res =>{
      this.accountSocialService.accountSocials = res as Socialaccount[];
      console.log(this.accountSocialService.accountSocials);
    })
  }
  statusRating: boolean = false;

    onSubmit(form: NgForm) {
      if(sessionStorage.getItem('userGoogle') == null){
        alert("Vui lòng đăng nhập để đánh giá!");
        this._router.navigate(['/account']);
      }else{
      console.log(form.value)
      let id = this.route.snapshot.paramMap.get('id'); 
      form.value.bookID = id;
      let id_user =  JSON.parse(sessionStorage.getItem('userGoogle'))._id;
      form.value.userID = id_user;
        this.ratingService.postRating(form.value).subscribe(
          data => {
            console.log(data);
            this.statusRating = true;
            form.resetForm();
            this.ngOnInit();
            this.timer        = Observable.timer(5000); // 5000 millisecond means 5 seconds
            this.subscription = this.timer.subscribe(() => {
                // set showloader to false to hide loading div from view after 5 seconds
                this.statusRating = false;
            });
          },
          error => console.log(error)
         );
      }
    }

  //add to cart (BookDetail,CountSelect)
  addToCart(selectedBook: Book, form: Book) {

    var CartBook = [];    //lưu trữ bộ nhớ tạm cho sessionStorage "CartBook"
    var dem = 0;            //Vị trí thêm sách mới vào sessionStorage "CartBook" (nếu sách chưa tồn tại)
    var temp = 0;           // đánh dấu nếu đã tồn tại sách trong sessionStorage "CartBook" --> count ++
    // nếu sessionStorage "CartBook" không rỗng
    if(!form.count)form.count=1;
    if (sessionStorage.getItem('CartBook') != null) {
      //chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)
      if (!form.count) form.count = 1;
      for (var i = 0; i < JSON.parse(sessionStorage.getItem("CartBook")).length; i++) {
        CartBook[i] = JSON.parse(sessionStorage.getItem("CartBook"))[i];
        // nếu id book đã tồn tại trong  sessionStorage "CartBook" 
        if (CartBook[i]._id == selectedBook._id) {
          temp = 1;  //đặt biến temp

          CartBook[i].count =parseInt(CartBook[i].count) +form.count;  //tăng giá trị count
        }
        dem++;  // đẩy vị trí gán tiếp theo
      }
    }

    if (temp != 1) {      // nếu sách chưa có ( temp =0 ) thì thêm sách vào
      selectedBook.count = form.count;  // set count cho sách
      CartBook[dem] = selectedBook; // thêm sách vào vị trí "dem" ( vị trí cuối) 
    }
    // đổ mảng vào sessionStorage "CartBook"
    sessionStorage.setItem("CartBook", JSON.stringify(CartBook));


    this._router.navigate(['/cartBook']);
  }
}