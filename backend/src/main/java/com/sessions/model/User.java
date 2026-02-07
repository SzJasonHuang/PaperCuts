package com.sessions.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "users")
public class User {
    
    @Id
    private String id;  // MongoDB ObjectId as string
    
    private String name;
    private Boolean isAdmin;
    private Integer numUser;  // if individual; move to org if company-level
    
    private List<String> sessionIds;  // references to sessions._id
    
    private Instant createdAt;
    
    // Constructors
    public User() {
        this.createdAt = Instant.now();
        this.isAdmin = false;
        this.numUser = 1;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
    
    public Integer getNumUser() { return numUser; }
    public void setNumUser(Integer numUser) { this.numUser = numUser; }
    
    public List<String> getSessionIds() { return sessionIds; }
    public void setSessionIds(List<String> sessionIds) { this.sessionIds = sessionIds; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
