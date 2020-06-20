import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { PointService } from 'src/app/app-services/point-service/point.service';
import { Point } from 'src/app/app-services/point-service/point.model';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
import swal from 'sweetalert';
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
  point: Point = new Point;
  discountCode: DiscountCode = new DiscountCode;
  pointCur: any;
  addPoint = 0;
  CartBook = [];
	TongTien = 0;
  TongCount = 0;
  lengthCartBook = 0;
  constructor(private _router: Router, private _pointService: PointService, private _discountCode: DiscountCodeService) {

  }
  changespinner="chocolate"  ;
  ngOnInit() {
    $("#changewhell").css({'float':'right','width':'90px','background-color':this.changespinner});
    $("#color").css({'color':this.changespinner});
    console.log("alo12323");
    console.log(this.changespinner);
    this.designWheel();
    console.log(this.accountSocial);
    this.getTotalCountAndPrice();
  }
  // set độ dài của giỏ hàng
	cartBookLength(CartBook) {
		if (CartBook == null) {
			this.lengthCartBook = 0;
		} else {
			this.lengthCartBook = CartBook.length;
		}
	}
	//get total count and price 
	getTotalCountAndPrice() {
		this.TongTien = 0;
		this.TongCount = 0;
		this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
		this.cartBookLength(this.CartBook);
		if (this.CartBook != null) {
			for (var i = 0; i < this.lengthCartBook; i++) {
        this.TongTien += parseInt((parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count)*(100-this.CartBook[i].sale)/100).toFixed(0));
				this.TongCount += parseInt(this.CartBook[i].count);
			}
		}
		$('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
		$('.cart_items').html(this.TongCount.toString());
		localStorage.setItem("TongTien", this.TongTien.toString());
		localStorage.setItem("TongCount", this.TongCount.toString());
	  }
	  //#endregion
	   formatCurrency(number){
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
		return  n2.split('').reverse().join('') + 'VNĐ';
	}
  designWheel() {
    //Thông số vòng quay
    let duration = 5; //Thời gian kết thúc vòng quay
    let spins = 15; //Quay nhanh hay chậm 3, 8, 15
    let theWheel;
    if(this.changespinner=="gold"){
     theWheel = new Winwheel({
      'numSegments': 12,     // Chia 8 phần bằng nhau
      'outerRadius': 212,   // Đặt bán kính vòng quay
      'textFontSize': 18,    // Đặt kích thước chữ
      'rotationAngle': 0,     // Đặt góc vòng quay từ 0 đến 360 độ.
      'segments':        // Các thành phần bao gồm màu sắc và văn bản.
        [
          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' },
          { 'fillStyle': '#55E652', 'text': '+100 điểm' },
       
          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#e7706f', 'text': 'Mã giảm giá 10%' },
          { 'fillStyle': '#55E652', 'text': '+100 điểm' },


          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' },
          { 'fillStyle': '#FE2EF7', 'text': '+200 điểm' },

          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#e7706f', 'text': 'Mã giảm giá 10%' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' }
    
        ],
      'animation': {
        'type': 'spinToStop',
        'duration': duration,
        'spins': spins,
        'callbackSound': playSound,     //Hàm gọi âm thanh khi quay
        'soundTrigger': 'pin',         //Chỉ định chân là để kích hoạt âm thanh
        'callbackFinished': alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
      },
      'pins':
      {
        'number': 32   //Số lượng chân. Chia đều xung quanh vòng quay.
      }
    });
  }else
  if(this.changespinner=="silver"){
     theWheel = new Winwheel({
      'numSegments': 12,     // Chia 8 phần bằng nhau
      'outerRadius': 212,   // Đặt bán kính vòng quay
      'textFontSize': 18,    // Đặt kích thước chữ
      'rotationAngle': 0,     // Đặt góc vòng quay từ 0 đến 360 độ.
      'segments':        // Các thành phần bao gồm màu sắc và văn bản.
        [
          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' },
          { 'fillStyle': '#55E652', 'text': '+100 điểm' },
       
          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#e7706f', 'text': 'Mã giảm giá 10%' },
          { 'fillStyle': '#55E652', 'text': '+100 điểm' },

          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' },
          { 'fillStyle': '#FE2EF7', 'text': '+200 điểm' },

          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#e7706f', 'text': 'Mã giảm giá 10%' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' }
    
        ],
      'animation': {
        'type': 'spinToStop',
        'duration': duration,
        'spins': spins,
        'callbackSound': playSound,     //Hàm gọi âm thanh khi quay
        'soundTrigger': 'pin',         //Chỉ định chân là để kích hoạt âm thanh
        'callbackFinished': alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
      },
      'pins':
      {
        'number': 32   //Số lượng chân. Chia đều xung quanh vòng quay.
      }
    })
  }else{
     theWheel = new Winwheel({
      'numSegments': 12,     // Chia 8 phần bằng nhau
      'outerRadius': 212,   // Đặt bán kính vòng quay
      'textFontSize': 18,    // Đặt kích thước chữ
      'rotationAngle': 0,     // Đặt góc vòng quay từ 0 đến 360 độ.
      'segments':        // Các thành phần bao gồm màu sắc và văn bản.
        [
          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' },
          { 'fillStyle': '#55E652', 'text': '+100 điểm' },
       
          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#e7706f', 'text': 'Mã giảm giá 10%' },
          { 'fillStyle': '#55E652', 'text': '+100 điểm' },


          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' },
          { 'fillStyle': '#FE2EF7', 'text': '+200 điểm' },

          { 'fillStyle': '#eae56f', 'text': 'Không có quà' },
          { 'fillStyle': '#e7706f', 'text': 'Mã giảm giá 10%' },
          { 'fillStyle': '#89f26e', 'text': 'Mã giảm giá 5%' }
    
        ],
      'animation': {
        'type': 'spinToStop',
        'duration': duration,
        'spins': spins,
        'callbackSound': playSound,     //Hàm gọi âm thanh khi quay
        'soundTrigger': 'pin',         //Chỉ định chân là để kích hoạt âm thanh
        'callbackFinished': alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
      },
      'pins':
      {
        'number': 32   //Số lượng chân. Chia đều xung quanh vòng quay.
      }
    });
  }
    var addPoint: any
   
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
      if (status == 1) { //trước khi quay
        document.getElementById('spin_start').removeAttribute("disabled");
        document.getElementById('spin_reset').classList.add("hide");
      } else if (status == 2) { //đang quay
        document.getElementById('spin_start').setAttribute("disabled", 'false');
        document.getElementById('spin_reset').classList.add("hide");
      } else if (status == 3) { //kết quả
        document.getElementById('spin_reset').classList.remove("hide");
      } else {
        alert('Các giá trị của status: 1, 2, 3');
      }
    }
    statusButton(1);
   function minusPoint() {
      //tăng point 
      $.ajax({
        type: "post",
        url: 'http://localhost:3000/points/updatePointByUserID',
        data: {
          userID: (JSON.parse(localStorage.getItem('accountSocial')))._id,
          point: -80
        },
        success: function(response) {      
          $.get('http://localhost:3000/points/getPointByUserID/'+ (JSON.parse(localStorage.getItem('accountSocial')))._id, function(data) {
            $("#pointcur").html(data[0].point + " Điểm");
        });
        }
    });
        }
    //startSpin
    function startSpin() {
      $.get('http://localhost:3000/points/getPointByUserID/'+ (JSON.parse(localStorage.getItem('accountSocial')))._id, function(data) {
      if(data[0].point>=80) {    
        // Ensure that spinning can't be clicked again while already running.
      if (wheelSpinning == false) {
        //CSS hiển thị button
        statusButton(2);
        //Hàm bắt đầu quay
        theWheel.startAnimation();
        //Khóa vòng quay
        wheelSpinning = true;
        minusPoint();
      }}else{
        swal('Bạn không đủ điều kiện để quay thưởng');
      }
    });
    }
    //Result
    function alertPrize(indicatedSegment) {
      if (indicatedSegment.text == "Không có quà") {
       
        swal("Chúc Bạn May Mắn Lần Sau");
     
      } else
        if (indicatedSegment.text[0] == "+") {
          var res = indicatedSegment.text.split(" điểm");
          var str = res[0].split("+");
          swal("Bạn Được Cộng Thêm " + str[1] + " Điểm Vào Tài Khoản");
          // chạy dòng này oke thì ngon  
          addPoint = str[1];
          $.ajax({
            type: "post",
            url: 'http://localhost:3000/points/updatePointByUserID',
            data: {
              userID: (JSON.parse(localStorage.getItem('accountSocial')))._id,
              point: addPoint
            },
            success: function(response) {      
              $.get('http://localhost:3000/points/getPointByUserID/'+ (JSON.parse(localStorage.getItem('accountSocial')))._id, function(data) {
                $("#pointcur").html(data[0].point + " Điểm");
            });
            }
        });
        } else {
          swal("Chúc Mừng Bạn Đã Trúng " + indicatedSegment.text + " Cho Toàn Bộ Đơn Hàng");
          var res = indicatedSegment.text.split("Mã giảm giá ");
          var str = res[1].split("%");
          console.log("Here--->>"+str[0]);
          $.ajax({
            type: "post",
            url: 'http://localhost:3000/discountCodes',
            data: {
              userID: (JSON.parse(localStorage.getItem('accountSocial')))._id,
              discountCode: str[0],
              discountDetail: indicatedSegment.text,
              status:0,
            }
        });
        }
      //CSS hiển thị button
      statusButton(3);
      // chạy dòng này oke thì ngon  
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
  getPointByUserID() {
    //get point user by userID

    this._pointService.getPointByUserID(this.accountSocial._id).subscribe(
      Point => {
        localStorage.setItem("Point", Object.values(Point)[0].point);
        this.point.point = Object.values(Point)[0].point;
      },
      error => console.log(error)
    );
  }
  ChangeWheelSpnner(event : any)
  {
    this.changespinner=event.target.value;
    this.ngOnInit();
  }

  //search
  InputSearch = "";
  getInputSearch(event) {
    this.InputSearch = event.target.value;
    console.log(this.InputSearch)
  }
  Search(){
    if(this.InputSearch!=""){
      return this._router.navigate(['/aboutUs/' + `/${this.InputSearch}`]);
    }
  }
}
