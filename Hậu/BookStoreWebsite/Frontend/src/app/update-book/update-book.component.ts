import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  showMsg: boolean = false;
  selectedValue = '';
  countryForm: FormGroup;
  categories = [];
  event : any;
  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router:Router,  private bookService:BookService, 
    private fb: FormBuilder,private categoryService: CategoryService, 
    private authorService: AuthorService, private route: ActivatedRoute) {
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

     }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
   this.getBookById(id);
    // var id = sessionStorage.getItem('idCategory');
    this.resetForm();
    // this.getBookListById('5e5b3e2d7c63981214d8fc90');
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
      sale: null,
      count:null,
    }
  }
  getBookCategoryById(id:string) {
    this.categoryService.getCategoryById(id).subscribe((res) => {
      this.categoryService.category = res as Category[];
      console.log(res);
    });
  }
  getBookById(id:string) {
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
    cancel(){
      this._router.navigate(['/adminPage']);
    }
    onSubmit(form: NgForm) {
        if (confirm('Bạn có muốn cập nhật cuốn sách này không ?') == true) {
          // form.value.imgMonAn =  $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
        this.bookService.putBook(form.value).subscribe(
         data => {console.log(data);this._router.navigate(['/adminPage']);
          this.showMsg = true;
          sessionStorage.setItem('showMsg',String(this.showMsg))
        },
         error => console.log(error)
        );
      console.log('Your form data: '+  form.value._id)
    }
    }
}
