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
        List<Session> allSessions = sessionRepository.findAll();
        
        int totalSessions = allSessions.size();
        int totalPagesSaved = 0;
        double totalInkSaved = 0.0;
        double totalScore = 0.0;
        int scoreCount = 0;

        for (Session session : allSessions) {
            // Sum pages (assuming this represents pages that were optimized/saved)
            if (session.getPages() != null) {
                totalPagesSaved += session.getPages();
            }
            
            // Sum ink usage reduction
            if (session.getInkUse() != null) {
                totalInkSaved += session.getInkUse();
            }
            
            // Calculate average score
            if (session.getOptimizingScore() != null) {
                totalScore += session.getOptimizingScore();
                scoreCount++;
            }
        }

        double avgOptimizingScore = scoreCount > 0 ? totalScore / scoreCount : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("totalPagesSaved", totalPagesSaved);
        response.put("totalInkSaved", totalInkSaved);
        response.put("avgOptimizingScore", avgOptimizingScore);
        response.put("totalSessions", totalSessions);

        return ResponseEntity.ok(response);
    }
}
