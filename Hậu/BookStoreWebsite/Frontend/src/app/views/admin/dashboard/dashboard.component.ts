import { Component, OnInit } from '@angular/core';
declare var $:any;         
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
  constructor() { }

  ngOnInit() {
    $("#img1").click(function() { 
      var imageUrl = $(this).find("img").attr('src');
      $(".sidebar").css("background", "linear-gradient(rgba(192,192,192,0.3), rgba(171, 161, 247, 1)),url(" + imageUrl + ")");
  }); 
  $("#img2").click(function() { 
    var imageUrl = $(this).find("img").attr('src');
    $(".sidebar").css("background", "linear-gradient(rgba(192,192,192,0.3), rgba(171, 161, 247, 1)),url(" + imageUrl + ")");
  }); 
  $("#img3").click(function() { 
    var imageUrl = $(this).find("img").attr('src');
    $(".sidebar").css("background", "linear-gradient(rgba(192,192,192,0.3), rgba(171, 161, 247, 1)),url(" + imageUrl + ")");
  }); 
  $("#img4").click(function() { 
    var imageUrl = $(this).find("img").attr('src');
    $(".sidebar").css("background", "linear-gradient(rgba(192,192,192,0.3), rgba(171, 161, 247, 1)),url(" + imageUrl + ")");
  }); 
    this.doughnutChartLabels =  ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
    this.doughnutChartData = [120, 150, 180, 90];
    this.doughnutChartType = 'doughnut';
    $(document).ready(function() {
      $().ready(function() {
        var $sidebar = $('.sidebar');

        var $sidebar_img_container = $sidebar.find('.sidebar-background');

        var $full_page = $('.full-page');

        var $sidebar_responsive = $('body > .navbar-collapse');

        var window_width = $(window).width();

        var fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

        if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
          if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
            $('.fixed-plugin .dropdown').addClass('open');
          }

        }

        $('.fixed-plugin a').click(function(event) {
          // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if ($(this).hasClass('switch-trigger')) {
            if (event.stopPropagation) {
              event.stopPropagation();
            } else if (window.event) {
              window.event.cancelBubble = true;
            }
          }
        });
        var $full_page_background: any
        $('.fixed-plugin .active-color span').click(function() {
           $full_page_background = $('.full-page-background');

          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('color');

          if ($sidebar.length != 0) {
            $sidebar.attr('data-color', new_color);
          }

          if ($full_page.length != 0) {
            $full_page.attr('filter-color', new_color);
          }

          if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.attr('data-color', new_color);
          }
        });

        $('.fixed-plugin .background-color .badge').click(function() {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('background-color');

          if ($sidebar.length != 0) {
            $sidebar.attr('data-background-color', new_color);
          }
        });

        $('.fixed-plugin .img-holder').click(function() {
           $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');


          var new_image = $(this).find("img").attr('src');

          if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            $sidebar_img_container.fadeOut('fast', function() {
              $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
              $sidebar_img_container.fadeIn('fast');
            });
          }

          if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $full_page_background.fadeOut('fast', function() {
              $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
              $full_page_background.fadeIn('fast');
            });
          }

          if ($('.switch-sidebar-image input:checked').length == 0) {
            var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
          }

          if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
          }
        });

        $('.switch-sidebar-image input').change(function() {
           $full_page_background = $('.full-page-background');

         var $input = $(this);
          var background_image = false;
          if ($input.is(':checked')) {
            if ($sidebar_img_container.length != 0) {
              $sidebar_img_container.fadeIn('fast');
              $sidebar.attr('data-image', '#');
            }

            if ($full_page_background.length != 0) {
              $full_page_background.fadeIn('fast');
              $full_page.attr('data-image', '#');
            }

             background_image = true;
          } else {
            if ($sidebar_img_container.length != 0) {
              $sidebar.removeAttr('data-image');
              $sidebar_img_container.fadeOut('fast');
            }

            if ($full_page_background.length != 0) {
              $full_page.removeAttr('data-image', '#');
              $full_page_background.fadeOut('fast');
            }

            background_image = false;
          }
        });
      });
    });
  }

}
