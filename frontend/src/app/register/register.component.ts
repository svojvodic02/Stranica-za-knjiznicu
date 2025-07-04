import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone:false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', password: '', name: '', email: '' }; 
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { } 

  register() {
    this.errorMessage = null;
    
    this.authService.register(this.user).subscribe(
      (res: any) => {
        console.log('Registration successful:', res);
        this.router.navigate(['/login']); 
      },
      (error: HttpErrorResponse) => {
      if (error.status === 409) {
        this.errorMessage = 'Korisničko ime je već zauzeto.';
      } else if (error.status === 400) {
        this.errorMessage = error.error?.error || 'Neispravni podaci. Provjerite unesene informacije.';
      } else {
        this.errorMessage = 'Došlo je do greške. Pokušajte ponovo.';
      }
      console.error('Registration error:', error);
    }
  );
  }
}