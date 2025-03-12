import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { UserService } from '../../../services/userService';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  userName: string = 'User Name'; // Default placeholder
  userRole: string = 'User'; // Default role
  profileImage: string = ''; // Default image (empty for now)

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    const userId = this.authService.getUserId(); // Get the logged-in user's ID

    if (userId) {
      this.userService.getUser(userId).subscribe({
        next: (user) => {
          this.userName = `${user.firstName} ${user.lastName}`; // Full name
          this.profileImage = user.image || 'assets/default-profile.png'; // Use default if no image
          this.userRole = user.role || 'User'; // Default to 'User' if no role is set
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
