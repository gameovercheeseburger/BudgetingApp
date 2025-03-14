package com.sait.budgetingapp_backend.repositories;

import com.sait.budgetingapp_backend.models.User; 
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}