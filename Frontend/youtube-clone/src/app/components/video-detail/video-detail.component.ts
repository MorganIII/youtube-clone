import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/service/video.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent {
  videoId!: string;
  videoUrl!: string;
  videoTitle!: string;
  videoDescription!: string;
  tags: Array<string> = [];
  videoAvailable = false;

  constructor(private videoService: VideoService, private activatedRoute: ActivatedRoute) { 
    this.videoId =  this.activatedRoute.snapshot.queryParams['videoId'];
    this.videoService.getVideoDetails(this.videoId).subscribe(data => {

      this.videoUrl = data.videoUrl;
      console.log(this.videoUrl);
      this.videoAvailable = true;
      this.videoTitle = data.title;
      this.videoDescription = data.description;
      this.tags = data.tags;
    });
  } 
}
