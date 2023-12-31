import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { SaveVideoDetailsComponent } from './components/save-video-details/save-video-details.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { HomeComponent } from './components/home/home.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { HistoryComponent } from './components/history/history.component';
import { LikedVideosComponent } from './components/liked-videos/liked-videos.component';
import { FutureComponent } from './components/future/future.component';
import { CallbackComponent } from './components/callback/callback.component';


const routes: Routes =[
  {path: '', component: HomeComponent, children: [
    {path: 'future', component: FutureComponent},
    {path: 'subscriptions', component: SubscriptionsComponent},
    {path: 'history', component: HistoryComponent},
    {path: 'liked-videos', component: LikedVideosComponent},
  ]},
  { path: 'upload-video', component: UploadVideoComponent},
  { path: 'save-video-details', component: SaveVideoDetailsComponent},
  { path: 'video-details', component: VideoDetailComponent},
  { path: 'callback', component: CallbackComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule { }
