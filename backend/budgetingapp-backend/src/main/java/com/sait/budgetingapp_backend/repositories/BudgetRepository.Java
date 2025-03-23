package com.sait.budgetingapp_backend.repository;

import com.sait.budgetingapp_backend.models.Budget;
import com.sait.budgetingapp_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user); // Find budgets by User
}
