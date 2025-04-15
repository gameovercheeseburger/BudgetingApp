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

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Map<String, Object> request) {
        try {
            // 1. Validate input
            if (request.get("category") == null || request.get("amount") == null || request.get("userId") == null) {
                return ResponseEntity.badRequest().body("Category, amount, and userId are required");
            }
    
            // 2. Find user
            Long userId;
            try {
                userId = Long.parseLong(request.get("userId").toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid userId format");
            }
    
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
            // 3. Create and save budget
            Budget budget = new Budget();
            budget.setUser(user);
            budget.setCategory(request.get("category").toString());
            
            // Handle amount conversion (supports both String and Number inputs)
            BigDecimal amount;
            try {
                Object amountObj = request.get("amount");
                if (amountObj instanceof Number) {
                    amount = BigDecimal.valueOf(((Number) amountObj).doubleValue());
                } else {
                    amount = new BigDecimal(amountObj.toString());
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid amount format");
            }
            
            budget.setAmount(amount);
    
            Budget savedBudget = budgetRepository.save(budget);
    
            // 4. Verify save worked
            if (savedBudget.getId() == null) {
                throw new RuntimeException("Failed to save budget");
            }
    
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBudget);
    
        } catch (Exception e) {
            e.printStackTrace();
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
