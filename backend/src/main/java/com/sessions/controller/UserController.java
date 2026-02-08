package com.sessions.controller;

import com.sessions.model.Session;
import com.sessions.model.User;
import com.sessions.repository.SessionRepository;
import com.sessions.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers() {
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("total", users.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        // First try by MongoDB _id
        return userRepository.findById(id)
                .or(() -> userRepository.findByName(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    
    /**
     * GET /api/users/{id}/inktotal
     */
    @GetMapping("/inktotal/{id}")
    public ResponseEntity<Double> getUserInkTotal(@PathVariable String id) {
        Double totalInk = 0.;

        try {
            Optional<User> user = userRepository.findById(id).or(() -> userRepository.findByName(id));

            for (String sessionID : user.get().getSessionIds()) {
                Optional<Session> session = sessionRepository.findById(sessionID);

                try {
                    totalInk += session.get().getInkUse();
                } catch (Exception e) {
                    System.err.printf("No session with ID %s.%n", sessionID);
                }
            }

            return(new ResponseEntity<Double>(totalInk, HttpStatus.OK));
        } catch (Exception e) {
            return(new ResponseEntity<Double>(-1., HttpStatus.OK));
        }
    }
    
    /**
     * POST /api/users
     * Body: { name, isAdmin? }
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setCreatedAt(Instant.now());
        if (user.getIsAdmin() == null) user.setIsAdmin(false);
        if (user.getSessionIds() == null) user.setSessionIds(new ArrayList<>());
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    /**
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestBody User updates) {
        
        return userRepository.findById(id)
                .map(user -> {
                    if (updates.getName() != null) user.setName(updates.getName());
                    if (updates.getPassword() != null) user.setPassword(updates.getPassword());
                    if (updates.getIsAdmin() != null) user.setIsAdmin(updates.getIsAdmin());
                    if (updates.getSessionIds() != null) user.setSessionIds(updates.getSessionIds());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    /**
     * POST /api/users/{id}/sessions/{sessionId}
     * Add a session to user's sessionIds array
     */
    @PostMapping("/{id}/sessions/{sessionId}")
    public ResponseEntity<User> addSessionToUser(
            @PathVariable String id,
            @PathVariable String sessionId) {
        
        return userRepository.findById(id)
                .map(user -> {
                    List<String> sessionIds = user.getSessionIds();
                    if (sessionIds == null) sessionIds = new ArrayList<>();
                    if (!sessionIds.contains(sessionId)) {
                        sessionIds.add(sessionId);
                        user.setSessionIds(sessionIds);
                    }
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
