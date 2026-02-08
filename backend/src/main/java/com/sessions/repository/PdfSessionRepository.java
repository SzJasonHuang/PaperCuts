package com.sessions.repository;

import com.sessions.model.PdfSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface PdfSessionRepository extends MongoRepository<PdfSession, String> {
    
    List<PdfSession> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<PdfSession> findAllByOrderByCreatedAtDesc();
    
    List<PdfSession> findByStatus(String status);
    
    List<PdfSession> findByExpiresAtBefore(Instant time);
}
