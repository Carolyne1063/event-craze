import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; 

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userRole', response.role); 
        localStorage.setItem('username', response.firstName); 
      })
    );
  }
  
  getUsername(): string | null {
    return localStorage.getItem('firstName');
  }  
  
  // getUser(userId: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/${userId}`);
  // }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }  

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

 // 1️⃣ Send OTP
 sendOTP(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, { email });
}

// 2️⃣ Verify OTP
verifyOTP(email: string, otp: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
}

// 3️⃣ Reset Password
resetPassword(email: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, { email, newPassword });
}
  
}
