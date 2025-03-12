import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoginActive: boolean = true;
  errorMessage: string = '';
  successMessage: string | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNo: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      image: [''] // Added image field
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    const user = this.registerForm.value;

    this.authService.register(user).subscribe({
      next: () => {
        this.successMessage = 'Registration Successful!';
        this.errorMessage = ''; // Clear errors
        this.registerForm.reset(); // Reset form
        setTimeout(() => {
          this.successMessage = ''; // Hide message
          this.isLoginActive = true; // Switch to login form
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed!';
        this.successMessage = ''; // Clear success message
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.successMessage = 'Login Successful!';
          this.errorMessage = ''; // Clear errors
  
          setTimeout(() => {
            this.successMessage = ''; // Hide message before redirect
            const role = this.authService.getUserRole();
            const userId = this.authService.getUserId(); // Fix: Fetch userId correctly  
            if (role === 'ADMIN') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate([`/user-dashboard/${userId}`]); // Redirect to user-specific dashboard
            }
          }, 2000); // Delay redirection
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Invalid email or password!';
          this.successMessage = ''; // Clear success message
        }
      });
    }
  } 

  toggleForm(): void {
    this.isLoginActive = !this.isLoginActive;
    this.errorMessage = ''; // Clear error message when switching forms
  }
}