import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $:any;         
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
   
  constructor(private _router: Router) { }

  ngOnInit() {
    this.doughnutChartLabels =  ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
    this.doughnutChartData = [120, 150, 180, 90];
    this.doughnutChartType = 'doughnut';
  }
 
  logout() {
    localStorage.clear();
    window.location.href = "/homePage";
  }

  moveToAdminProfile(){
    this._router.navigate(['/adminProfile']);
  }
}
