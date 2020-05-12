import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../app-services/book-service/book.service';
import { Book } from '../../../app-services/book-service/book.model';
import { CartBookService } from 'src/app/app-services/cartBook-service/cartBook.service';
import { CartBook } from 'src/app/app-services/cartBook-service/cartBook.model';
import { Point } from 'src/app/app-services/point-service/point.model';
import { PointService } from 'src/app/app-services/point-service/point.service';
declare var $: any;
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	success: Boolean = false;
	//
	customOptions: any
	constructor(private _router: Router, private bookService: BookService, private _cartBookDBService: CartBookService, private _pointService: PointService) {

	}
	//chứa thông tin giỏ hàng
	CartBook = [];
	TongTien = 0;
	TongCount = 0;
	point: Point = new Point;
	lengthCartBook = 0;
	accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
	cartBookDB: CartBook = new CartBook;
	ngOnInit() {
		this.script_Frontend();
		this.refreshBookList();
		this.getTotalCountAndPrice();
		//set Tổng tiền và số lượng trên header
		// if (localStorage.getItem('TongTien') == null) {
		// 	localStorage.setItem("TongTien", "0");
		// 	localStorage.setItem("TongCount", "0");
		// 	$('#tongtien').html("&nbsp;" + localStorage.getItem('TongTien') + " đ");
		// 	$('.cart_items').html(localStorage.getItem('TongCount'));
		// } else {
		// 	$('#tongtien').html("&nbsp;" + localStorage.getItem('TongTien') + " đ");
		// 	$('.cart_items').html(localStorage.getItem('TongCount'));
		// }
		//
		this.checkCartBookDBAndLocalStorage();

	}
	script_Frontend() {
		this.customOptions = {
			loop: false,
			mouseDrag: false,
			touchDrag: false,
			pullDrag: false,
			dots: false,
			navSpeed: 700,
			navText: ['<img src = "../../assets/img/02/Previous.png" class = "btnNav"/>',
				'<img src = "../../assets/img/02/Next.png" class = "btnNav"/>'],
			responsive: {
				0: {
					items: 1
				},
				400: {
					items: 2
				},
				740: {
					items: 3
				},
				940: {
					items: 4
				}
			},
			nav: true
		}
		$(function () {
			$("#scrollToTopButton").click(function () {
				$("html, body").animate({ scrollTop: 0 }, 1000);
			});

		});
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
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
		return  n2.split('').reverse().join('') + 'VNĐ';
	}
	moveToShop() {
		return this._router.navigate(['/booksCategory']);
	}

	moveToBookCategory() {
		return this._router.navigate(['/booksCategory']);
	}
	moveToBookDetail() {
		return this._router.navigate(['/bookDetail']);
	}
	selectedBook = [];
	detailBook(book: Book) {
		//   this.selectedBook.push(book);
		//   console.log(this.selectedBook);
		//   localStorage.setItem("selectedBook",JSON.stringify(this.selectedBook));
		return this._router.navigate(["/bookDetail" + `/${book._id}`]);
	}
	refreshBookList() {
		this.bookService.getBookList().subscribe((res) => {
			this.bookService.book = res as Book[];
		});
	}
	//Kiểm tra so sánh cartbookLocal và cartbookDB
	checkCartBookDBAndLocalStorage() {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this._cartBookDBService.getAllCartBookDBByUserID(this.accountSocial._id).subscribe(
				cartBookDB => {
					//kiểm tra xem cartbook và cartbookDB có khớp không
					if (this.lengthCartBook == 0) {
						//load cartbookDB by userID lên localStosrage (neu co)
						this.CartBook = cartBookDB as Book[]
						localStorage.setItem("CartBook", JSON.stringify(this.CartBook));
						this.getTotalCountAndPrice();
					} else if (Object.keys(cartBookDB).length == 0) {
						for (var i = 0; i < this.lengthCartBook; i++) {
							this.postCartBookDB(this.CartBook[i]);
						}
					}
					else if (Object.keys(cartBookDB).length != this.lengthCartBook) {
						//xóa hết db user // lưu lại mới theo localstorage
						this.mergeCartBookAndCartBookDB(cartBookDB);
						
					} else {
						var temp = 0
						// kiểm tra các value bên trong
						for (var i = 0; i < this.lengthCartBook; i++) {
							for (var j = 0; j < Object.keys(cartBookDB).length; j++) {
								if (this.CartBook[i]._id == Object.values(cartBookDB)[j]._id) {
									if (this.CartBook[i].count == Object.values(cartBookDB)[j].count) {
										temp++;
									}
								}
							}
						}
						if (temp != this.lengthCartBook) {
							//xóa hết db user // lưu lại mới theo localstorage
							this.mergeCartBookAndCartBookDB(cartBookDB);
						}
					}

				},
				error => console.log(error)
			);
			//get point user by userID
			this._pointService.getPointByUserID(this.accountSocial._id).subscribe(
				Point => {
				
					//nếu chưa tạo Point thì set = 0
					if( Object.keys(Point).length == 0 ){
						this.point.userID=this.accountSocial._id;
						this.point.point=0;
						this._pointService.postPoint(this.point).subscribe(
							pointNew=>{
								localStorage.setItem("Point", Object.values(pointNew)[0].point);
							}
						);
					}else{
						console.log(Object.values(Point)[0].point);
						localStorage.setItem("Point", Object.values(Point)[0].point);
					}
				},
				error => console.log(error)
			);
		}
	}
	//xóa hết db by UserID
	deleteAllCartBookDBByUserID(id) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {

			this._cartBookDBService.deleteAllCartBookByUserID(id).subscribe(
				req => {
					for (var i = 0; i < this.lengthCartBook; i++) {
						this.postCartBookDB(this.CartBook[i]);
					}
				},
				error => console.log(error)
			);
		}
	}
	//
	postCartBookDB(selectedBook: Book) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this.cartBookDB.userID = this.accountSocial._id;
			this.cartBookDB.bookID = selectedBook._id;
			this.cartBookDB.count = selectedBook.count;
			this._cartBookDBService.postCartBook(this.cartBookDB).subscribe(
				req => {
					console.log(req);
				},
				error => console.log(error)
			);
		}
	}
	getBookById(id: string) {
		this.bookService.getBookById(id).subscribe((res) => {

		});
	}
	//Xóa hết DB lưu lại theo giỏ hàng
	mergeCartBookAndCartBookDB(cartBookDB: Object){
		var setconfirm = confirm('Giỏ hàng cũ của bạn chưa được thanh toán ,bạn có muốn gộp giỏ hàng cũ vào không ?')
		if (setconfirm == true) {
			//gộp cartbook
			for (var i = 0; i < Object.keys(cartBookDB).length; i++) {
				for (var j = 0; j < this.lengthCartBook; j++) {
					if (this.CartBook[j]._id == Object.values(cartBookDB)[i]._id) {
						this.CartBook[j].count += Object.values(cartBookDB)[i].count;
						if (this.CartBook[j].count > 10) {
							this.CartBook[j].count = 10;
						}
						break;
					}
					if (j == this.lengthCartBook - 1) {
						//add 
						this.CartBook.push(Object.values(cartBookDB)[i]);
					}
				}
			}
			localStorage.setItem("CartBook", JSON.stringify(this.CartBook));
			this.getTotalCountAndPrice();
		}
		this.deleteAllCartBookDBByUserID(this.accountSocial._id);
	}
}
