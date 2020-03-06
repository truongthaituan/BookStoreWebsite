import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent implements OnInit {

  countryForm: FormGroup;
  countries = ['USA', 'Canada', 'Uk']
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
   this.countryForm = this.fb.group({
     countryControl: ['Canada']
   });
  }
}
