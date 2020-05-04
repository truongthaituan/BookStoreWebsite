import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPageComponent } from './views/admin/admin-page/admin-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NpnSliderModule } from "npn-slider";
import { ChartsModule } from 'ng2-charts';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'ng4-social-login';
import { UserService } from './app-services/user-service/user.service';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ManageOrderComponent } from './views/admin/manage-order/manage-order.component';
import { AuthInterceptorService } from './app-services/auth-service/auth-interceptor.service';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgxWheelModule } from 'ngx-wheel';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('408043043727-jbb5t5muunapccidtp3vpbnrtq3b7sio.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('498895894399247')
  }
], false);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    AdminPageComponent,
    ManageOrderComponent,
    CustomerLayoutComponent,
    AdminLayoutComponent   
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
    Ng2SearchPipeModule,
    ChartsModule,
    NgxWheelModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent]
})

export class AppModule { }
