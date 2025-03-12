import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private authService: AuthService) {}

  sendOTP() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (res: { message: string; }) => this.message = res.message,
      error: (err: { error: { message: string; }; }) => this.message = err.error.message
    });
  }
}
