import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../app-services/book-service/book.service';
import { Book } from '../../../app-services/book-service/book.model';
import { CartBookService } from 'src/app/app-services/cartBook-service/cartBook.service';
import { CartBook } from 'src/app/app-services/cartBook-service/cartBook.model';
import { Point } from 'src/app/app-services/point-service/point.model';
import { PointService } from 'src/app/app-services/point-service/point.service';
//recommend
import { BestService } from '../../../app-services/best-service/best.service';
import { Recommend } from '../../../app-services/recommendSys-service/recommendSys.service';
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
	constructor(private _router: Router, private bookService: BookService,
		private _cartBookDBService: CartBookService, private _pointService: PointService
		, private _bestService: BestService,private _recommendSyS:Recommend) {

	}
	//chứa thông tin giỏ hàng
	CartBook = [];
	TongTien = 0;
	TongCount = 0;
	point: Point = new Point;
	lengthCartBook = 0;
	accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
	cartBookDB: CartBook = new CartBook;

	//recommend
	bestBookList: Book = new Book;
	BookByListCategoryBest:any
	ngOnInit() {
		$('.searchHeader').attr('style', 'font-size: 1.6rem !important');
		this.script_Frontend();
		this.refreshBookList();
		this.getTotalCountAndPrice();
		this.checkCartBookDBAndLocalStorage();
		this.getBestBookAndRecommend();
	}
	//recommend
	theloai1:any
	theloai2:any
	ListBookCategory1:any
	ListBookCategory2:any
	IsRecommend = false

	ListrateRecommend:any
	IsRateRecommend=false

	ListClickRecommend:any
	IsClickRecommend=false

	ListBuyRecommend:any
	IsBuyRecommend=false
	getBestBookAndRecommend() {
		//get sách được mua nhiều nhất
		this._bestService.getBookBestSelling().subscribe(
			listBestBook => {
				this.bestBookList = listBestBook as Book
				
			});
		//get 2 thể loại mà người dùng thích nhất để show sách theo thể loại
		
		this._bestService.getBookOnCategoryBuyMostByUserID(this.accountSocial._id).subscribe(
			listBestBookOnCategory => {
		
				this.BookByListCategoryBest = listBestBookOnCategory as Book
				if(this.BookByListCategoryBest.length>1)
				{
					this.IsRecommend = true
					this.theloai1=Object.keys(this.BookByListCategoryBest[0])[0]
					this.theloai2=Object.keys(this.BookByListCategoryBest[1])[0]
					this.ListBookCategory1=Object.values(this.BookByListCategoryBest[0])[0]
					this.ListBookCategory2=Object.values(this.BookByListCategoryBest[1])[0]
				}else{
					this.IsRecommend = false
				}
		
			});
		this._recommendSyS.getAllRecommendByUserID(this.accountSocial._id).subscribe(
			listAllRecommend =>{
				console.log(listAllRecommend['click'])
				this.ListClickRecommend = listAllRecommend['click'] as Book
				this.ListrateRecommend = listAllRecommend['rate'] as Book
				this.ListBuyRecommend = listAllRecommend['buy'] as Book
				
				if(this.ListClickRecommend.length>6)
				{
					this.IsClickRecommend=true
				}else{
					this.IsClickRecommend=false
				}

				if(this.ListrateRecommend.length>6)
				{
					this.IsRateRecommend=true
				}else{
					this.IsRateRecommend=false
				}

				if(this.ListBuyRecommend.length>6)
				{
					this.IsBuyRecommend=true
				}else{
					this.IsBuyRecommend=false
				}
			}
		)
	}
	script_Frontend() {
		this.customOptions = {
			loop: false,
			mouseDrag: false,
			touchDrag: false,
			pullDrag: false,
			dots: false,
			navSpeed: 700,
			nav: true,
			navText: ['<img src = "../../assets/img/02/Previous.png" />',
				'<img src = "../../assets/img/02/Next.png" id = "btnNavRight"/>'],
			navClass: ['owl-prev', 'owl-next'],
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
				},
				1100: {
					items: 6
				}
			}
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
	formatCurrency(number) {
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
		return n2.split('').reverse().join('') + 'VNĐ';
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
					if (Object.keys(Point).length == 0) {
						this.point.userID = this.accountSocial._id;
						this.point.point = 0;
						this._pointService.postPoint(this.point).subscribe(
							pointNew => {
								localStorage.setItem("Point", Object.values(pointNew)[0].point);
							}
						);
					} else {
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
	mergeCartBookAndCartBookDB(cartBookDB: Object) {
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


	//#region go To Book Detail
	clickGoToBookDetail(id) {
		return this._router.navigate(['/bookDetail/' + id]);
	}
	//#endregion
	//#region  Add Book Cart

	putCartBookDB(selectedBook: Book) {
		if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
			this.cartBookDB.userID = this.accountSocial._id;
			this.cartBookDB.bookID = selectedBook._id;
			this.cartBookDB.count = selectedBook.count;
			this._cartBookDBService.putCartBook(this.cartBookDB).subscribe(
				req => {
					console.log(req);
				},
				error => console.log(error)
			);
		}
	}
	// check count cart before add (hover )
	checkCountMax10 = true;
	checkCountCartBeforeAdd(selectedBook: Book) {
		this.checkCountMax10 = true;
		for (var i = 0; i < this.lengthCartBook; i++) {
			if (this.CartBook[i]._id == selectedBook._id) {
				//kiểm tra số lượng 
				if (this.CartBook[i].count == 10) {
					this.checkCountMax10 = false;
				}
				console.log(this.CartBook[i].count);
			}
		}
	}
	addABook = "";
	alertMessage = "";
	alertSucess = false;
	alertFalse = false;
	//add to cart (BookDetail,CountSelect)
	// số lượng tối đa chỉ được 10 mỗi quốn sách , tính luôn đã có trong giỏ

	checkedAddBook = true;
	addToCart(selectedBook: Book) {
		this.addABook = selectedBook.nameBook;
		var CartBook = [];    //lưu trữ bộ nhớ tạm cho localStorage "CartBook"
		var dem = 0;            //Vị trí thêm sách mới vào localStorage "CartBook" (nếu sách chưa tồn tại)
		var temp = 0;           // đánh dấu nếu đã tồn tại sách trong localStorage "CartBook" --> count ++
		// nếu localStorage "CartBook" không rỗng

		if (localStorage.getItem('CartBook') != null) {
			//chạy vòng lặp để lưu vào bộ nhớ tạm ( tạo mảng cho Object)

			for (var i = 0; i < JSON.parse(localStorage.getItem("CartBook")).length; i++) {
				CartBook[i] = JSON.parse(localStorage.getItem("CartBook"))[i];
				// nếu id book đã tồn tại trong  localStorage "CartBook" 
				if (CartBook[i]._id == selectedBook._id) {
					temp = 1;  //đặt biến temp
					// nếu số lượng tối đa chỉ được 10 mỗi quốn sách , tính luôn đã có trong giỏ thì oke
					if (parseInt(CartBook[i].count) + 1 <= 10) {
						CartBook[i].count = parseInt(CartBook[i].count) + 1;  //tăng giá trị count
						//cập nhật cartbook vào db
						this.putCartBookDB(CartBook[i]);
					}
					else {
						//show alert
						this.checkedAddBook = false;
						//update lại số lượng 


						this.alertMessage = "Đã tồn tại 10 quốn sách " + CartBook[i].nameBook + " trong giỏ hàng";
						this.alertFalse = true;
						setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
					}
				}
				dem++;  // đẩy vị trí gán tiếp theo
			}
		}

		if (temp != 1) {      // nếu sách chưa có ( temp =0 ) thì thêm sách vào
			selectedBook.count = 1;  // set count cho sách
			CartBook[dem] = selectedBook; // thêm sách vào vị trí "dem" ( vị trí cuối) 
			//lưu cartbook vào db
			this.postCartBookDB(selectedBook);
		}
		// đổ mảng vào localStorage "CartBook"
		localStorage.setItem("CartBook", JSON.stringify(CartBook));

		this.getTotalCountAndPrice();
		//  //show alert
		//  this.alertMessage="Thêm thành công sách "+ selectedBook.nameBook +" vào giỏ hàng";
		//  this.alertSucess=true;
		//  setTimeout(() => {this.alertMessage="";this.alertSucess=false}, 6000); 

	}
	//#endregion

	goToCartBook(){
		return this._router.navigate(['/cartBook']);
	}
}
