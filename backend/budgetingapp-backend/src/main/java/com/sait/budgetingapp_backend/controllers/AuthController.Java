package com.sait.budgetingapp_backend.controllers;

import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.models.Role;
import com.sait.budgetingapp_backend.repositories.UserRepository;
import com.sait.budgetingapp_backend.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, 
                          BCryptPasswordEncoder passwordEncoder, 
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> userData) {
        try {
            String name = userData.get("name");
            String email = userData.get("email");
            String password = userData.get("password");

            // Validate input
            if (name == null || name.trim().isEmpty() || 
                email == null || email.trim().isEmpty() || 
                password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("All fields are required!");
            }

            // Check if user exists
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Email already registered!");
            }

            // Create and save new user
            User user = new User(
                name.trim(),
                email.trim().toLowerCase(), // Normalize email
                passwordEncoder.encode(password.trim()),
                Role.USER
            );
            userRepository.save(user);
            
            return ResponseEntity.ok("Registration successful!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody Map<String, String> loginData) {
    try {
        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required!");
        }

        Optional<User> user = userRepository.findByEmail(email.trim().toLowerCase());

        if (user.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User foundUser = user.get();

        if (!passwordEncoder.matches(password.trim(), foundUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        if (!foundUser.isActive()) {
            return ResponseEntity.status(403).body("Account not active. Please contact support.");
        }

        String token = jwtUtil.generateToken(foundUser.getEmail());

        Map<String, Object> response = Map.of(
            "token", token,
            "user", Map.of(
                "id", foundUser.getId(),
                "name", foundUser.getName(),
                "email", foundUser.getEmail()
            )
        );

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
    }
}
@PostMapping("/refresh")
public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader("Authorization") String authHeader) {
    try {
        // Validate authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                "status", 401,
                "message", "Authorization header must start with 'Bearer '"
            ));
        }

        String token = authHeader.substring(7);
        
        // Validate existing token
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of(
                "status", 401,
                "message", "Invalid or expired token"
            ));
        }

        // Extract user information
        String email = jwtUtil.extractUsername(token);
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                "status", 404,
                "message", "User not found"
            ));
        }

        // Generate new token
        String newToken = jwtUtil.refreshToken(token);
        long expiresIn = TimeUnit.MILLISECONDS.toSeconds(jwtUtil.getRemainingTimeUntilExpiration(newToken));

        return ResponseEntity.ok(Map.of(
            "status", 200,
            "message", "Token refreshed successfully",
            "token", newToken,
            "expiresIn", expiresIn,
            "user", Map.of(
                "id", user.get().getId(),
                "name", user.get().getName(),
                "email", user.get().getEmail(),
                "role", user.get().getRole().name()
            )
        ));

    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of(
            "status", 500,
            "message", "Token refresh failed",
            "error", e.getMessage()
        ));
    }
}
}

