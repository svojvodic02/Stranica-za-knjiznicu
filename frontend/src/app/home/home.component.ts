import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
type Post = { id: number, userId: number, comment: string, timestamp: string, username?: string };

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[] = [];
  currentUsername = localStorage.getItem('loggedInUser'); 
  broj_komentara = 0;
  newPost: Post = {
    id: 0,
    userId: 0,
    comment: '',
    timestamp: ''
  };
  editingIndex: number | null = null;
  editingPost: Post = { id: 0, userId: 0, comment: '', timestamp: '' };
  adding = true;

  private baseUrl: string = 'http://localhost:5000/api'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getPosts();  
  }

  getPosts() {
    this.http.get<Post[]>(`${this.baseUrl}/posts`).subscribe((data) => {
      this.posts = data;
      this.broj_komentara = this.posts.length;
    });
  }

  add() {
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('You need to log in to post a comment.');
      return;
    }

    const newPost = {
      userId: userId, 
      comment: this.newPost.comment,
      timestamp: new Date().toISOString()
    };

    this.http.post(`${this.baseUrl}/posts`, newPost).subscribe(() => {
      this.getPosts(); 
    });

    this.newPost = { id: 0, userId: 0, comment: '', timestamp: '' }; 
  }

  edit(index: number) {
    const postToEdit = this.posts[index];
    if (this.currentUsername === postToEdit.username) {
      this.editingPost = { ...postToEdit };
      this.editingIndex = index;
    } else {
      alert('You can only edit your own posts.');
    }
  }

  doneEditing(index: number) {
    const postToEdit = this.posts[index];

    if (this.currentUsername !== postToEdit.username) {
      alert('You can only edit your own posts.');
      this.editingIndex = null; 
      return;
    }

    const updatedPost = { comment: this.editingPost.comment };

    this.http.patch(`${this.baseUrl}/posts/${postToEdit.id}`, updatedPost).subscribe(() => {
      this.getPosts(); 
      this.editingIndex = null; 
    });
  }

  deletePost(index: number) {
    const postId = this.posts[index].id;
    if (this.currentUsername === this.posts[index].username) {
      this.http.delete(`${this.baseUrl}/posts/${postId}`).subscribe(() => {
        this.getPosts(); 
      });
    } else {
      alert('You can only delete your own posts.');
    }
  }

  goToBooks() {
    this.router.navigate(['/book']);
  }

  logout() {
    this.authService.logout(); 
  }
}