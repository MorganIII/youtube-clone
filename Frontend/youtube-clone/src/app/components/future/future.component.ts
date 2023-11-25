import { Component, OnInit } from '@angular/core';
import { VideoDto } from 'src/app/model/video-dto';
import { VideoService } from 'src/app/service/video.service';

@Component({
  selector: 'app-future',
  templateUrl: './future.component.html',
  styleUrls: ['./future.component.css']
})
export class FutureComponent implements OnInit{

  videos: Array<VideoDto> = [];
  constructor(private videoService:VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos().subscribe(data => {
      this.videos = data;
    });
  }
  
  
}
