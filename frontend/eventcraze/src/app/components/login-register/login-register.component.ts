import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  showPassword: boolean = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      console.log('Registration Successful', this.registerForm.value);
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      console.log('Login Successful', this.loginForm.value);
    }
  }

  toggleForm(): void {
    this.isLoginActive = !this.isLoginActive;
  }

}