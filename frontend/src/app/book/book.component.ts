import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
type Book = { id: number, title: string, author: string, genreId: number,available: number,userId: number ,username?: string };
type Genre = { id: number; name: string };

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  genres: Genre[] = [];
  books: Book[] = [];
  isAdmin = false;
  currentUsername = localStorage.getItem('loggedInUser'); 
  broj_komentara = 0;
  newBook: Book = {
    id: 0,
    title: '',
    author:'',
    genreId:0,
    available: 1 ,
    userId: 0,
  };
  editingIndex: number | null = null;
  editingBook: Book = {   id: 0,title: '',author:'',genreId:0, available: 1,userId: 0 };
  adding = true;

  private baseUrl: string = 'http://localhost:5000/api'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getBooks();  
    this.getGenres();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
  }

 getBooks() {
  this.http.get<any[]>(`${this.baseUrl}/book`).subscribe((data) => {
    this.books = data.map(book => ({
      ...book,
      id: book.id || book.ID  
    }));
    this.broj_komentara = this.books.length;
  });
}

  getGenres() {
  
  this.http.get<Genre[]>(`${this.baseUrl}/genres`).subscribe({
    next: (data) => {
      this.genres = data;
    },
    error: (err) => {
      console.log('Using fallback genres');
      
      this.genres = [
        { id: 1, name: 'Fiction' },
        { id: 2, name: 'Non-fiction' },
        { id: 3, name: 'Mystery' },
        { id: 4, name: 'Science' }
      ];
    }
  });
}

  getGenreName(genreId: number): string {
  const genre = this.genres.find(g => g.id === genreId);
  return genre ? genre.name : 'Unknown Genre';
}


  add() {
    const userId = this.authService.getUserId();
    const genreId= 1
    if (!userId) {
      alert('You need to log in to add a book.');
      return;
    }

    const newBook = {
      userId: userId, 
      title: this.newBook.title,
      author:this.newBook.author,
       genreId: genreId,
      available: this.newBook.available ? 1 : 0,
    };

     if (!newBook.title) {
    alert('Book title is required');
    return;
  }
  if (!newBook.author) {
    alert('Author name is required');
    return;
  }
  if (newBook.genreId <= 0) {
    alert('Please select a valid genre');
    return;
  }

    this.http.post(`${this.baseUrl}/book`, newBook).subscribe(() => {
      this.getBooks(); 
    });

    this.newBook = {  id: 0,title: '',author:'',genreId:0, available: 1,userId: 0 }; 
  }

  edit(index: number) {
    const bookToEdit = this.books[index];
    if (this.currentUsername === bookToEdit.username) {
      this.editingBook = { ...bookToEdit };
      this.editingIndex = index;
    } else {
      alert('You can only edit your own books.');
    }
  }

 doneEditing(index: number) {
  const bookToEdit = this.books[index];

  if (this.currentUsername !== bookToEdit.username) {
    alert('You can only edit your own books.');
    this.editingIndex = null;
    return;
  }

  const updatedBook = {
    title: this.editingBook.title,
    author: this.editingBook.author,
    genreId: this.editingBook.genreId,
    available: this.editingBook.available,
    userId: bookToEdit.userId  
  };

  this.http.put(`${this.baseUrl}/book/${bookToEdit.id}`, updatedBook).subscribe(() => {
    this.getBooks();
    this.editingIndex = null;
  });
}

 deleteBook(index: number) {
  const book = this.books[index];
  console.log('Attempting to delete:', book);  

  if (!book || !book.id) {
    console.error('Invalid book or missing ID');
    return;
  }

  if (this.currentUsername === book.username) {
    this.http.request('delete', `${this.baseUrl}/book/${book.id}`, {
      body: { userId: book.userId }
    }).subscribe(() => {
      this.getBooks();
    }, error => {
      console.error('Delete failed:', error);
    });
  } else {
    alert('You can only delete your own books.');
  }
}

borrowBook(bookId: number) {
  const userId = this.authService.getUserId();
  if (!userId) {
    alert('You need to login first');
    return;
  }

  this.http.post('/api/borrow', { bookID: bookId, userID: userId }).subscribe({
    next: () => {
      alert('Book borrowed!');
      this.getBooks(); 
    },
    error: (err) => {
      alert(err.error.error || 'Failed to borrow book');
    }
  });
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