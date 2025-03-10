package com.sait.budgetingapp_backend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class ApiController {

    @GetMapping("/test")
    public String testConnection() {
        return "Backend connected successfully!";
    }

    // Add more endpoints here
}
