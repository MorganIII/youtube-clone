package com.morgan.youtubeclone.controller;


import com.morgan.youtubeclone.dto.CommentDTO;
import com.morgan.youtubeclone.dto.UploadVideoResponse;
import com.morgan.youtubeclone.dto.VideoDTO;
import com.morgan.youtubeclone.model.Comment;
import com.morgan.youtubeclone.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/upload-video")
    @ResponseStatus(HttpStatus.CREATED)
    public UploadVideoResponse uploadVideo(@RequestParam("file") MultipartFile file) {
        return videoService.uploadVideo(file);
    }


    @PostMapping("/upload-thumbnail")
    public String uploadThumbnail(@RequestParam("file") MultipartFile file, @RequestParam("videoId") String videoId) {
        return videoService.uploadThumbnail(file,videoId);
    }


    @PutMapping("/edit-video")
    @ResponseStatus(HttpStatus.OK)
    public VideoDTO editVideoMetaData(@RequestBody VideoDTO videoDTO) {
        return videoService.editVideo(videoDTO);
    }

    @GetMapping("/watch-video")
    @ResponseStatus(HttpStatus.OK)
    public VideoDTO getVideoDetails(@RequestParam String videoId) {
        return videoService.getVideoDetails(videoId);
    }

    @GetMapping("/like/{videoId}")
    @ResponseStatus(HttpStatus.OK)
    public VideoDTO likeVideo(@PathVariable String videoId) {
        return videoService.likeVideo(videoId);
    }

    @GetMapping("/dislike/{videoId}")
    @ResponseStatus(HttpStatus.OK)
    public VideoDTO dislikeVideo(@PathVariable String videoId) {
        return videoService.dislikeVideo(videoId);
    }

    @PostMapping("/comment/{videoId}")
    @ResponseStatus(HttpStatus.OK)
    public void addComment(@PathVariable String videoId, @RequestBody CommentDTO commentDTO) {
        videoService.addComment(videoId, commentDTO);
    }


    @GetMapping("/comments/{videoId}")
    @ResponseStatus(HttpStatus.OK)
    public List<CommentDTO> getAllCommentsOfVideo(@PathVariable String videoId) {
        return videoService.getAllComments(videoId);
    }

    public List<VideoDTO> getAllVideos() {
        return videoService.getAllVideos();
    }
}
