import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentDto } from '../model/comment-dto';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  
  baseUrl: string = 'http://localhost:8080/api/videos';
  constructor(private http: HttpClient) { 
    
  }
  
  postComment(commentDto: any, videoId: string) {
    return this.http.post<any>(`${this.baseUrl}/comment/${videoId}`, commentDto);
  }
  getAllComments(videoId: string) {
    return this.http.get<CommentDto[]>(`${this.baseUrl}/comments/${videoId}`);
  }
}
