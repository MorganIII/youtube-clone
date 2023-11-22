import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { SaveVideoDetailsComponent } from './components/save-video-details/save-video-details.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';


const routes: Routes =[
  { path: 'upload-video', component: UploadVideoComponent},
  { path: 'save-video-details', component: SaveVideoDetailsComponent},
  { path: 'video-details', component: VideoDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule { }
