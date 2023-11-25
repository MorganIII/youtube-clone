import { Component, Input } from '@angular/core';
import { VideoDto } from 'src/app/model/video-dto';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent {


  @Input() 
  video!: VideoDto;
  constructor() { } 

}
