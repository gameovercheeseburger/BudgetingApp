package com.sait.budgetingapp_backend.repositories;

import com.sait.budgetingapp_backend.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {}