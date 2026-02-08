package com.sessions.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;
import java.util.List;

@Document(collection = "PdfSessions")
public class PdfSession {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    // File references
    private String originalFileName;
    private String originalFilePath;
    private String optimizedFilePath;
    
    // Metrics - Before
    private Integer pagesBefore;
    private Double inkBefore;
    
    // Metrics - After
    private Integer pagesAfter;
    private Double inkAfter;
    
    // Analysis
    private Integer optimizingScore;
    private List<String> suggestions;
    private List<String> changesApplied;
    
    // Settings used
    private Integer inkSaverLevel;
    private Integer pageSaverLevel;
    private Boolean preserveQuality;
    private Boolean excludeImages;
    
    // Status: UPLOADED, ANALYZING, ANALYZED, OPTIMIZING, COMPLETE, ERROR
    private String status;
    
    @Indexed
    private Instant createdAt;
    private Instant expiresAt;
    
    // Constructors
    public PdfSession() {
        this.createdAt = Instant.now();
        this.expiresAt = Instant.now().plusSeconds(24 * 60 * 60); // 24 hours
        this.status = "UPLOADED";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public String getOriginalFilePath() { return originalFilePath; }
    public void setOriginalFilePath(String originalFilePath) { this.originalFilePath = originalFilePath; }
    
    public String getOptimizedFilePath() { return optimizedFilePath; }
    public void setOptimizedFilePath(String optimizedFilePath) { this.optimizedFilePath = optimizedFilePath; }
    
    public Integer getPagesBefore() { return pagesBefore; }
    public void setPagesBefore(Integer pagesBefore) { this.pagesBefore = pagesBefore; }
    
    public Double getInkBefore() { return inkBefore; }
    public void setInkBefore(Double inkBefore) { this.inkBefore = inkBefore; }
    
    public Integer getPagesAfter() { return pagesAfter; }
    public void setPagesAfter(Integer pagesAfter) { this.pagesAfter = pagesAfter; }
    
    public Double getInkAfter() { return inkAfter; }
    public void setInkAfter(Double inkAfter) { this.inkAfter = inkAfter; }
    
    public Integer getOptimizingScore() { return optimizingScore; }
    public void setOptimizingScore(Integer optimizingScore) { this.optimizingScore = optimizingScore; }
    
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    
    public List<String> getChangesApplied() { return changesApplied; }
    public void setChangesApplied(List<String> changesApplied) { this.changesApplied = changesApplied; }
    
    public Integer getInkSaverLevel() { return inkSaverLevel; }
    public void setInkSaverLevel(Integer inkSaverLevel) { this.inkSaverLevel = inkSaverLevel; }
    
    public Integer getPageSaverLevel() { return pageSaverLevel; }
    public void setPageSaverLevel(Integer pageSaverLevel) { this.pageSaverLevel = pageSaverLevel; }
    
    public Boolean getPreserveQuality() { return preserveQuality; }
    public void setPreserveQuality(Boolean preserveQuality) { this.preserveQuality = preserveQuality; }
    
    public Boolean getExcludeImages() { return excludeImages; }
    public void setExcludeImages(Boolean excludeImages) { this.excludeImages = excludeImages; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
