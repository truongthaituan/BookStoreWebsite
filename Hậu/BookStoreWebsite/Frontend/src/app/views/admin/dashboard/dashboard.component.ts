import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatisticService } from 'src/app/app-services/statistic-service/statistic.service';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { SocialaccountService } from 'src/app/app-services/socialAccount-service/socialaccount.service';
declare var $:any;       
class TotalMonth{
  yearCheck: string;
  monthCheck: string;
}  
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy = localStorage.getItem('loginBy');

  //Doughnut Chart
   doughnutChartLabels : Array<string>;
   doughnutChartType: string = ''
   doughnutChartData: Array<number>;
  //Bar Chart
    barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

   barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
   barChartType = 'bar';
   barChartLegend = true;

   barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
  //Radar chart
   radarChartLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
   radarChartData = [
    {data: [120, 130, 180, 70], label: '2017'},
    {data: [90, 150, 200, 45], label: '2018'}
  ];
   radarChartType = 'radar';

 
  constructor(private _router: Router, private statisticService: StatisticService,
     private userService: UserService, private accountSocialService: SocialaccountService) { }

    ngOnInit() {
    this.doughnutChartLabels =  ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
    this.doughnutChartData = [120, 150, 180, 90];
    this.doughnutChartType = 'doughnut';
    $('#field_month').addClass("readonly-wrapper");
    $('#select_month').addClass("readonly-block");
    $("#month").on('change',function(){
      if($("#month").is(':checked')){
        $('#field_month').removeClass("readonly-wrapper");
        $('#select_month').removeClass("readonly-block");
      }
      else{
        $('#field_month').addClass("readonly-wrapper");
          $('#select_month').addClass("readonly-block");
      }
  });
    // if($('input[name=month]:checked').length > 0){
    //   alert(1)
    // }else{
    //   $('#field_month').addClass("readonly-wrapper");
    //   $('#select_month').addClass("readonly-block");
    // }
    this.statisticService.TotalPriceOnYear(2016).subscribe(total => {
      console.log(total)
      this.totalYear = total
    }) 
    this.statisticService.BestUserOnYear(2016).subscribe(total => {
      console.log(total)
      this.bestUser = total
      this.totalYearOfCustomer =  this.bestUser.totalPrice
      if(this.bestUser.userID == 'not found'){
        this.bestUserName = ""
      }else{
        this.userService.getUserById(this.bestUser.userID).subscribe(res => {
          console.log(res)
          this.bestUserShow = res
          this.bestUserName = this.bestUserShow.username
        })
      }
    })
  }
  totalYear: any = 0.0
  bestUser: any
  bestUserShow: any
  bestUserName : any
  totalYearOfCustomer: any = 0.0
  onYear: boolean = false;
  onMonth: boolean = false;
  selectedYear: any
  selectedMonth: any
  changeYear(year){
    this.onYear = true;
    // alert("selected --->"+year);
    this.selectedYear = year
    this.statisticService.TotalPriceOnYear(year).subscribe(total => {
      this.totalYear = total
     
    })

    this.statisticService.BestUserOnYear(year).subscribe(total => {
      this.bestUser = total
      this.totalYearOfCustomer =  this.bestUser.totalPrice
      if(this.bestUser.userID == 'not found'){
        this.bestUserName = ""
      }else{
        this.userService.getUserById(this.bestUser.userID).subscribe(res => {
          console.log(res)
          this.bestUserShow = res
          this.bestUserName = this.bestUserShow.username
        })
         this.accountSocialService.getUserByID(this.bestUser.userID).subscribe(res => {
              console.log(res)
              this.bestUserShow = res
              this.bestUserName = this.bestUserShow.username
            })
      }
    })
  }
  checkValue(event: any){
    console.log(event)
    if(event == true){
      this.onMonth = true  
      this.statisticService.TotalPriceOnMonth(this.totalMonth).subscribe(total => {
        console.log(total)
        this.totalYear = total
      }) 
      this.statisticService.BestUserOnMonth(this.totalMonth).subscribe(total => {
        console.log(total)
        this.bestUser = total
        this.totalYearOfCustomer =  this.bestUser.totalPrice
        if(this.bestUser.userID == 'not found'){
          this.bestUserName = ""
        }else{
          this.userService.getUserById(this.bestUser.userID).subscribe(res => {
            console.log(res)
            this.bestUserShow = res
            this.bestUserName = this.bestUserShow.username
          })
           this.accountSocialService.getUserByID(this.bestUser.userID).subscribe(res => {
                console.log(res)
                this.bestUserShow = res
                this.bestUserName = this.bestUserShow.username
              })
        }
      })
    }else{
      this.onMonth = false
      this.statisticService.TotalPriceOnYear(this.selectedYear).subscribe(total => {
        console.log(total)
        this.totalYear = total
      })
      this.statisticService.BestUserOnYear(this.selectedYear).subscribe(total => {
        console.log(total)
        this.bestUser = total
         this.totalYearOfCustomer =  this.bestUser.totalPrice
         if(this.bestUser.userID == 'not found'){
          this.bestUserName = ""
        }else{
          this.userService.getUserById(this.bestUser.userID).subscribe(res => {
            console.log(res)
            this.bestUserShow = res
            this.bestUserName = this.bestUserShow.username
          })
           this.accountSocialService.getUserByID(this.bestUser.userID).subscribe(res => {
                console.log(res)
                this.bestUserShow = res
                this.bestUserName = this.bestUserShow.username
              })
        }
      })
    }
 }
 totalMonth: TotalMonth = new TotalMonth();
  changeMonth(month){
    // alert("selected --->"+year);
    console.log(this.selectedYear)
    this.totalMonth.yearCheck = this.selectedYear
    this.totalMonth.monthCheck = month
    //TotalMonth include yearCheck and monthCheck
    this.statisticService.TotalPriceOnMonth(this.totalMonth).subscribe(total => {
      console.log(total)
      this.totalYear = total
    })
    this.statisticService.BestUserOnMonth(this.totalMonth).subscribe(total => {
      this.bestUser = total
      this.totalYearOfCustomer =  this.bestUser.totalPrice
      if(this.bestUser.userID == 'not found'){
        this.bestUserName = ""
      }else{
        this.userService.getUserById(this.bestUser.userID).subscribe(res => {
          console.log(res)
          this.bestUserShow = res
          this.bestUserName = this.bestUserShow.username
        })
         this.accountSocialService.getUserByID(this.bestUser.userID).subscribe(res => {
              console.log(res)
              this.bestUserShow = res
              this.bestUserName = this.bestUserShow.username
            })
      }
    })
  }

  moveToAdminProfile(){
    this._router.navigate(['/adminProfile']);
  }

}
