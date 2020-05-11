import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../app-services/order-service/order.service';
import { OrderDetailService } from '../../../app-services/orderDetail-service/orderDetail.service';
import { CustomerService } from '../../../app-services/customer-service/customer.service';
import { Customer } from '../../../app-services/customer-service/Customer.model';
import { SendMailService } from '../../../app-services/sendMail-service/sendMail.service';
import { BookService } from '../../../app-services/book-service/book.service';
import { LocationService } from '../../../app-services/location-service/location.service';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { VerifyEmailService } from '../../../app-services/verify-email/verify-email.service';
import { VerifyEmail } from '../../../app-services/verify-email/verify-email.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';
declare var $: any;
interface Coordinates {
  address: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-book-cart-cus-info',
  templateUrl: './book-cart-cus-info.component.html',
  styleUrls: ['./book-cart-cus-info.component.css']
})
export class BookCartCusInfoComponent implements OnInit {
  coordinates: Coordinates;

  constructor(private _router: Router, private _customerService: CustomerService ,  private mapsAPILoader: MapsAPILoader,private modalService: NgbModal,
    private ngZone: NgZone,
     private _locationService: LocationService, private verifyEmailService: VerifyEmailService) {
      this.coordinates = {} as Coordinates;
  }
  latitude: number;
  longitude: number;
  zoom: number;
  addressgg: string;
  private geoCoder;

  @ViewChild('search', {static: false})
  public searchElementRef: ElementRef;

  //chứa thông tin giỏ hàng
  CartBook = [];
  customer: Customer = new Customer;
  allCustomer: any;
  TongTien = 0;
  TongCount = 0;
  //thông tin login
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  //change info payment
  customer_id="";     //dùng khi update
  city = "";
  districts = "";
  wards = "";
  address = "";
  phone = "";
  email = "";
  username = "";
  typeAddress = "";
  lengthCartBook = 0;
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  //list Location
  LocationCity: any;
  LocationDistricts: any;
  LocationWards: any;
  // check validate Input Form
  CheckEmail : any;// @gmail.com
  CheckUserName = false;
  CheckPhone =false; // length = 10 
  CheckCity = false;
  CheckDistrict = false;
  CheckWards = false;
  CheckAddress = false;
  CheckTypeAddress = false;
  //check toàn bộ ở trên
  CheckAll = false;
  //nếu = true thì form sẽ hiện ra
  ShowFormEdit = false;
  //nếu bằng true thì sẽ là update
  IsUpdateCustomer=false;
  iconUrl = { url: '../../../../assets/img/img_marker/marker.png', scaledSize: {height: 50, width: 50}}
  origin: any;
  destination: any;
  ngOnInit() {
    this.showAddressStore();

 //load Places Autocomplete
 this.mapsAPILoader.load().then(() => {
  this.setCurrentLocation();
  this.geoCoder = new google.maps.Geocoder;
  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
  autocomplete.addListener("place_changed", () => {
    this.ngZone.run(() => {
      //get the place result
      let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      //verify result
      if (place.geometry === undefined || place.geometry === null) {
        return;
      }
      //set latitude, longitude and zoom
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.zoom = 12;
      this.getAddress(this.latitude,this.longitude);
      this.calculateDistance(place.geometry.location.lat(),  place.geometry.location.lng());
      this.getDirection(place.geometry.location.lat(),  place.geometry.location.lng());
    });
  });
});
    this.script_Frontend();
    // if (this.accountSocial) {
    //   this.email = this.accountSocial.email;
    //   this.username = this.accountSocial.username;
    // }
    //get giỏ hàng
    this.CartBook = JSON.parse(localStorage.getItem("CartBook"));

    //set độ dài cartBook
    this.cartBookLength(this.CartBook);
    //set value giỏ hàng trên thanh head 
    this.getTotalCountAndPrice();
    this.getListCity();
    //kiem tra  form
    this.CheckEmailInvalid();
    this.CheckUserNameInvalid();
    this.CheckPhoneInvalid();

    //get all customer
    this.getPostPutCustomerByUserID(this.accountSocial._id);
    this.RunCheckAllInValid();
  
  }

// Get Current Location Coordinates
private setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 8;
      this.getAddress(this.latitude, this.longitude);
      this.calculateDistance(position.coords.latitude, position.coords.longitude);
      this.getDirection(position.coords.latitude, position.coords.longitude)
    });
   
  }
}

