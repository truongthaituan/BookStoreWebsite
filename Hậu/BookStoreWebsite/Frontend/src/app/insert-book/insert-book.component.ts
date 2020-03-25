import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../app-services/book-service/book.service';
import { CategoryService } from '../app-services/category-service/category.service';
import { AuthorService } from '../app-services/author-service/author.service';
import { Category } from '../app-services/category-service/category.model';
import { Author } from '../app-services/author-service/author.model';
declare var $:any;
@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent implements OnInit {
  statusInsert:Boolean = false;

  countryForm: FormGroup;
  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router:Router,  private bookService:BookService, 
    private fb: FormBuilder,private categoryService: CategoryService, 
    private authorService: AuthorService) {
    $(function() {
      $(document).ready(function() {
        $("#selectCategory").change(function() {
          var selectedVal = $("#selectCategory option:selected").val();
          alert(selectedVal);
        });
        $("#selectAuthor").change(function() {
          var selectedVal = $("#selectAuthor option:selected").val();
          alert(selectedVal);
        });
      });
    });
  }
  ngOnInit() {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    this.resetForm();
    this.getCategoryList();
    this.getAuthorList();
  }
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.bookService.selectedBook = {
      _id: null,
      nameBook:"",
      categoryID: "",
      authorID: "",
      priceBook: null,
      detailBook: "",
      imgBook: "",
      seriID: "",
      sale: null,
      count: null
    };
  }
  getCategoryList() {
    this.categoryService.getCategoryList().subscribe((res) => {
		  this.categoryService.category = res as Category[];
		});
    }
    getAuthorList() {
      this.authorService.getAuthorList().subscribe((res) => {
        this.authorService.author = res as Author[];
        console.log(res);
      });
    }
    cancel(){
      this._router.navigate(['/adminPage']);
    }
    onSubmit(form: NgForm) {
      console.log(form.value)
          this.bookService.postBook(form.value).subscribe(
            data => {console.log(data);this._router.navigate(['/adminPage']);
          this.statusInsert = true;sessionStorage.setItem('statusInsert',String(this.statusInsert))},
            error => console.log(error)
           );
    }
    getLinkImgBook="";
    getLinkImg(event : any)
    { 
      this.getLinkImgBook=event.target.value;

    }
}
