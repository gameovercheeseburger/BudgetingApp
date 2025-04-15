package com.sait.budgetingapp_backend.controllers;

import com.sait.budgetingapp_backend.models.Budget;
import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.repositories.BudgetRepository;
import com.sait.budgetingapp_backend.repositories.TransactionRepository;
import com.sait.budgetingapp_backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public BudgetController(BudgetRepository budgetRepository,
                          UserRepository userRepository,
                          TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // Get all budgets with calculated remaining amounts
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getUserBudgets(@PathVariable Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                List<Budget> budgets = budgetRepository.findByUser(user);
                budgets.forEach(budget -> {
                    BigDecimal spent = transactionRepository.sumAmountByBudgetId(budget.getId());
                    budget.calculateRemaining(spent);  // Using the method in the model
                });
                return ResponseEntity.ok(budgets);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Create new budget
    @PostMapping
    public ResponseEntity<?> createBudget(@RequestParam Long userId, @RequestBody Map<String, String> request) {
        try {
            // 1. Validate input
            if (request.get("category") == null || request.get("amount") == null) {
                return ResponseEntity.badRequest().body("Category and amount are required");
            }
    
            // 2. Find user
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
            // 3. Create and save budget
            Budget budget = new Budget();
            budget.setUser(user);
            budget.setCategory(request.get("category"));
            budget.setAmount(new BigDecimal(request.get("amount")));
    
            // Log before saving to check the data
            System.out.println("Saving budget: " + budget);
    
            Budget savedBudget = budgetRepository.save(budget);
    
            // Log after saving to check if the saved budget is correct
            System.out.println("Saved budget: " + savedBudget);
    
            // 4. Verify save worked
            if (savedBudget.getId() == null) {
                throw new RuntimeException("Failed to save budget");
            }
    
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBudget);
    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }

    // Delete budget by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        // Check if the budget exists before attempting to delete
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
            return ResponseEntity.ok().body("Budget deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Budget not found");
        }
    }

    // BudgetRequest DTO (Data Transfer Object) to encapsulate request data
    public static class BudgetRequest {
        private String category;
        private BigDecimal amount;
        private Long userId;

        // Getters and Setters
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }
}
