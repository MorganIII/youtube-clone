import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/service/video.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoDto } from 'src/app/model/video-dto';

@Component({
  selector: 'app-save-video-details',
  templateUrl: './save-video-details.component.html',
  styleUrls: ['./save-video-details.component.css']
})
export class SaveVideoDetailsComponent {
  saveVideoDetailsForm: FormGroup;
  title: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  videoStatus: FormControl = new FormControl('');
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  thumbnailSelected = false;
  thumbnailFile!: File;
  thumbnailFileName!: string;
  thumbnailUrl!: string;
  announcer = inject(LiveAnnouncer);
  videoId = '';
  videoUrl!:string;

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService,
              private _snackBar: MatSnackBar) {
    this.videoId =  this.activatedRoute.snapshot.queryParams['videoId'];
    this.videoService.getVideoDetails(this.videoId).subscribe(data => {
      this.videoUrl = data.videoUrl;
      this.thumbnailUrl = data.thumbnailUrl;
    });
    this.saveVideoDetailsForm = new FormGroup({
      title: this.title,
      description: this.description,
      videoStatus: this.videoStatus
    });
  }

  ngOnInit(): void {
    
  }



  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(tag);
      return;
    }

    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }
  onFileSelected(event: Event) {
    this.thumbnailSelected = true;
    this.thumbnailFile = (event.target as HTMLInputElement).files![0];
    this.thumbnailFileName = this.thumbnailFile.name;
  } 

  onUpload() {
    
    this.videoService.uploadThumbnail(this.thumbnailFile, this.videoId).subscribe(data => {
      console.log(data);
      this._snackBar.open('Thumbnail uploaded successfully', 'Ok');
    });
  }

  saveVideo(){
    const videoMetaData: VideoDto = {
      "id": this.videoId,
      "title": this.saveVideoDetailsForm.get('title')?.value,
      "description": this.saveVideoDetailsForm.get('description')?.value,
      "tags": this.tags,
      "videoUrl": this.videoUrl,
      "videoStatus": this.saveVideoDetailsForm.get('videoStatus')?.value,
      "thumbnailUrl": this.thumbnailUrl,
      "likeCount": 0,
      "dislikeCount": 0,
      "viewCount": 0
    }
    this.videoService.saveVideo(videoMetaData).subscribe(data => {
      this._snackBar.open('Video details saved successfully', 'Ok');
    });
  }
}
