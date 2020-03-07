import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorService } from '../author-service/author.service';
import { Author } from '../author-service/author.model';
declare var $:any
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  selectedBook = [];
  authorName = "";
  constructor(private _router: Router, private authorService:AuthorService) {

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
        $('.pop').click(function (e) {
          $('.imagepreview').attr('src', $(this).find('img').attr('src'));
          $('#imagemodal').modal('show');   
        });		
       
    });
   }

  ngOnInit() {
    this.refreshSelectedBook();
  }
  getAuthorById(id:string) {
    this.authorService.getAuthorById(id).subscribe((res) => {
      this.authorService.author = res as Author[];
      console.log(res);
      sessionStorage.setItem('author',JSON.stringify(res));
    });
  }
  refreshSelectedBook() {
    var authorID = "";
    this.selectedBook = JSON.parse(sessionStorage.getItem('selectedBook'));
    console.log(this.selectedBook);
    for(var i = 0;i < this.selectedBook.length;i++){
      console.log(this.selectedBook[i].nameBook);
      authorID = this.selectedBook[i].authorID;
    }
    this.getAuthorById(authorID);
  }
}
