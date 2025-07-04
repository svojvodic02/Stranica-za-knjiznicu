import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  standalone: false
})
export class AdminPageComponent implements OnInit {
  users: any[] = [];
  genres: any[] = [];

  editableUser: any = {};
  editingUserId: number | null = null;

  editableGenre: any = {};
  editingGenreId: number | null = null;

  newGenre: string = '';

  constructor(private http: HttpClient,  private authService: AuthService, private router: Router,) {}

  ngOnInit(): void {
     this.fetchUsers();
  this.fetchGenres();
  }

  fetchUsers() {
  this.http.get<any[]>('/api/users').subscribe(data => this.users = data);
}

fetchGenres() {
  this.http.get<any[]>('/api/genres').subscribe(data => this.genres = data);
}

editUser(user: any) {
  this.editingUserId = user.id;
  this.editableUser = { ...user };
}

cancelUserEdit() {
  this.editingUserId = null;
  this.editableUser = {};
}

saveUser(id: number) {
  this.http.put(`/api/users/${id}`, this.editableUser).subscribe(() => {
    this.fetchUsers();
    this.cancelUserEdit();
  });
}

deleteUser(id: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    this.http.delete(`/api/users/${id}`).subscribe(() => this.fetchUsers());
  }
}

editGenre(genre: any) {
  this.editingGenreId = genre.id;
  this.editableGenre = { ...genre };
}

cancelGenreEdit() {
  this.editingGenreId = null;
  this.editableGenre = {};
}

addGenre() {
  if (!this.newGenre.trim()) return;

  this.http.post('/api/genres', { name: this.newGenre }).subscribe(() => {
    this.newGenre = '';
    this.fetchGenres();
  });
}

saveGenre(id: number) {
  this.http.put(`/api/genres/${id}`, this.editableGenre).subscribe(() => {
    this.fetchGenres();
    this.cancelGenreEdit();
  });
}

deleteGenre(id: number) {
  if (confirm('Are you sure you want to delete this genre?')) {
    this.http.delete(`/api/genres/${id}`).subscribe(() => this.fetchGenres());
  }
}

 goToBooks() {
    this.router.navigate(['/book']);
  }

  logout() {
    this.authService.logout(); 
  }
  goToProfile() {
  const userId = this.authService.getUserId();
  if (userId) {
    this.router.navigate(['/profile', userId]);
  } else {
    alert('You need to login first');
  }
}

}
