package com.sessions.controller;

import com.sessions.model.Session;
import com.sessions.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    /**
     * GET /api/sessions
     * GET /api/sessions?userId={objectId}
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSessions() {
        
        List<Session> sessions;
        
        sessions = sessionRepository.findAllByOrderByCreatedAtDesc();
        
        Map<String, Object> response = new HashMap<>();
        response.put("sessions", sessions);
        response.put("total", sessions.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/sessions
     * Body: { userId, pages, inkUse, optimizingScore }
     */
    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session) {
        session.setCreatedAt(Instant.now());
        
        Session savedSession = sessionRepository.save(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
    }
    
    /**
     * GET /api/sessions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Session> getSession(@PathVariable String id) {
        return sessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * PUT /api/sessions/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(
            @PathVariable String id,
            @RequestBody Session updates) {
        
        return sessionRepository.findById(id)
                .map(session -> {
                    if (updates.getPages() != null) session.setPages(updates.getPages());
                    if (updates.getInkUse() != null) session.setInkUse(updates.getInkUse());
                    if (updates.getOptimizingScore() != null) session.setOptimizingScore(updates.getOptimizingScore());
                    return ResponseEntity.ok(sessionRepository.save(session));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * DELETE /api/sessions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable String id) {
        if (sessionRepository.existsById(id)) {
            sessionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
