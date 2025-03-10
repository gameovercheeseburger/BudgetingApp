package com.sait.budgetingapp_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests()
            .requestMatchers("/auth/**").permitAll() // Public endpoints
            .requestMatchers("/admin/**").hasRole("ADMIN") // Admin-only
            .anyRequest().authenticated()
            .and()
            .addFilter(new JwtFilter(new JwtUtil()));
        return http.build();
    }
}