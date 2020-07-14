import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SegmentService } from 'src/app/app-services/segment-service/segment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insert-wheel',
  templateUrl: './insert-wheel.component.html',
  styleUrls: ['./insert-wheel.component.css']
})
export class InsertWheelComponent implements OnInit {
  segmentForm: FormGroup;
  constructor(private segmentService: SegmentService, private _router: Router, private formBuilder: FormBuilder) { }
 
  statusInsert = false
  ngOnInit() {
    this.segmentForm = this.formBuilder.group({
      nameWheel: ['', [Validators.email, Validators.required]],
      option0: ['', Validators.required],
      option1: ['', [Validators.required]],
      option2: ['', Validators.required],
      option3: ['', [Validators.required]],
      option4: ['', [Validators.required]],
      option5: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
  });
  this.initialSegment()
  }
  initialSegment() {
    this.segmentService.segment = ({
      _id: null,
      nameWheel: '',
      segments:null,
      isActive: false
    });
  }
  insertWheel() {
    console.log(JSON.stringify(this.segmentForm.value))
        this.segmentService.postSegment(this.segmentForm.value).subscribe(
          data => {console.log(data);this._router.navigate(['/manageWheel']);
        this.statusInsert = true;
      },
          error => console.log(error)
         );
  }
}
