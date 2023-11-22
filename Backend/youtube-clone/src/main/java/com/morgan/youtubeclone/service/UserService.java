package com.morgan.youtubeclone.service;

import com.morgan.youtubeclone.model.User;
import com.morgan.youtubeclone.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;

    public User getCurrentUser() {
        String sub = ((Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getClaim("sub");
        return userRepository.findBySub(sub)
                .orElseThrow(()-> new IllegalArgumentException("Cannot find user with sub: "+ sub));

    }

    public void addToLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToLikedVideos(videoId);
        userRepository.save(currentUser);
    }

    public void addToDisLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToDisLikedVideos(videoId);
        userRepository.save(currentUser);
    }

    public boolean ifLikedVideo(String videoId) {
        return getCurrentUser().getLikedVideos().stream().anyMatch(likedVideo->likedVideo.equals(videoId));
    }
    public boolean ifDisLikedVideo(String videoId) {
        return getCurrentUser().getDislikedVideos().stream().anyMatch(disLikedVideo->disLikedVideo.equals(videoId));
    }

    public void removeFromLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.removeFromLikedVideos(videoId);
        userRepository.save(currentUser);
    }

    public void removeFromDisLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.removeFromDisLikedVideos(videoId);
        userRepository.save(currentUser);
    }

    public void addVideoToHistory(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToVideoHistory(videoId);
        userRepository.save(currentUser);
    }

    public void subscribeUser(String userId) {
        User currentUser = getCurrentUser();
        currentUser.addToSubscribedToUsers(userId);
        User user = getUserById(userId);
        user.addToSubscribers(currentUser.getId());
        userRepository.save(currentUser);
        userRepository.save(user);
    }

    public void unSubscribeUser(String userId) {
        User currentUser = getCurrentUser();
        currentUser.removeFromSubscribedToUsers(userId);
        User user = getUserById(userId);
        user.removeFromSubscribers(currentUser.getId());
        userRepository.save(currentUser);
        userRepository.save(user);
    }

    private User getUserById(String userId) {
        return userRepository.
                findById(userId).orElseThrow(() -> new IllegalArgumentException("Cannot find user by userId " + userId));
    }


    public Set<String> getUserHistory(String userId) {
        User currentUser = getUserById(userId);

        return currentUser.getVideoHistory();
    }
}
