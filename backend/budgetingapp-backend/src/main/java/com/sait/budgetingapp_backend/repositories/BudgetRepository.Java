package com.sait.budgetingapp_backend.repositories;

import com.sait.budgetingapp_backend.models.Budget;
import com.sait.budgetingapp_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    // Existing methods (unchanged)
    List<Budget> findByUser(User user);
    List<Budget> findByUserId(Long userId);
    
    /**
     * NEW: Calculates total spent for a specific budget
     * @param budgetId The budget ID to calculate for
     * @return Sum of all transaction amounts for this budget
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0.00) FROM Transaction t WHERE t.budget.id = :budgetId")
    BigDecimal calculateTotalSpentByBudgetId(@Param("budgetId") Long budgetId);
    
    /**
     * NEW: Finds budgets with calculated remaining amount for a user
     * @param userId The user ID
     * @return Budgets with virtual remainingAmount (total - spent)
     */
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId")
    List<Budget> findBudgetsWithRemainingAmount(@Param("userId") Long userId);
    
    /**
     * NEW: Finds single budget with calculated remaining amount
     * @param budgetId The budget ID
     * @return Budget with virtual remainingAmount
     */
    @Query("SELECT b FROM Budget b WHERE b.id = :budgetId")
    Budget findBudgetWithRemainingAmount(@Param("budgetId") Long budgetId);
}