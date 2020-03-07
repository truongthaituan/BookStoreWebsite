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
    JwPaginationComponent
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
     HttpClientModule,  
     CarouselModule,
     BrowserAnimationsModule,
      FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
