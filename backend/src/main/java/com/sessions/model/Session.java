package com.sessions.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;

@Document(collection = "sessions")
public class Session {
    
    @Id
    private String id;  // MongoDB ObjectId as string
    
    @Indexed
    private String userId;  // reference to users._id (ObjectId)
    
    private Integer pages;
    private Double inkUse;          // normalized or ml
    private Integer optimizingScore; // 0-100
    
    @Indexed
    private Instant createdAt;
    
    // Constructors
    public Session() {
        this.createdAt = Instant.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }
    
    public Double getInkUse() { return inkUse; }
    public void setInkUse(Double inkUse) { this.inkUse = inkUse; }
    
    public Integer getOptimizingScore() { return optimizingScore; }
    public void setOptimizingScore(Integer optimizingScore) { this.optimizingScore = optimizingScore; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
