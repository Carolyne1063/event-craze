import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/userService';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
})
export class UserSettingsComponent implements OnInit {
  userId: string | null = null; 

  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    imageUrl: '',
  };

  tabs = [
    { key: 'profile', label: 'My Profile' },
    { key: 'edit', label: 'Edit Profile' },
    { key: 'reset', label: 'Reset Password' },
  ];

  selectedTab = 'profile';

  passwords = {
    current: '',
    new: '',
    confirm: '',
  };

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); 
  
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }
  
    this.userService.getUser(this.userId).subscribe(
      (data) => {
        this.user = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phoneNo, 
          role: data.role,
          imageUrl: data.image 
        };
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  updateProfile() {
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }
  
    const updatedUser = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNo: this.user.phone, 
      role: this.user.role,
      image: this.user.imageUrl, 
    };
  
    this.userService.updateUser(this.userId, updatedUser).subscribe(
      () => {
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }  
  
  step: number = 1; // 1 = Send OTP, 2 = Verify OTP, 3 = Reset Password
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  message: string = '';

  sendOTP() {
    this.authService.sendOTP(this.email).subscribe({
      next: () => {
        this.message = "OTP sent to your email!";
        this.step = 2; // Move to Verify OTP step
      },
      error: (err) => this.message = err.error.message || "Failed to send OTP"
    });
  }

  verifyOtp() {
    this.authService.verifyOTP(this.email, this.otp).subscribe({
      next: () => {
        this.message = "OTP verified! Enter your new password.";
        this.step = 3; // Move to Reset Password step
      },
      error: (err) => this.message = err.error.message || "Invalid OTP"
    });
  }

  resetPassword() {
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.message = "Password reset successful! you will be needed to login again with your new password.Redirecting to login...";
        setTimeout(() => window.location.href = '/login', 2000); // Redirect after 2 seconds
      },
      error: (err) => this.message = err.error.message || "Failed to reset password"
    });
  }
}