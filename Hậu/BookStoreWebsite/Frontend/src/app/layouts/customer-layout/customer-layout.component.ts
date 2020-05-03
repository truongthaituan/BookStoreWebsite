import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
declare var $: any;
declare let Winwheel: any

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent implements OnInit {

  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy = localStorage.getItem('loginBy');

  constructor(private _router: Router) {

  }
  ngOnInit() {
    this.designWheel();

  }
  designWheel() {
	 //Thông số vòng quay
   let duration = 5; //Thời gian kết thúc vòng quay
   let spins    = 15; //Quay nhanh hay chậm 3, 8, 15
   let theWheel = new Winwheel({
       'numSegments'  : 8,     // Chia 8 phần bằng nhau
       'outerRadius'  : 212,   // Đặt bán kính vòng quay
       'textFontSize' : 18,    // Đặt kích thước chữ
       'rotationAngle': 0,     // Đặt góc vòng quay từ 0 đến 360 độ.
       'segments'     :        // Các thành phần bao gồm màu sắc và văn bản.
       [
          {'fillStyle' : '#eae56f', 'text' : 'Giải 1'},
          {'fillStyle' : '#89f26e', 'text' : 'Giải 2'},
          {'fillStyle' : '#7de6ef', 'text' : 'Giải 3'},
          {'fillStyle' : '#e7706f', 'text' : 'Giải 4'},
          {'fillStyle' : '#eae56f', 'text' : 'Giải 5'},
          {'fillStyle' : '#89f26e', 'text' : 'Giải 6'},
          {'fillStyle' : '#7de6ef', 'text' : 'Giải 7'},
          {'fillStyle' : '#e7706f', 'text' : 'Giải 8'}
       ],
       'animation' : {
           'type'     : 'spinToStop',
           'duration' : duration,
           'spins'    : spins,
           'callbackSound'    : playSound,     //Hàm gọi âm thanh khi quay
           'soundTrigger'     : 'pin',         //Chỉ định chân là để kích hoạt âm thanh
           'callbackFinished' : alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
       },
       'pins' :
       {
           'number' : 32   //Số lượng chân. Chia đều xung quanh vòng quay.
       }
   });
   
   //Kiểm tra vòng quay
   let wheelSpinning = false;
   
   //Tạo âm thanh và tải tập tin tick.mp3.
   let audio = new Audio('../../../assets/spinner/tick.mp3');
   function playSound() {
       audio.pause();
       audio.currentTime = 0;
       audio.play();
   }
   
   //Hiển thị các nút vòng quay
   function statusButton(status) {
       if ( status==1 ) { //trước khi quay
           document.getElementById('spin_start').removeAttribute("disabled");
           document.getElementById('spin_reset').classList.add("hide");
       } else if ( status==2 ) { //đang quay
           document.getElementById('spin_start').setAttribute("disabled", 'false');
           document.getElementById('spin_reset').classList.add("hide");
       } else if ( status==3 ) { //kết quả
           document.getElementById('spin_reset').classList.remove("hide");
       } else {
           alert('Các giá trị của status: 1, 2, 3');
       }
   }
   statusButton(1);
   
   //startSpin
   function startSpin() {
       // Ensure that spinning can't be clicked again while already running.
       if (wheelSpinning == false) {
           //CSS hiển thị button
           statusButton(2);
           
           //Hàm bắt đầu quay
           theWheel.startAnimation();

           //Khóa vòng quay
           wheelSpinning = true;
       }
   }
   
   //Result
   function alertPrize(indicatedSegment) {
       alert("Chúc mừng bạn trúng: " + indicatedSegment.text);
       
       //CSS hiển thị button
       statusButton(3);
   }

   //resetWheel
   function resetWheel() {
       //CSS hiển thị button
       statusButton(1);
       
       theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
       theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
       theWheel.draw();                // Call draw to render changes to the wheel.

       wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
   }
		 		document.getElementById("spin_start").addEventListener("click", startSpin);
         document.getElementById("spin_reset").addEventListener("click", resetWheel);
	}
  moveToAccount() {
    return this._router.navigate(['/account']);
  }
  moveToHome() {

    return this._router.navigate(['/']);
  }

  moveToProfile() {
    return this._router.navigate(['/profile']);
  }
  moveToCart() {
    return this._router.navigate(['/cartBook']);
  }
  logout() {
    localStorage.clear();
    window.location.href = "/";
  }


}
