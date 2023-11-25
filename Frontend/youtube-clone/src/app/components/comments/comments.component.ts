import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentDto } from 'src/app/model/comment-dto';
import { CommentsService } from 'src/app/service/comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit{

  commentsForm!: FormGroup;
  @Input() 
  videoId!: string;
  commentsDto: CommentDto[] = [];
  constructor(private commentsService: CommentsService, private matSnackBar: MatSnackBar) {
    this.commentsForm = new FormGroup({
      comment: new FormControl('comment')
    });

  }
  ngOnInit(): void {
    this.getComments();
  }
  postComment(){
    const comment = this.commentsForm.get('comment')?.value;

    const commentDto = {
      "commentText": comment,
      "authorId": sessionStorage.getItem('userId')?.toString()!
    };
    this.commentsService.postComment(commentDto, this.videoId).subscribe(data => {
      this.matSnackBar.open('Comment posted Successfully', 'Ok');
      this.commentsForm.get('comment')?.reset();
      this.getComments();
    });
  }

  getComments() { 
    this.commentsService.getAllComments(this.videoId).subscribe(data => {
      this.commentsDto = data;
    });
  }

}
