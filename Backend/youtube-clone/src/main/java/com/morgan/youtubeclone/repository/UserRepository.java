package com.morgan.youtubeclone.repository;

import com.morgan.youtubeclone.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {


    Optional<User> findBySub(String s);
}
