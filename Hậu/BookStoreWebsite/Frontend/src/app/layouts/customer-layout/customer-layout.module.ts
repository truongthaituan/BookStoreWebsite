import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerLayoutRoutes } from './customer-layout.routing';
import { HomeComponent } from 'src/app/views/customer/home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NpnSliderModule } from "npn-slider";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BookCategoryComponent } from 'src/app/views/customer/book-category/book-category.component';
import { BookDetailComponent } from 'src/app/views/customer/book-detail/book-detail.component';
import { MyAccountComponent } from 'src/app/auth/my-account/my-account.component';
import { LostPasswordComponent } from 'src/app/views/customer/lost-password/lost-password.component';
import { BookCartComponent } from 'src/app/views/customer/book-cart/book-cart.component';
import { AboutUsComponent } from 'src/app/views/customer/about-us/about-us.component';
import { ProfileDetailComponent } from 'src/app/views/customer/profile-detail/profile-detail.component';
import { AccountProfileComponent } from 'src/app/views/customer/account-profile/account-profile.component';
import { OrderHistoryComponent } from 'src/app/views/customer/order-history/order-history.component';
import { BookCartCusInfoComponent } from 'src/app/views/customer/book-cart-cus-info/book-cart-cus-info.component';
import { BookCartPaymentComponent } from 'src/app/views/customer/book-cart-payment/book-cart-payment.component';
import { ProfileDetailEditComponent } from 'src/app/views/customer/profile-detail-edit/profile-detail-edit.component';
import { ProfileChangePasswordComponent } from 'src/app/views/customer/profile-change-password/profile-change-password.component';
import { ProfileAccountSocialComponent } from 'src/app/views/customer/profile-account-social/profile-account-social.component';
import { DiscountCodeComponent } from 'src/app/views/customer/discount-code/discount-code.component';
import { AgmCoreModule } from '@agm/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmDirectionModule } from 'agm-direction'; 
import { SafePipeModule } from 'safe-pipe';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
  imports: [
    SafePipeModule,
    CommonModule,
    RouterModule.forChild(CustomerLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NpnSliderModule,
    CarouselModule,
    NgxImageZoomModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBQ0quGzcr4DdR5kip1FaZudNOzAGQ0xmc',
      libraries: ['places']
    }),
    AgmDirectionModule
    ],
  declarations: [
    HomeComponent,
    BookCategoryComponent,
    BookDetailComponent,
    MyAccountComponent,
    LostPasswordComponent,
    BookCartComponent,
    AboutUsComponent,
    ProfileDetailComponent,
    AccountProfileComponent,
    OrderHistoryComponent,
    BookCartCusInfoComponent,
    BookCartPaymentComponent,
    ProfileDetailEditComponent,
    ProfileChangePasswordComponent,
    ProfileAccountSocialComponent,
    DiscountCodeComponent
  ]
})

export class CustomerLayoutModule {}
