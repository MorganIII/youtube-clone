import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = 'http://localhost:8080/api/user';
  private userId: string = '';
  
  constructor(private http: HttpClient) { }
  
  
  
  subscribeToUser(userId: string) {
    return this.http.post<boolean>(`${this.baseUrl}/subscribe/${userId}`, null);
  }
  unSubscribeToUser(userId: string) {
    return this.http.post<boolean>(`${this.baseUrl}/unSubscribe/${userId}`, null);
  }
  registerUser() {
    return this.http.get(`${this.baseUrl}/register`,{responseType:"text"}).subscribe(data => {
      this.setUserId(data);
      console.log("in userService " + this.userId);
    });
  }
  
  getUserId() : string {
    return this.userId;
  }
  setUserId(userId: string) {
    sessionStorage.setItem('userId', userId);
    this.userId = userId;
  }
}
