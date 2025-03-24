package com.sait.budgetingapp_backend.controllers;

import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.models.Role;
import com.sait.budgetingapp_backend.repositories.UserRepository;
import com.sait.budgetingapp_backend.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");

        if (name == null || name.isEmpty() || email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return "Invalid input data!";
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return "User already exists!";
        }
        User user = new User(name, email, passwordEncoder.encode(password), Role.USER);
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            if (user.get().isActive()) {
                return jwtUtil.generateToken(email);
            } else {
                return "User is not active!";
            }
        }
        return "Invalid email or password!";
    }
}
