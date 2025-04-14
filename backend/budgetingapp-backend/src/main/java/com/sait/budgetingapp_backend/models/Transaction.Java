package com.sait.budgetingapp_backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private Double amount;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    public Transaction() {}

    public Transaction(String description, Double amount, User user, Budget budget) {
        this.description = description;
        this.amount = amount;
        this.user = user;
        this.budget = budget;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }

    public void setAmount(Double amount) { this.amount = amount; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Budget getBudget() { return budget; }

    public void setBudget(Budget budget) { this.budget = budget; }
}
