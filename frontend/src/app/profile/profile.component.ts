import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
type Book = { ID: number, title: string, author: string, genreId: number,available: number,userId: number ,username?: string };

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId!: number;
  borrowedBooks: Book[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
      private router: Router      
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? +idParam : 0;
    this.loadUserProfile(this.userId);
    this.loadBorrowedBooks();
  }


  profile: any = null; 

loadUserProfile(id: number) {
  this.http.get(`/api/users/${id}`).subscribe({
    next: (data) => this.profile = data,
    error: (err) => console.error(err)
  });
}

updateProfile() {
  this.http.put(`/api/users/${this.userId}`, this.profile).subscribe({
    next: () => alert('Profile updated!'),
    error: (err) => alert(err.error?.error || 'Update failed')
  });
}

  loadBorrowedBooks() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.http.get<Book[]>('/api/borrowings/' + userId).subscribe(data => {
      console.log('Borrowed books:', data);
      this.borrowedBooks = data;
    });
  }

   goToBooks() {
    this.router.navigate(['/book']);
  }

  logout() {
    this.authService.logout(); 
  }


unborrowBook(bookId: number) {
  const userId = this.authService.getUserId();
  if (!userId) {
    alert('You need to login first');
    return;
  }

  this.http.post('/api/unborrow', { bookID: bookId, userID: userId }).subscribe({
    next: () => {
      alert('Book unborrowed!');
      this.loadBorrowedBooks();
    },
    error: (err) => {
      alert(err.error?.error || 'Failed to unborrow the book');
    }
  });
}
}


