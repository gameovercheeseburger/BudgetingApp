package com.sait.budgetingapp_backend;


import com.sait.budgetingapp_backend.config.JwtConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableConfigurationProperties(JwtConfig.class) // Enable JWT Configuration Properties
public class BudgetingBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BudgetingBackendApplication.class, args);
    }
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
