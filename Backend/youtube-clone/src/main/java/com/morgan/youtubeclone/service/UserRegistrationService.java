package com.morgan.youtubeclone.service;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.morgan.youtubeclone.dto.UserInfoDTO;
import com.morgan.youtubeclone.model.User;
import com.morgan.youtubeclone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    @Value("${auth0.userinfo-endpoint}")
    private String userInfoEndPoint;

    private final UserRepository userRepository;


    public String registerUser(String token) {

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create(userInfoEndPoint))
                .setHeader("Authorization", String.format("Bearer %s", token))
                .build();
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .build();
        try {
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            String body = response.body();
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            UserInfoDTO userInfoDTO = mapper.readValue(body, UserInfoDTO.class);
            Optional<User> userBySub = userRepository.findBySub(userInfoDTO.getSub());
            if(userBySub.isPresent()) {
                return userBySub.get().getId();
            }
            User user = new User();
            user.setFirstName(userInfoDTO.getGivenName());
            user.setLastName(userInfoDTO.getFamilyName());
            user.setFullName(userInfoDTO.getName());
            user.setEmailAddress(userInfoDTO.getEmail());
            user.setSub(userInfoDTO.getSub());
            return userRepository.save(user).getId();
        } catch (Exception exception) {
            throw new RuntimeException("Exception occurred while registering user ", exception);
        }
    }
}
