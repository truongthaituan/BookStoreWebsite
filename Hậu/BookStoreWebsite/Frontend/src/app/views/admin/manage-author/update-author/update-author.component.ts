
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../../../app-services/book-service/book.service';
import { NgForm } from '@angular/forms';
import { Book } from '../../../../app-services/book-service/book.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../../../app-services/category-service/category.service';
import { Category } from '../../../../app-services/category-service/category.model';
import { AuthorService } from '../../../../app-services/author-service/author.service';
import { Author } from '../../../../app-services/author-service/author.model';
import { SeriService } from 'src/app/app-services/seri-service/seri.service';
import { Seri } from 'src/app/app-services/seri-service/seri.model';
import { Location } from '@angular/common';
declare var $:any;
@Component({
  selector: 'app-update-author',
  templateUrl: './update-author.component.html',
  styleUrls: ['./update-author.component.css']
})
export class UpdateAuthorComponent implements OnInit {
  id_book: string;
  alertSucess: boolean = false;
  selectedValue = '';
  countryForm: FormGroup;
  categories = [];
  event : any;
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router:Router,  private bookService:BookService, private seriService: SeriService,private location: Location,
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
   this.getAuthorByID(id);
    this.resetForm();
  }
  author:any
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.author = {
      _id: "",
      nameAuthor:"",
      imgAuthor:"",
      detailAuthor:"",
    }
  }
  getAuthorByID(id:string) {
    this.authorService.getAuthorById(id).subscribe((res) => {
      this.author = res as Author;
    });
  }
    cancel(){
      this.location.back();
        }
    alertMessage: string = ""
    onSubmit(form: NgForm) {
        if (confirm('Bạn có muốn cập nhật tác giả này không ?') == true) {
          // form.value.imgMonAn =  $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
          let id = this.route.snapshot.paramMap.get('id');
        form.value._id = id;
        form.value.quantity=100;
        this.authorService.putAuthor(form.value).subscribe(
         data => {console.log(data);
          this.alertSucess = true;
          this.alertMessage = "Cập Nhật Thông Tin Tác Giả Thành Công!";
          setTimeout(() => {  this.alertSucess = false;
            this.alertMessage = "";this._router.navigate(['/manageAuthor']); },2000);
        },
         error => console.log(error)
        );
      console.log('Your form data: '+  form.value._id)
    }
    }
    getLinkImgBook="";
    getLinkImg(event : any)
    { 
      this.getLinkImgBook=event.target.value;

    }
     
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

}
