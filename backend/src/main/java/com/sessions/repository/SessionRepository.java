package com.sessions.repository;

import com.sessions.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {
    
    List<Session> findByUserId(String userId);
    
    List<Session> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Session> findAllByOrderByCreatedAtDesc();
}
