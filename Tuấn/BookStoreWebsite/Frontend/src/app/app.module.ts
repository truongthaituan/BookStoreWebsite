import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BookCategoryComponent } from './book-category/book-category.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookCartComponent } from './book-cart/book-cart.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UpdateBookComponent } from './update-book/update-book.component';
import { InsertBookComponent } from './insert-book/insert-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutUsComponent } from './about-us/about-us.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { NpnSliderModule } from "npn-slider";
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'ng4-social-login';
import { UserService } from './app-services/user-service/user.service';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterByPipe } from './filter-by.pipe';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { BookCartCusInfoComponent } from './book-cart-cus-info/book-cart-cus-info.component';
import { BookCartPaymentComponent } from './book-cart-payment/book-cart-payment.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfileDetailEditComponent } from './profile-detail-edit/profile-detail-edit.component';
import { ProfileChangePasswordComponent } from './profile-change-password/profile-change-password.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('408043043727-jbb5t5muunapccidtp3vpbnrtq3b7sio.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('498895894399247')
  }
],false);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BookCategoryComponent,
    BookDetailComponent,
    MyAccountComponent,
    LostPasswordComponent,
    BookCartComponent,
    AdminPageComponent,
    UpdateBookComponent,
    InsertBookComponent,
    AboutUsComponent,
    JwPaginationComponent,
    FilterByPipe,
    AccountProfileComponent,
    OrderHistoryComponent,
    BookCartCusInfoComponent,
    BookCartPaymentComponent,
    ProfileDetailComponent,
    ProfileDetailEditComponent,
    ProfileChangePasswordComponent,
    ManageOrderComponent
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
     HttpClientModule,  
     CarouselModule,
     BrowserAnimationsModule,
      FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NpnSliderModule,
    SocialLoginModule,
    Ng2SearchPipeModule
  ],
  providers: [UserService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }],
  bootstrap: [AppComponent]
})

export class AppModule { }
