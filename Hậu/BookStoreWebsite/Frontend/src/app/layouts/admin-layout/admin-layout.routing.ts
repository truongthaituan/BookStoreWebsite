import { Routes } from '@angular/router';

import { DashboardComponent } from '../../views/admin/dashboard/dashboard.component';
import { AdminProfileComponent } from 'src/app/views/admin/admin-profile/admin-profile.component';
import { AdminProfileEditComponent } from 'src/app/views/admin/admin-profile-edit/admin-profile-edit.component';
import { AdminChangePasswordComponent } from 'src/app/views/admin/admin-change-password/admin-change-password.component';
import { AdminManageBookComponent } from 'src/app/views/admin/admin-manage-book/admin-manage-book.component';
import { InsertBookComponent } from 'src/app/views/admin/insert-book/insert-book.component';
import { AdminBookDetailsComponent } from 'src/app/views/admin/admin-book-details/admin-book-details.component';
import { UpdateBookComponent } from 'src/app/views/admin/update-book/update-book.component';
// import { UserProfileComponent } from '../../user-profile/user-profile.component';
// import { TableListComponent } from '../../table-list/table-list.component';
// import { TypographyComponent } from '../../typography/typography.component';
// import { IconsComponent } from '../../icons/icons.component';
// import { MapsComponent } from '../../maps/maps.component';
// import { NotificationsComponent } from '../../notifications/notifications.component';
// import { UpgradeComponent } from '../../upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'adminProfile',   component: AdminProfileComponent },
    { path: 'adminProfileEdit/:id', component: AdminProfileEditComponent },
    { path: 'adminChangePassword/:id',     component: AdminChangePasswordComponent },
    { path: 'manageBook',     component: AdminManageBookComponent },
    {path: 'insertBook',component: InsertBookComponent},
    { path: 'bookDetails/:id',          component: AdminBookDetailsComponent },
    { path: 'updateBook/:id',           component: UpdateBookComponent }
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent }
];
