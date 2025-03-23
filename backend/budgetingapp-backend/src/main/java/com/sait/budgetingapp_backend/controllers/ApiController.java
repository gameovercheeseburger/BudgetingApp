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

    // ✅ Check Backend Connection
    @GetMapping("/test")
    public String testConnection() {
        return "Backend connected successfully!";
    }

    // ✅ Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get user by ID
    @GetMapping("/users/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    // ✅ Get all budgets
    @GetMapping("/budgets")
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    // ✅ Get budgets by user ID
    @GetMapping("/budgets/user/{userId}")
    public List<Budget> getBudgetsByUser(@PathVariable Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    // ✅ Get all transactions
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // ✅ Get transactions by user ID
    @GetMapping("/transactions/user/{userId}")
    public List<Transaction> getTransactionsByUser(@PathVariable Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    // ✅ Get transactions by budget ID
    @GetMapping("/transactions/budget/{budgetId}")
    public List<Transaction> getTransactionsByBudget(@PathVariable Long budgetId) {
        return transactionRepository.findByBudgetId(budgetId);
    }
}
