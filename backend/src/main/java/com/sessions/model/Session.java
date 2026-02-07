package com.sessions.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;
import java.util.Map;

@Document(collection = "sessions")
public class Session {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String title;
    private String description;
    private SessionStatus status;
    
    @Indexed
    private Instant createdAt;
    private Instant updatedAt;
    
    private Map<String, Object> metadata;
    
    public enum SessionStatus {
        active, completed, pending
    }
    
    // Constructors
    public Session() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = SessionStatus.pending;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
