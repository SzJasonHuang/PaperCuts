package com.sessions.repository;

import com.sessions.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByName(String name);

    List<User> findByIsAdmin(Boolean isAdmin);
    
    List<User> findAllByOrderByCreatedAtDesc();
}
