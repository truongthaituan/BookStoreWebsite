import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/views/customer/home/home.component';
import { BookCategoryComponent } from 'src/app/views/customer/book-category/book-category.component';
import { BookDetailComponent } from 'src/app/views/customer/book-detail/book-detail.component';
import { MyAccountComponent } from 'src/app/auth/my-account/my-account.component';
import { LostPasswordComponent } from 'src/app/views/customer/lost-password/lost-password.component';
import { BookCartComponent } from 'src/app/views/customer/book-cart/book-cart.component';
import { AboutUsComponent } from 'src/app/views/customer/about-us/about-us.component';
import { AccountProfileComponent } from 'src/app/views/customer/account-profile/account-profile.component';
import { OrderHistoryComponent } from 'src/app/views/customer/order-history/order-history.component';
import { BookCartCusInfoComponent } from 'src/app/views/customer/book-cart-cus-info/book-cart-cus-info.component';
import { BookCartPaymentComponent } from 'src/app/views/customer/book-cart-payment/book-cart-payment.component';
import { ProfileDetailComponent } from 'src/app/views/customer/profile-detail/profile-detail.component';
import { ProfileDetailEditComponent } from 'src/app/views/customer/profile-detail-edit/profile-detail-edit.component';
import { ProfileChangePasswordComponent } from 'src/app/views/customer/profile-change-password/profile-change-password.component';
import { ManageOrderComponent } from 'src/app/views/admin/manage-order/manage-order.component';
import { ProfileAccountSocialComponent } from 'src/app/views/customer/profile-account-social/profile-account-social.component';
export const CustomerLayoutRoutes: Routes = [
    { path: 'homePage', component: HomeComponent },
    { path: 'booksCategory', component: BookCategoryComponent },
    { path: 'bookDetail/:id', component: BookDetailComponent },
    { path: 'account', component: MyAccountComponent },
    { path: 'lostPassword', component: LostPasswordComponent },
    { path: 'cartBook', component: BookCartComponent },
    { path: 'aboutUs', component: AboutUsComponent },
    { path: 'accountProfile', component: ProfileDetailComponent },
    { path: 'accountProfileSocial', component: ProfileAccountSocialComponent },
    { path: 'accountProfileEdit/:id', component: ProfileDetailEditComponent },
    { path: 'changePassword/:id', component: ProfileChangePasswordComponent },
    { path: 'orderHistory', component: OrderHistoryComponent },
    { path: 'shipping', component: BookCartCusInfoComponent },
    { path: 'payment/:customer_id', component: BookCartPaymentComponent },
    // { path: 'manageOrder', component: ManageOrderComponent },
    { path: 'profile', component: AccountProfileComponent }

];
