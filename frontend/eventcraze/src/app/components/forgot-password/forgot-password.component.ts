import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  step: number = 1; // 1 = Send OTP, 2 = Verify OTP, 3 = Reset Password
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  message: string = '';

  constructor(private authService: AuthService) {}

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
        this.message = "Password reset successful! Redirecting to login...";
        setTimeout(() => window.location.href = '/login', 2000); // Redirect after 2 seconds
      },
      error: (err) => this.message = err.error.message || "Failed to reset password"
    });
  }
  }

