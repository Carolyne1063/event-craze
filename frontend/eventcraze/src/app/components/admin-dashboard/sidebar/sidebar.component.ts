import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/userService';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  adminName: string = 'Admin'; // Default placeholder
  adminRole: string = 'Admin';
  adminId: string | null = '';
  profileImage: string = 'assets/default-profile.png'; // Default image

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.adminId = this.authService.getUserId();
    console.log('Admin ID:', this.adminId); // Debugging line
    if (this.adminId) {
      this.userService.getUser(this.adminId).subscribe(
        (user) => {
          console.log('Fetched User:', user); // Debugging line
          this.adminName = `${user.firstName} ${user.lastName}`;
          this.adminRole = user.role || 'Admin';
          this.profileImage = user.image || 'assets/default-profile.png';
        },
        (error) => {
          console.error('Error fetching admin details:', error);
        }
      );
    }
  }  

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
