import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { UserService } from '../../../services/userService';
import { NotificationService } from '../../../services/notificationService';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  userName: string = 'User Name'; 
  userRole: string = 'User'; 
  profileImage: string = ''; 
  unreadCount: number = 0;

  constructor(private authService: AuthService, private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit() {

    const userId = this.authService.getUserId(); 

    if (userId) {
      this.userService.getUser(userId).subscribe({
        next: (user) => {
          this.userName = `${user.firstName} ${user.lastName}`; 
          this.profileImage = user.image || 'assets/default-profile.png'; 
          this.userRole = user.role || 'User'; 
        },
        error: (err) => {
          console.error('Failed to fetch user data:', err);
        }
      });
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
