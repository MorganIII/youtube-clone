import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
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
  likeCount = 0;
  dislikeCount = 0;
  viewCount = 0;
  showSubscribeButton = true;
  showUnsubscribeButton = false;
  constructor(private videoService: VideoService, private activatedRoute: ActivatedRoute,private userService: UserService) { 
    this.videoId =  this.activatedRoute.snapshot.queryParams['videoId'];
    this.videoService.getVideoDetails(this.videoId).subscribe(data => {

      this.videoUrl = data.videoUrl;
      console.log(this.videoUrl);
      this.videoAvailable = true;
      this.videoTitle = data.title;
      this.videoDescription = data.description;
      this.tags = data.tags;
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
      this.viewCount = data.viewCount;
    });
  }
  likeVideo() {
    this.videoService.likeVideo(this.videoId).subscribe(data => {
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
    });
  }
  dislikeVideo() {
    this.videoService.dislikeVideo(this.videoId).subscribe(data => {
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
    });
  }
  subscribeToUser() {
    let userId  = sessionStorage.getItem('userId')?.toString()!;
    console.log("in videoDetail" + userId);
    this.userService.subscribeToUser(userId).subscribe(data => {
      this.showUnsubscribeButton = true;
      this.showSubscribeButton = false;
    });
  }

  unSubscribeToUser() {
    let userId  = sessionStorage.getItem('userId')?.toString()!;
    this.userService.unSubscribeToUser(userId).subscribe(data => {
      this.showUnsubscribeButton = false;
      this.showSubscribeButton = true;
    });
  }
}
