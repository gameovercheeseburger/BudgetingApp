package com.sait.budgetingapp_backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class BudgetingBackendApplicationTests {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
        String password = "Password001";
        String encodedPassword = passwordEncoder.encode(password);
        System.out.println("Encoded password: " + encodedPassword);
    }
}
