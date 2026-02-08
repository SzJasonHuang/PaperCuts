package com.sessions.dto;

/**
 * Request body for PDF optimization settings
 */
public class OptimizeRequest {
    private Integer inkSaverLevel;
    private Integer pageSaverLevel;
    private Boolean preserveQuality;
    private Boolean excludeImages;
    
    // Getters and Setters
    public Integer getInkSaverLevel() { return inkSaverLevel; }
    public void setInkSaverLevel(Integer inkSaverLevel) { this.inkSaverLevel = inkSaverLevel; }
    
    public Integer getPageSaverLevel() { return pageSaverLevel; }
    public void setPageSaverLevel(Integer pageSaverLevel) { this.pageSaverLevel = pageSaverLevel; }
    
    public Boolean getPreserveQuality() { return preserveQuality; }
    public void setPreserveQuality(Boolean preserveQuality) { this.preserveQuality = preserveQuality; }
    
    public Boolean getExcludeImages() { return excludeImages; }
    public void setExcludeImages(Boolean excludeImages) { this.excludeImages = excludeImages; }
}
