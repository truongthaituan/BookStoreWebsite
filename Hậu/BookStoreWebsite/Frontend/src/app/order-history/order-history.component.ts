import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.script_Frontend();
  }
  script_Frontend(){
    $('#future-orders').css('display','none');

    $('#toggle-orders li').click(function () {
        $('#toggle-orders li').not(this).removeClass('selected');
        $(this).addClass('selected');
    });


    $('.fo').click(function () {
        $('#order-history').hide();
        $('#future-orders').fadeIn('fast');
    });

    $('.oh').click(function () {
        $('#order-history').fadeIn('fast');
        $('#future-orders').hide();
    });
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
  }

}
