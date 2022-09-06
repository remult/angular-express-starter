import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'remult';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(private http: HttpClient) { }

  signInUsername = '';
  currentUser?: UserInfo;

  signIn() {
    this.http.post<UserInfo>('/api/signIn',
      {
        username: this.signInUsername
      }).subscribe({
        next: user => {
          this.currentUser = user;
          this.signInUsername = '';
        },
        error: error => alert(error.error)
      });
  }

  signOut() {
    this.http.post('/api/signOut', {})
      .subscribe(() => this.currentUser = undefined);
  }

  ngOnInit() {
    this.http.get<UserInfo>('/api/currentUser')
      .subscribe(user => this.currentUser = user)
  }

}
 