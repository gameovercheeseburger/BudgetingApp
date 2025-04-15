package com.sait.budgetingapp_backend.controllers;

import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.models.Budget;
import com.sait.budgetingapp_backend.models.Transaction;
import com.sait.budgetingapp_backend.repositories.UserRepository;
import com.sait.budgetingapp_backend.repositories.BudgetRepository;
import com.sait.budgetingapp_backend.repositories.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class ApiController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Check Backend Connection
    @GetMapping("/test")
    public String testConnection() {
        return "Backend connected successfully!";
    }

    // Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get all budgets
    @GetMapping("/budgets")
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

}
