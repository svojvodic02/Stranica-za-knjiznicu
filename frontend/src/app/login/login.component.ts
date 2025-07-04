import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false,
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('authToken', res.token);
        const decodedToken: any = jwtDecode(res.token);
        localStorage.setItem('userId', decodedToken.userId);

        if (res?.isAdmin !== undefined) {
        localStorage.setItem('isAdmin', res.isAdmin.toString());
        }
        this.errorMessage = '';
        this.router.navigate(['/book']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.errorMessage = 'Korisničko ime ne postoji.';
        } else if (err.status === 401) {
          this.errorMessage = 'Pogrešna lozinka.';
        } else {
          this.errorMessage = 'Greška prilikom prijave. Pokušajte ponovo.';
        }
      }
    });
  }

  showPassword: boolean = false;

togglePassword(): void {
  this.showPassword = !this.showPassword;
}

}
