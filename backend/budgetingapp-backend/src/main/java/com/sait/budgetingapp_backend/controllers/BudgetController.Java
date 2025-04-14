package com.sait.budgetingapp_backend.controllers;

import com.sait.budgetingapp_backend.models.Budget;
import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.repositories.UserRepository;
import com.sait.budgetingapp_backend.repositories.BudgetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetController(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    // Get all budgets
    @GetMapping("/{userId}")
    public ResponseEntity<List<Budget>> getBudgets(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> ResponseEntity.ok(budgetRepository.findByUser(value)))
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add a new budget
    @PostMapping("/{userId}")
    public ResponseEntity<Budget> addBudget(@PathVariable Long userId, @RequestBody Budget budget) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            budget.setUser(user.get());
            Budget savedBudget = budgetRepository.save(budget);
            return ResponseEntity.ok(savedBudget);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete a budget
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
