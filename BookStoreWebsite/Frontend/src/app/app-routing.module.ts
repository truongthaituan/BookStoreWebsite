import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookCategoryComponent } from './book-category/book-category.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { BookCartComponent } from './book-cart/book-cart.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { InsertBookComponent } from './insert-book/insert-book.component';
import { UpdateBookComponent } from './update-book/update-book.component';
import { AboutUsComponent } from './about-us/about-us.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path: 'booksCategory',component: BookCategoryComponent},
  {path: 'bookDetail/:id',component: BookDetailComponent},
  {path: 'account',component: MyAccountComponent},
  {path: 'lostPassword',component: LostPasswordComponent},
  {path: 'cartBook',component: BookCartComponent},
  {path: 'adminPage',component: AdminPageComponent},
  {path: 'insertPage',component: InsertBookComponent},
  {path: 'updatePage',component: UpdateBookComponent},
  {path: 'aboutUs',component: AboutUsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
