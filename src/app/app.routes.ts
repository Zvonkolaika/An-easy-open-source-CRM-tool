import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { DealComponent } from './deal/deal.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route}
    { path: 'login', component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'user', component: UserComponent},
    { path: 'user/:id', component: UserDetailComponent},
    { path: 'deal', component: DealComponent},
    { path: 'deal/:id', component: DealDetailComponent},
    { path: 'contact', component: ContactComponent}, 
];
