package com.sessions.controller;

import com.sessions.model.Session;
import com.sessions.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private SessionRepository sessionRepository;

    /**
     * GET /api/dashboard/org-metrics
     * Returns organization-wide metrics summary
     */
    @GetMapping("/org-metrics")
    public ResponseEntity<Map<String, Object>> getOrgMetrics() {
        // Hardcoded metrics for demo purposes
        Map<String, Object> response = new HashMap<>();
        response.put("totalPagesSaved", 2847);
        response.put("totalInkSaved", 42.3);
        response.put("avgOptimizingScore", 82);
        response.put("totalSessions", 156);

        return ResponseEntity.ok(response);
    }
}
