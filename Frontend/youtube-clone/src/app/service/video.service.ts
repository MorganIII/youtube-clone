import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadVideoResponse } from '../model/upload-video-response';
import { VideoDto } from '../model/video-dto';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  
  baseUrl: string = 'http://localhost:8080/api/videos';
  constructor(private http: HttpClient) { }
  
  uploadVideo(file: File) : Observable<UploadVideoResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<UploadVideoResponse>(`${this.baseUrl}/upload-video`, formData);
  }

  uploadThumbnail(file: File, videoId: string) : Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('videoId', videoId);
    return this.http.post(`${this.baseUrl}/upload-thumbnail`, formData, {responseType: 'text'});
  }

  getVideoDetails(videoId: string): Observable<VideoDto> {
    console.log("from service: "+videoId);
    return this.http.get<VideoDto>(`${this.baseUrl}/watch-video`,{params:{"videoId":videoId}});
  }

  saveVideo(videoDTO: VideoDto) : Observable<VideoDto> {

    return this.http.put<VideoDto>(`${this.baseUrl}/edit-video`, videoDTO);
  }
}
