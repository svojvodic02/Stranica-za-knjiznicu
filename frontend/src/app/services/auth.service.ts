import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any) {
  return this.http.post('/api/login', credentials);
}
  
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null; 
  }
  logout() {
    localStorage.removeItem(this.tokenKey); 
    localStorage.removeItem('userId'); 
    this.router.navigate(['/login']); 
  }
  register(user: any) {
    return this.http.post('/api/register', user);
  }

  getIsAdmin(): boolean {
  return localStorage.getItem('isAdmin') === 'true';
}
}