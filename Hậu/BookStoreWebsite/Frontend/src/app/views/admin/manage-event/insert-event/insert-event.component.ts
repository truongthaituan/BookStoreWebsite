import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../../app-services/book-service/book.service';
import { CategoryService } from '../../../../app-services/category-service/category.service';
import { AuthorService } from '../../../../app-services/author-service/author.service';
import { Category } from '../../../../app-services/category-service/category.model';
import { Author } from '../../../../app-services/author-service/author.model';
import { Seri } from '../../../../app-services/seri-service/seri.model';
import { Promotion } from '../../../../app-services/promotion-service/promotion.model';
import { SeriService } from '../../../../app-services/seri-service/seri.service';
import { PromotionService } from 'src/app/app-services/promotion-service/promotion.service';
declare var $: any;
@Component({
  selector: 'app-insert-event',
  templateUrl: './insert-event.component.html',
  styleUrls: ['./insert-event.component.css']
})
export class InsertEventComponent implements OnInit {
  statusInsert: Boolean = false;
  accountSocial = JSON.parse(localStorage.getItem("accountSocial"));

  countryForm: FormGroup;
  // countries = ['USA', 'Canada', 'Uk']
  constructor(private _router: Router, private bookService: BookService,
    private fb: FormBuilder, private categoryService: CategoryService,
    private authorService: AuthorService, private seriService: SeriService, private promotionService: PromotionService) {
    $(function () {
      $(document).ready(function () {
        $("#selectCategory").change(function () {
          var selectedVal = $("#selectCategory option:selected").val();
          alert(selectedVal);
        });
        $("#selectAuthor").change(function () {
          var selectedVal = $("#selectAuthor option:selected").val();
          alert(selectedVal);
        });
      });
    });
  }

  ngOnInit() {
    this.getMinDateTime()
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    this.resetForm();


  }
  promotion: any
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.promotion = {
      _id: null,
      headerPromotion: "",
      imgPromotion: "",
      detailPromotion: "",
      discount: null,
      ifDiscount: null,
      startDate: "",
      endDate: "",
      listBookIn: null,
      isShow: "",
      addList:"",
    };
  }
  cancel() {
    this._router.navigate(['/managerEvent']);
  }
  onSubmit(form: NgForm) {
    form.value.startDate=this.DateStart+" "+this.TimeStart
    form.value.endDate=this.DateEnd+" "+this.TimeEnd
    form.value.listBookIn= form.value.listBookIn.split(",")
    
      this.promotionService.postPromotion(form.value).subscribe(
        data => {
          this.promotion= data as Promotion
     
          //update sale on list book
          if(data["listBookIn"]!=null){
              this.bookService.updateSalePromotion(this.promotion).subscribe(data2=>{
                console.log(data2)
                console.log("thanh cong")
              })
            
          }
          this.resetForm()
          // this._router.navigate(['/managerEvent']);
    
      this.statusInsert = true;
    },
        error => console.log(error)
       );
  }
  getLinkImgCategory = "";
  getLinkImg(event: any) {
    this.getLinkImgCategory = event.target.value;

  }

  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }







  // Xử lý thao tác
  IsSmallImg = true;
  IsBigImg = false;
  IsAveraImg = false;
  radioImgSmall() {
    this.IsSmallImg = true;
    this.IsAveraImg = false;
    this.IsBigImg = false;
  }
  radioImgAvera() {
    this.IsSmallImg = false;
    this.IsAveraImg = true;
    this.IsBigImg = false;
  }
  radioImgBig() {
    this.IsSmallImg = false;
    this.IsAveraImg = false;
    this.IsBigImg = true;
  }
  TimeStart: any
  DateStart: any
  TimeEnd: any
  DateEnd: any
  mindateStart: any
  mindateEnd: any
  minTimeStart: any
  minTimeEnd: any
  Listmonth = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" }
  getMinDateTime() {
    var now = new Date();
    var nowSplit = now.toString().split(" ") //hiện tại  
    //min date
    this.mindateStart=nowSplit[3]+'-'+this.Listmonth[nowSplit[1]]+'-'+nowSplit[2]
    if(this.timeStart==null){
      this.mindateEnd=this.mindateStart
    }else{
      this.mindateEnd=this.DateStart
    }
    //min time
  //   var timeNow=nowSplit[4].split(":")
  //   this.minTimeStart = timeNow[0]+":"+timeNow[1]
  //   if(this.mindateStart==this.DateStart){
  //   this.minTimeStart = timeNow[0]+":"+timeNow[1]
  // }else{
  //   this.minTimeStart="00:00"
  // }
  }

  //xử lý date time
  timeStart(event) {
    this.TimeStart = event.target.value

  }
  dateStart(event) {
    this.DateStart = event.target.value
    this.getMinDateTime()
  }
  timeEnd(event) {
    this.TimeEnd = event.target.value
  }
  dateEnd(event) {
    this.DateEnd = event.target.value
  }

  //xử lý các box
//   addList=false
//   IsCreateList(event)
//   {
// this.addList=event.target.value
// console.log(this.addList)
//   }

}
