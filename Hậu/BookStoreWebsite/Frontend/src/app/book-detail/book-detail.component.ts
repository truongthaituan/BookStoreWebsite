import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorService } from '../author-service/author.service';
import { Author } from '../author-service/author.model';
import { BookService } from '../book-service/book.service';
import { Book } from '../book-service/book.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
declare var $:any
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  constructor(private _router: Router,  private route: ActivatedRoute, 
    private authorService:AuthorService,private bookService: BookService) {

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
     
      $(function() {
        $("#scrollToTopButton").click(function () {
          $("html, body").animate({scrollTop: 0}, 1000);
         });
        $('.pop').click(function (e) {
          $('.imagepreview').attr('src', $(this).find('img').attr('src'));
          $('#imagemodal').modal('show');   
        });		
       
    });
   }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
   this.getBookById(id);
    // sessionStorage.removeItem("CartBook");
  }
  getAuthorById(id:string) {
    this.authorService.getAuthorById(id).subscribe((res) => {
      this.authorService.author = res as Author[];
      console.log(res);
    });
  }
  getBookById(id:string) {
    var books:any
    this.bookService.getBookById(id).subscribe((res) => {
      this.bookService.book = res as Book[];
      books = res;
     this.getAuthorById(books.authorID);
    });
  }
  // refreshSelectedBook() {
  //   var authorID = "";
  //   this.selectedBook = JSON.parse(sessionStorage.getItem('selectedBook'));
  //   console.log(this.selectedBook);
  //   for(var i = 0;i < this.selectedBook.length;i++){
  //     console.log(this.selectedBook[i].nameBook);
  //     authorID = this.selectedBook[i].authorID;
  //   }
  //   this.getAuthorById(authorID);
  // }
  
  //add to cart (BookDetail,CountSelect)
  addToCart(selectedBook:Book,form:Book){

    var CartBook = [];    //lưu trữ bộ nhớ tạm cho sessionStorage "CartBook"
    var dem=0;            //Vị trí thêm sách mới vào sessionStorage "CartBook" (nếu sách chưa tồn tại)
    var temp=0;           // đánh dấu nếu đã tồn tại sách trong sessionStorage "CartBook" --> count ++
    // nếu sessionStorage "CartBook" không rỗng
    if(sessionStorage.getItem('CartBook')!=null){     
      //chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)
      for(var i=0;i<JSON.parse(sessionStorage.getItem("CartBook")).length;i++)
        {
          CartBook[i]=JSON.parse(sessionStorage.getItem("CartBook"))[i];
          // nếu id book đã tồn tại trong  sessionStorage "CartBook" 
          if(CartBook[i]._id==selectedBook._id)
          {
            temp=1;  //đặt biến temp
            CartBook[i].count = CartBook[i].count + form.count;  //tăng giá trị count
          }
          dem++;  // đẩy vị trí gán tiếp theo
        }
    }
  
    if(temp!=1){      // nếu sách chưa có ( temp =0 ) thì thêm sách vào
      selectedBook.count=form.count;  // set count cho sách
      CartBook[dem]=selectedBook; // thêm sách vào vị trí "dem" ( vị trí cuối) 
    }
    // đổ mảng vào sessionStorage "CartBook"
    sessionStorage.setItem("CartBook",JSON.stringify(CartBook));

    console.log((sessionStorage.getItem("CartBook")));
    this._router.navigate(['/cartBook']);
    }
  }
  