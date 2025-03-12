import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {
  email: string = '';
  otp: string = '';
  message: string = '';

  constructor(private authService: AuthService) {}

  verifyOtp() {
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (res: any) => this.message = "OTP Verified! Proceed to reset password",
      error: (err: { error: { message: string; }; }) => this.message = err.error.message
    });
  }
}
