package com.sait.budgetingapp_backend.repositories;

import com.sait.budgetingapp_backend.models.Transaction;
import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.models.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByBudget(Budget budget);
    List<Transaction> findByBudgetId(Long budget);
    List<Transaction> findByUserId(Long user);
}
