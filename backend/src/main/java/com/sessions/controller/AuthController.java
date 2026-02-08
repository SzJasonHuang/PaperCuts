package com.sessions.controller;

import com.sessions.model.User;
import com.sessions.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * POST /api/auth/login
     * Body: { name, password }
     * Returns: { success, user, message }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String name = request.get("name");
        String password = request.get("password");
        
        if (name == null || name.isEmpty() || password == null || password.isEmpty()) {
            response.put("success", false);
            response.put("message", "Name and password are required");
            return ResponseEntity.badRequest().body(response);
        }
        
        Optional<User> user = userRepository.findByName(name);
        
        if (user.isPresent() && user.get().getPassword() != null && 
            user.get().getPassword().equals(password)) {
            response.put("success", true);
            response.put("user", user.get());
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * POST /api/auth/register
     * Body: { name, password, isAdmin? }
     * Returns: { success, user, message }
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        String name = (String) request.get("name");
        String password = (String) request.get("password");
        Boolean isAdmin = (Boolean) request.getOrDefault("isAdmin", false);
        
        // Validation
        if (name == null || name.isEmpty()) {
            response.put("success", false);
            response.put("message", "Name is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (password == null || password.isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (password.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByName(name);
        if (existingUser.isPresent()) {
            response.put("success", false);
            response.put("message", "User already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        
        // Create new user
        User newUser = new User();
        newUser.setName(name);
        newUser.setPassword(password);
        newUser.setIsAdmin(isAdmin);
        newUser.setSessionIds(new ArrayList<>());
        newUser.setCreatedAt(Instant.now());
        
        User savedUser = userRepository.save(newUser);
        
        response.put("success", true);
        response.put("user", savedUser);
        response.put("message", "User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * POST /api/auth/logout
     * No body required
     * Returns: { success, message }
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/auth/validate/{userId}
     * Validates if a user exists and returns their info
     * Returns: { success, user }
     */
    @GetMapping("/validate/{userId}")
    public ResponseEntity<Map<String, Object>> validateUser(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> user = userRepository.findById(userId)
                .or(() -> userRepository.findByName(userId));
        
        if (user.isPresent()) {
            response.put("success", true);
            response.put("user", user.get());
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * PUT /api/auth/change-password
     * Body: { userId, oldPassword, newPassword }
     * Returns: { success, message }
     */
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String userId = request.get("userId");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        if (userId == null || oldPassword == null || newPassword == null) {
            response.put("success", false);
            response.put("message", "userId, oldPassword, and newPassword are required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (newPassword.length() < 6) {
            response.put("success", false);
            response.put("message", "New password must be at least 6 characters");
            return ResponseEntity.badRequest().body(response);
        }
        
        Optional<User> user = userRepository.findById(userId)
                .or(() -> userRepository.findByName(userId));
        
        if (user.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        User foundUser = user.get();
        
        if (!oldPassword.equals(foundUser.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid current password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        foundUser.setPassword(newPassword);
        userRepository.save(foundUser);
        
        response.put("success", true);
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }
}
