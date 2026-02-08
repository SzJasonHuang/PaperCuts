package com.sessions.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                    "http://localhost:*",              // Local dev (any port)
                    "https://*.lovable.app",                       // Lovable preview
                    "https://*.lovableproject.com",                // Lovable project domains
                    "https://*-preview--*.lovable.app"             // Lovable preview subdomains
                )
                .allowedOrigins("http://localhost:8081")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Content-Disposition")             // For file downloads
                .allowCredentials(true)
                .maxAge(3600);                                     // Cache preflight for 1 hour
    }
}
