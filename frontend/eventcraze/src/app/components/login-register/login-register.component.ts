import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
      phoneNo: ['', [Validators.required, Validators.pattern('^0\\d{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      image: [''] 
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    const user = this.registerForm.value;

     // Remove leading '0' before sending to the backend
  if (user.phoneNo.startsWith('0')) {
    user.phoneNo = user.phoneNo.slice(1); // Remove the first character
  }

    this.authService.register(user).subscribe({
      next: () => {
        this.successMessage = 'Registration Successful!';
        this.errorMessage = ''; 
        this.registerForm.reset(); 
        setTimeout(() => {
          this.successMessage = ''; 
          this.isLoginActive = true; 
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed!';
        this.successMessage = ''; 
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.successMessage = 'Login Successful!';
          this.errorMessage = ''; 
  
          setTimeout(() => {
            this.successMessage = ''; 
            const role = this.authService.getUserRole();
            const userId = this.authService.getUserId();   
            if (role === 'ADMIN') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate([`/user-dashboard/${userId}`]); 
            }
          }, 2000); 
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Invalid email or password!';
          this.successMessage = ''; 
        }
      });
    }
  } 

  toggleForm(): void {
    this.isLoginActive = !this.isLoginActive;
    this.errorMessage = ''; 
  }
}