markerDragEnd($event: MouseEvent) {
  console.log($event);
  this.latitude = $event.coords.lat;
  this.longitude = $event.coords.lng;
  this.getAddress(this.latitude, this.longitude);
  this.calculateDistance($event.coords.lat, $event.coords.lng);
  this.getDirection($event.coords.lat, $event.coords.lng);
}
getDirection(latTo, lngTo) {
  this.origin = { lat: this.latStore, lng: this.longStore};
  this.destination = { lat: latTo, lng: lngTo};
}
getAddress(latitude, longitude) {
  this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
    console.log(results);
    console.log(status);
    if (status === 'OK') {
      if (results[0]) {
        this.zoom = 12;
        this.addressgg = results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

  });
}
  latStore: number = 10.8579485;
  longStore: number = 106.7582144;
  addressStore: String = '';
  showAddressStore() {
    this.mapsAPILoader.load().then(() => {
    let geocoder = new google.maps.Geocoder;
    let latlng = {lat: this.latStore, lng: this.longStore};
    geocoder.geocode({'location': latlng}, (results, status) => {
       this.addressStore = results[0].formatted_address;
    });
  });
}
feeShip: number
calculateDistance(latTo, longTo) {
  this.mapsAPILoader.load().then(() => {
  const from = new google.maps.LatLng(this.latStore, this.longStore);
  const to = new google.maps.LatLng(latTo, longTo);
  const distance = Number((google.maps.geometry.spherical.computeDistanceBetween(from, to)).toFixed(0));
  console.log(distance)
  if(distance <= 1000){
    this.feeShip = 0;
  }
  if(1000 <= distance && distance <= 10000){
    this.feeShip = Number((distance / 1000).toFixed(0)) * 2000;
    console.log(this.feeShip)
  }else
  if(10000 <= distance && distance <= 50000){
    let shipDefault10000 =  20000;
    this.feeShip = (Number(((distance - 10000) / 1000).toFixed(0))  * 5000) + shipDefault10000;
    console.log(this.feeShip)
  }else
  if(50000 <= distance && distance <= 100000){
    let shipDefault50000 =  50000;
    this.feeShip = (Number(((distance - 50000) / 1000).toFixed(0)) * 10000) + shipDefault50000;
    console.log(this.feeShip)
  }
  });
}

  script_Frontend()
  {
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

      if(localStorage.getItem('statusLogin') == 'true'){
          $("#checkLogin").addClass("active");
          $("#customer").addClass("active");
        }
        
        $('#btnHuyBo').click(function(){
          $('html,body').animate({
            scrollTop: $("#infoAddress").offset().top},
            'fast');
        });
        $('#addScrollUpdate').click(function(){
          $('html,body').animate({
            scrollTop: $("#formLocation").offset().top},
            'fast');
        });
        $('#addScroll2').click(function(){
          $('html,body').animate({
            scrollTop: $("#formLocation").offset().top},
            'fast');
        });
    });
  }
  moveToPayment(customer: Customer) {
    return this._router.navigate(["/payment" + `/${customer._id}`]);
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
        this.TongTien += parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count);
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
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&.");    
    return  n2.split('').reverse().join('') + 'VNĐ';
}
  //get list city
  getListCity() {
    this._locationService.getLocationCity().subscribe(
      ListCity => {

        this.LocationCity = ListCity;

      },
      error => console.log(error)
    );
  }
  //get list districts
  getListDistricts(city: string) {
    this._locationService.getLocationdistricts(city).subscribe(
      ListDistricts => {

        this.LocationDistricts = ListDistricts;

      },
      error => console.log(error)
    );
  }
  //get list wards
  getListWards(city: string, districts: string) {
    this._locationService.getLocationWards(city, districts).subscribe(
      ListWards => {

        this.LocationWards = ListWards;

      },
      error => console.log(error)
    );
  }
  //#endregion

  //#region Edit OnChange Form
  //eidt customer info
  //edit city --> update list districts --> wards về rỗng
  editCity(event: any) {
    this.city = event.target.value;
    this.wards = "";
    this.districts = "";
    this.LocationWards = null;
    this.LocationDistricts = null;
    this.getListDistricts(this.city);
    this.CheckCityInvalid();
    this.CheckDistricInvalid();
    this.CheckWardInvalid();
  }
  //edit  districts --> update list wards
  editdistricts(event: any) {
    this.districts = event.target.value;
    this.wards = "";
    this.LocationWards = null;
    this.getListWards(this.city, this.districts);
    this.CheckDistricInvalid();
    this.CheckWardInvalid();
  }
  editWards(event: any) {
    this.wards = event.target.value;
    this.CheckWardInvalid();
  }
  statusEmailFailed: string = ""
  verifyEmail: any
  editEmail(event: any) {
   
    this.email = event.target.value;
      this.verifyEmailService.actionVerifyEmail(this.email).subscribe(res =>{
        console.log(res);
        this.verifyEmail = res
        if(this.CheckEmailInvalid() == true && this.verifyEmail.deliverable == true){
          this.CheckEmail = true;
      }
      else{
        this.CheckEmail = false;
        this.statusEmailFailed = "Xin lỗi, email này có thể không có thật!";
      }
      })
  }

  editUserName(event: any) {
    this.username = event.target.value;
    this.CheckUserNameInvalid();
  }

  editAddress(event: any) {
    this.address = event.target.value;
    this.CheckAddressInvalid();
  }
  editPhone(event: any) {
    this.phone = event.target.value;
    if(this.CheckPhoneInvalid() == true){
      this.CheckPhone = true;
    }else{
      this.CheckPhone = false;
    }
  }
  editTypeAddress() {
    this.typeAddress = "Nhà riêng";
    this.CheckTypeAddressInvalid();
  }
  editTypeAddress2() {
    this.typeAddress = "Cơ quan";
    console.log(this.typeAddress);
    this.CheckTypeAddressInvalid();
  }

  //#endregion

  //#region Check Validate
  //check Input Form 
  CheckEmailInvalid() {
    // this.CheckEmail = false;
    // var temp = this.email.trim();
    // if (temp.startsWith("@gmail.com") && temp.length > 10) {
    //   this.CheckEmail = true;
    // }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.email).toLowerCase());
  }
  CheckUserNameInvalid() {
    var check = this.username.trim();
    this.CheckUserName = false;
    if (check.length > 2) {
      this.CheckUserName = true;
    }
  }
  CheckPhoneInvalid() {
    // var check = this.phone.trim();
    // this.CheckPhone = false;
    // if (check.length > 9 && check.length < 11) {
    //   this.CheckPhone = true;
    // }
    var re = /^[0-9]{10,11}$/;
    return re.test(String(this.phone).toLowerCase());
    
  }
  CheckCityInvalid() {
    this.CheckCity = false;
    if (this.city != "") {
      this.CheckCity = true;
    }
  }
  CheckDistricInvalid() {
    this.CheckDistrict = false;
    if (this.districts != "") {
      this.CheckDistrict = true;
    }
  }
  CheckWardInvalid() {
    this.CheckWards = false;
    if (this.wards != "") {
      this.CheckWards = true;
    }
  }
  CheckAddressInvalid() {
    this.CheckAddress = false;
    var temp = this.address.trim();
    if (temp != "") {
      this.CheckAddress = true;
    }
  }
  CheckTypeAddressInvalid() {
    this.CheckTypeAddress = false;
    if (this.typeAddress != "") {
      this.CheckTypeAddress = true;
    }
  }
  RunCheckAllInValid(){
    this.CheckEmailInvalid();
    this.CheckUserNameInvalid();
    this.CheckPhoneInvalid();
    this.CheckCityInvalid();
    this.CheckDistricInvalid();
    this.CheckWardInvalid();
    this.CheckAddressInvalid();
    this.CheckTypeAddressInvalid();
  }
  //#endregion

  //click vào hình chuyển về detail
  ViewBookDetail(idBook) {
    return this._router.navigate(["/bookDetail" + `/${idBook}`]);
  }
  goToBookCategory() {
    this._router.navigate(['/booksCategory']);
  }

  //check all ( Kiểm tra tất cả trường hợp check thỏa thì mới post hoặc put)
  checkAllInvalid() {
    this.CheckAll = true;
    if (!this.CheckEmail) {
      this.CheckAll = false;
      //message
      this.alertMessage = "Vui lòng nhập Email đúng cú pháp abc@gmail.com";
    } else
      if (!this.CheckUserName) {
        this.CheckAll = false;
        //message
        this.alertMessage = "Vui lòng kiểm tra lại tên của bạn";
      } else
        if (!this.CheckPhone) {
          this.CheckAll = false;
          //message
          this.alertMessage = "Vui lòng kiểm tra lại số điện thoại của bạn";
        } else
          if (!this.CheckCity) {
            this.CheckAll = false;
            //message
            this.alertMessage = "Vui lòng chọn Tỉnh/Thành phố";
          } else
            if (!this.CheckDistrict) {
              this.CheckAll = false;
              this.alertMessage = "Vui lòng chọn Quận/Huyện"
            } else
              if (!this.CheckWards) {
                this.CheckAll = false;
                this.alertMessage = "Vui lòng chọn Phường/Xã"
              } else
                if (!this.CheckAddress) {
                  this.CheckAll = false;
                  this.alertMessage = "Vui lòng nhập địa chỉ"
                } else
                  if (!this.CheckTypeAddress) {
                    this.CheckAll = false;
                    this.alertMessage = "Vui lòng chọn loại địa chỉ"
                  }
    if (!this.CheckAll) {
      this.alertFalse = true;
      setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
    }

  }
  //post customer 
  postCustomer() {
    this.checkAllInvalid();
    if (this.CheckAll == true) {
      var customer = new Customer;
      customer.userID = this.accountSocial._id;
      customer.email = this.email;
      customer.name = this.username;
      customer.phone = this.phone;
      customer.city = this.city;
      customer.districts = this.districts;
      customer.wards = this.wards;
      customer.address = this.address;
      customer.typeAddress = this.typeAddress;
      this._customerService.postCustomer(customer).subscribe(
        customerpost => {
          // console.log(Object.values(customerpost)[0]);
        //  console.log(Object.values(customerpost)[0]._id);
          this._router.navigate(['/payment/' +  Object.values(customerpost)[0]]);
        },
        error => console.log(error)
      );
    }
  }
  //put customer
  putCustomer(id) {
 
    this.checkAllInvalid();
    
    if (this.CheckAll == true) {
      var customer = new Customer;
      customer._id = id;
      customer.userID = this.accountSocial._id;
      customer.email = this.email;
      customer.name = this.username;
      customer.phone = this.phone;
      customer.city = this.city;
      customer.districts = this.districts;
      customer.wards = this.wards;
      customer.address = this.address;
      customer.typeAddress = this.typeAddress;
      console.log(customer);
      this._customerService.putCustomer(customer).subscribe(
        customerput => {
          this.CloseForm();
        },
        error => console.log(error)
      );
    }
  }
  //get customer by userID
  getPostPutCustomerByUserID(Userid) {
    this._customerService.getCustomerByUserID(Userid).subscribe(
      getcustomer => {
        this.allCustomer = getcustomer;
        if (this.allCustomer.length > 0) {

        } else {
          this.ShowFormEdit = true;
        }

      },
      error => console.log(error)
    );
  }
  ClickAddCustomer()
  {
    this.CloseForm();
    this.CheckEmail=null;
    this.CheckPhone=false;
    this.ShowFormEdit=true;
  }
  //#region Event Click Customer 
  ClickEditCustomer(customer: Customer) {
    
    this.CheckEmail=true;
    this.CheckPhone=true;
    this.ShowFormEdit = true;
    this.IsUpdateCustomer=true;
    this.customer_id = customer._id;
    this.email = customer.email;
    this.username = customer.name;
    this.phone = customer.phone;
    this.city = customer.city;
    this.districts = customer.districts;
    this.wards = customer.wards;
    this.address = customer.address;
    this.typeAddress = customer.typeAddress;
    this.getListDistricts(this.city);
    this.getListWards(this.city,this.districts);
    this.ngOnInit();
    
  }

  ClickDeleteCustomer(id) {
    console.log("xóa");
    var setconfirm = confirm('Bạn có chắc là muốn xóa địa chỉ giao hàng này ?')
    if (setconfirm == true) {
      this._customerService.deleteCustomer(id).subscribe(
        customerput => {
          this.ngOnInit();
        },
        error => console.log(error)
      );
    }
  }
  CloseForm() {
    this.customer_id = "";
    this.email = "";
    this.username = "";
    this.phone = "";
    this.city = "";
    this.districts = "";
    this.wards = "";
    this.address = "";
    this.typeAddress = "";
    this.IsUpdateCustomer=false;
    this.ShowFormEdit = false;
    this.ngOnInit();
  }



}
