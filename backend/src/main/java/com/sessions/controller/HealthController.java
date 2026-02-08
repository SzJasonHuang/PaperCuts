package com.sessions.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {
    
    /**
     * GET /api/health
     * Health check endpoint for frontend connectivity test
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "service", "pdf-optimizer",
            "timestamp", System.currentTimeMillis()
        ));
    }
}
