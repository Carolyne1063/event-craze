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
import { MyBookingsComponent } from './components/user-dashboard/my-bookings/my-bookings.component';
import { UserSettingsComponent } from './components/user-dashboard/user-settings/user-settings.component';
import { UserEventsComponent } from './components/user-dashboard/user-events/user-events.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotificationComponent } from './components/user-dashboard/notification/notification.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginRegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], 
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'events', component: EventsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'bookings', component: BookingsComponent },
            { path: 'settings', component: SettingsComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
        ]
    },

    { path: 'user-dashboard/:userId', component: UserDashboardComponent, canActivate: [AuthGuard], 
        children: [
          { path: 'notifications', component: NotificationComponent},
          { path: 'events', component: UserEventsComponent },
          { path: 'bookings', component: MyBookingsComponent },
          { path: 'settings', component: UserSettingsComponent },
          { path: '', redirectTo: 'events', pathMatch: 'full' } 
        ] 
      },      

    { path: '**', redirectTo: 'home', pathMatch: 'full'}
];
