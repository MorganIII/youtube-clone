package com.morgan.youtubeclone.service;

import com.morgan.youtubeclone.dto.CommentDTO;
import com.morgan.youtubeclone.dto.UploadVideoResponse;
import com.morgan.youtubeclone.dto.VideoDTO;
import com.morgan.youtubeclone.model.Comment;
import com.morgan.youtubeclone.model.Video;
import com.morgan.youtubeclone.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Service
@RequiredArgsConstructor
public class VideoService {

    private final UserService userService;
    private final S3Service s3Service;
    private final VideoRepository videoRepository;
    public UploadVideoResponse uploadVideo(MultipartFile file) {
        var videoUrl = s3Service.uploadFile(file);
        var video = new Video();
        video.setVideoUrl(videoUrl);
        var createdVideo = videoRepository.save(video);
        return new UploadVideoResponse(createdVideo.getId(),videoUrl);
    }

    public VideoDTO editVideo(VideoDTO videoDTO) {
        var savedVideo = getVideoById(videoDTO.getId());
        savedVideo.setVideoStatus(videoDTO.getVideoStatus());
        savedVideo.setVideoUrl(videoDTO.getVideoUrl());
        savedVideo.setTags(videoDTO.getTags());
        savedVideo.setThumbnailUrl(videoDTO.getThumbnailUrl());
        savedVideo.setDescription(videoDTO.getDescription());
        videoRepository.save(savedVideo);
        return videoDTO;
    }

    public String uploadThumbnail(MultipartFile file, String videoId) {
        var savedVideo = getVideoById(videoId);
        var thumbnailUrl = s3Service.uploadFile(file);
        savedVideo.setThumbnailUrl(thumbnailUrl);
        videoRepository.save(savedVideo);
        return thumbnailUrl;
    }

    public Video getVideoById(String videoId) {
        return videoRepository.findById(videoId)
                .orElseThrow(()->  new IllegalArgumentException("can not find video by id"+ videoId));
    }

    public VideoDTO getVideoDetails(String videoId) {
        var savedVideo = getVideoById(videoId);
        System.out.println(savedVideo.getId());
        increaseVideoViewCount(savedVideo);
        userService.addVideoToHistory(videoId);

        return mapToVideoDTO(savedVideo);
    }

    private void increaseVideoViewCount(Video savedVideo) {
        savedVideo.incrementViewCount();
        videoRepository.save(savedVideo);
    }

    public VideoDTO likeVideo(String videoId) {
        var savedVideo = getVideoById(videoId);

        if(userService.ifLikedVideo(videoId)) {
            savedVideo.decrementLikes();
            userService.removeFromLikedVideos(videoId);
        } else if (userService.ifDisLikedVideo(videoId)) {
            savedVideo.decrementDisLikes();
            userService.removeFromDisLikedVideos(videoId);
            savedVideo.incrementLikes();
            userService.addToLikedVideos(videoId);
        }else{
            savedVideo.incrementLikes();
            userService.addToLikedVideos(videoId);
        }

        videoRepository.save(savedVideo);

        return mapToVideoDTO(savedVideo);
    }

    public VideoDTO dislikeVideo(String videoId) {
        var savedVideo = getVideoById(videoId);

        if(userService.ifLikedVideo(videoId)) {
            savedVideo.decrementLikes();
            userService.removeFromLikedVideos(videoId);
            savedVideo.incrementLikes();
            userService.addToDisLikedVideos(videoId);
        } else if (userService.ifDisLikedVideo(videoId)) {
            savedVideo.decrementDisLikes();
            userService.removeFromDisLikedVideos(videoId);
        }else{
            savedVideo.incrementDisLikes();
            userService.addToDisLikedVideos(videoId);
        }

        videoRepository.save(savedVideo);

        return mapToVideoDTO(savedVideo);
    }

    private static VideoDTO mapToVideoDTO(Video savedVideo) {
        var videoDetails = new VideoDTO();
        videoDetails.setId(savedVideo.getId());
        videoDetails.setVideoStatus(savedVideo.getVideoStatus());
        videoDetails.setVideoUrl(savedVideo.getVideoUrl());
        videoDetails.setTags(savedVideo.getTags());
        videoDetails.setDescription(savedVideo.getDescription());
        videoDetails.setThumbnailUrl(savedVideo.getThumbnailUrl());
        videoDetails.setTitle(savedVideo.getTitle());
        videoDetails.setLikeCount(savedVideo.getLikes().get());
        videoDetails.setDislikeCount(savedVideo.getDislikes().get());
        videoDetails.setViewCount(savedVideo.getViewCount().get());
        return videoDetails;
    }

    public void addComment(String videoId, CommentDTO commentDTO) {
        Video savedVideo = getVideoById(videoId);
        Comment comment = new Comment();
        comment.setAuthorId(commentDTO.getAuthorId());
        comment.setText(commentDTO.getCommentText());
        savedVideo.addComment(comment);
        videoRepository.save(savedVideo);
    }

    public List<CommentDTO> getAllComments(String videoId) {
        Video savedVideo = getVideoById(videoId);

        return savedVideo.getCommentList().stream()
                .map(VideoService::mapToCommentDTO).toList();
    }

    private static CommentDTO mapToCommentDTO(Comment comment) {
        return new CommentDTO(comment.getAuthorId(), comment.getText());
    }

    public List<VideoDTO> getAllVideos() {
        return videoRepository.findAll().stream().map(VideoService::mapToVideoDTO).toList();
    }
}
