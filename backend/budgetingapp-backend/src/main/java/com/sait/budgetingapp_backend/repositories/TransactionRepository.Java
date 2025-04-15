package com.sait.budgetingapp_backend.repositories;

import com.sait.budgetingapp_backend.models.Transaction;
import com.sait.budgetingapp_backend.models.User;
import com.sait.budgetingapp_backend.models.Budget;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);
    List<Transaction> findByBudget(Budget budget);
    List<Transaction> findByBudgetId(Long budget);
    List<Transaction> findByUserId(Long user);

    /**
     * Calculates total spent for a specific budget.
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0.00) FROM Transaction t WHERE t.budget.id = :budgetId")
    BigDecimal sumAmountByBudgetId(@Param("budgetId") Long budgetId);

    /**
     * Finds recent transactions for a user, limited by pageable.
     */
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactions(@Param("userId") Long userId, Pageable pageable);

    /**
     * Finds transactions between dates (using LocalDateTime).
     */
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.createdAt BETWEEN :start AND :end")
    List<Transaction> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    /**
     * Checks if a transaction exists based on description and amount.
     */
    boolean existsByDescriptionAndAmount(String description, BigDecimal amount);
}
