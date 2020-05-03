import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from './views/customer/home/home.component';
import { BookCategoryComponent } from './views/customer/book-category/book-category.component';
import { BookDetailComponent } from './views/customer/book-detail/book-detail.component';
import { MyAccountComponent } from './auth/my-account/my-account.component';
import { LostPasswordComponent } from './views/customer/lost-password/lost-password.component';
import { BookCartComponent } from './views/customer/book-cart/book-cart.component';
import { AdminPageComponent } from './views/admin/admin-page/admin-page.component';
import { InsertBookComponent } from './views/admin/insert-book/insert-book.component';
import { UpdateBookComponent } from './views/admin/update-book/update-book.component';
import { AboutUsComponent } from './views/customer/about-us/about-us.component';
import { AccountProfileComponent } from './views/customer/account-profile/account-profile.component';
import { OrderHistoryComponent } from './views/customer/order-history/order-history.component';
import { BookCartCusInfoComponent } from './views/customer/book-cart-cus-info/book-cart-cus-info.component';
import { BookCartPaymentComponent } from './views/customer/book-cart-payment/book-cart-payment.component';
import { ProfileDetailComponent } from './views/customer/profile-detail/profile-detail.component';
import { ProfileDetailEditComponent } from './views/customer/profile-detail-edit/profile-detail-edit.component';
import { ProfileChangePasswordComponent } from './views/customer/profile-change-password/profile-change-password.component';
import { ManageOrderComponent } from './views/admin/manage-order/manage-order.component';
import { ProfileAccountSocialComponent } from './views/customer/profile-account-social/profile-account-social.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  // {path:'', component: HomeComponent},
  // {path: 'adminPage',component: AdminPageComponent},
  // {path: 'updatePage/:id',component: UpdateBookComponent},
  // {path: 'profile', component: AccountProfileComponent},
  // {path: 'accountProfile', component: ProfileDetailComponent},
  // {path: 'accountProfileSocial', component: ProfileAccountSocialComponent},
  // {path: 'accountProfileEdit/:id', component: ProfileDetailEditComponent},
  // {path: 'changePassword/:id', component: ProfileChangePasswordComponent},
  // {path: 'orderHistory',component: OrderHistoryComponent},
  // {path: 'shipping',component:BookCartCusInfoComponent},
  // {path:'payment/:customer_id',component:BookCartPaymentComponent},
  // {path:'manageOrder',component:ManageOrderComponent},
  {
    path: '',
    redirectTo: 'homePage',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/customer-layout/customer-layout.module#CustomerLayoutModule'
    }]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  }
];

@NgModule({
  imports: [ CommonModule,
    BrowserModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
