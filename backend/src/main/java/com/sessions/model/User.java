package com.sessions.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;
import java.util.List;

@Document(collection = "users")
public class User {
    
    @Id
    private String id;  // MongoDB ObjectId as string
    
    @Indexed(unique = true)
    private String userId;  // app-level ID (e.g., "U12345")
    
    private String name;
    private String password;
    private Boolean isAdmin;
    
    private List<String> sessionIds;  // references to sessions._id
    
    private Instant createdAt;
    
    // Constructors
    public User() {
        this.createdAt = Instant.now();
        this.isAdmin = false;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
    
    public List<String> getSessionIds() { return sessionIds; }
    public void setSessionIds(List<String> sessionIds) { this.sessionIds = sessionIds; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
