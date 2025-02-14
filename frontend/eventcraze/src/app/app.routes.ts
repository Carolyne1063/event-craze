import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginRegisterComponent},
    { path: '**', redirectTo: 'home' }

];
