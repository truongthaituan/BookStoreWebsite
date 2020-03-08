import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
declare var $:any;
@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent implements OnInit {

  countryForm: FormGroup;
  countries = ['USA', 'Canada', 'Uk']
  constructor(private fb: FormBuilder) {
    $("#scrollToTopButton").click(function () {
      $("html, body").animate({scrollTop: 0}, 1000);
     });
  }
  ngOnInit() {
   this.countryForm = this.fb.group({
     countryControl: ['Canada']
   });
  }
}
