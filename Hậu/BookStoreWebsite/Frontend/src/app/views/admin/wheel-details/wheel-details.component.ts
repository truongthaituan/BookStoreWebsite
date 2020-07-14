import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SegmentService } from 'src/app/app-services/segment-service/segment.service';
import { Segment } from 'src/app/app-services/segment-service/segment.model';
declare var $: any;
declare let Winwheel: any
@Component({
  selector: 'app-wheel-details',
  templateUrl: './wheel-details.component.html',
  styleUrls: ['./wheel-details.component.css']
})
export class WheelDetailsComponent implements OnInit {

  constructor(private _router: Router, private route: ActivatedRoute, private segmentService: SegmentService) { }
  segments: any
  segmentsList1 = [] 
  segmentIndex: {}
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getWheelByID(id)
    this.segmentService.getSegmentsByID(id).subscribe(res => {
      this.designWheel();
    })
  }
  designWheel() {
    //Thông số vòng quay
   console.log(this.segmentsList)
    let theWheel = new Winwheel({
        'numSegments': 12,     // Chia 12 phần bằng nhau
        'outerRadius': 152,   // Đặt bán kính vòng quay
        'textFontSize': 14,    // Đặt kích thước chữ
        'rotationAngle': 0,     // Đặt góc vòng quay từ 0 đến 360 độ.
        'segments': this.segmentsList,    // Các thành phần bao gồm màu sắc và văn bản.
        'pins':
        {
          'number': 32   //Số lượng chân. Chia đều xung quanh vòng quay.
        }
      });
      theWheel.draw(); 
  }
  segmentsList = []
  segmentItem = {}
  getWheelByID(id) {
    this.segmentService.getSegmentsByID(id).subscribe(res => {
      this.segmentService.segment = res as Segment
      // this.segmentService.segment.segments.forEach(element => {
        for(let element of this.segmentService.segment["segments"]){
        this.segmentItem = { "fillStyle": element["fillStyle"], "text": element["text"] }
        this.segmentsList.push(this.segmentItem)
        console.log(this.segmentsList)
        }
      // });
    })
  }
  cancel(){
    this._router.navigate(['/manageWheel'])
  }
}
