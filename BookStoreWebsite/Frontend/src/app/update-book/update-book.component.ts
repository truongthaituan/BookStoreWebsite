import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book-service/book.service';
import { NgForm } from '@angular/forms';
import { Book } from '../book-service/book.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../category-service/category.service';
import { Category } from '../category-service/category.model';
import { AuthorService } from '../author-service/author.service';
import { Author } from '../author-service/author.model';
declare var $:any;
@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
  id_book: string;
  selectedValue = '';
  countryForm: FormGroup;
  categories = [];
  event : any;
  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router:Router,  private bookService:BookService, 
    private fb: FormBuilder,private categoryService: CategoryService, 
    private authorService: AuthorService) {
      $(document).ready(function() {
        $("#selectCategory").change(function() {
          var selectedVal = $("#selectCategory option:selected").val();
          alert(selectedVal);
        });
        $("#selectAuthor").change(function() {
          var selectedVal = $("#selectAuthor option:selected").val();
          alert(selectedVal);
        });
        $("#scrollToTopButton").click(function () {
          $("html, body").animate({scrollTop: 0}, 1000);
         });
      });

     }

  ngOnInit() {
    var id = sessionStorage.getItem('idCategory');
    this.resetForm();
    this.getBookListById('5e5b3e2d7c63981214d8fc90');
    this.getCategoryList();
    this.getAuthorList();
    // this.getBookCategoryById(id);
    // this.selectedValue = "Sách Kinh Tế";
  }
  
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.bookService.selectedBook = {
      _id: "",
      nameBook:"",
      categoryID: "",
      authorID: "",
      priceBook: null,
      detailBook: "",
      imgBook: "",
      seriID: "",
      sale: null
    }
  }
  getBookCategoryById(id:string) {
    this.categoryService.getCategoryById(id).subscribe((res) => {
      this.categoryService.category = res as Category[];
      console.log(res);
    });
  }
  getBookListById(id:string) {
    this.bookService.getBookById(id).subscribe((res) => {
      this.bookService.book = res as Book[];
      console.log(res)
    });
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
}
