package com.sait.budgetingapp_backend.security;

import com.sait.budgetingapp_backend.config.JwtConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtConfig jwtConfig;

    public SecurityConfig(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
        System.out.println("SecurityConfig initialized");
        System.out.println("SecurityConfig initialized with JwtConfig: " + jwtConfig);
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow all requests
            )
            .build();
    }
    /*@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.enable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() // Public endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN") // Admin-only
                .anyRequest().authenticated()
            )
            .build();
    }*/
}
