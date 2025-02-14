import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginRegisterComponent},
    { path: 'admin', component: AdminDashboardComponent},
    { path: 'user', component: UserDashboardComponent},
    { path: '**', redirectTo: 'home' }

];
