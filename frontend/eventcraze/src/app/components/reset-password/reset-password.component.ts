import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  newPassword: string = '';
  message: string = '';

  constructor(private authService: AuthService) {}

  resetPassword() {
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: (res: any) => this.message = "Password reset successful! Login with new password",
      error: (err: { error: { message: string; }; }) => this.message = err.error.message
    });
  }
}
