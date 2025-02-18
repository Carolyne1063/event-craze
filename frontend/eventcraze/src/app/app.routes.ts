import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './components/admin-dashboard/dashboard/dashboard.component';
import { EventsComponent } from './components/admin-dashboard/events/events.component';
import { UsersComponent } from './components/admin-dashboard/users/users.component';
import { BookingsComponent } from './components/admin-dashboard/bookings/bookings.component';
import { SettingsComponent } from './components/admin-dashboard/settings/settings.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginRegisterComponent},
    { path: 'admin', component: AdminDashboardComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'events', component: EventsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'bookings', component: BookingsComponent },
            { path: 'settings', component: SettingsComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
        ]
    },
    { path: 'user', component: UserDashboardComponent},
    { path: '**', redirectTo: 'home' }

];
