import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AddBudgetForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    category: "",
    amount: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createBudget = async (newBudgetData) => {
    try {
      // Verify user session
      if (!user?.token || !user?.id) {
        throw new Error("Session expired. Please login again.");
      }

      // Validate and format the request data
      const amountValue = parseFloat(newBudgetData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid positive amount");
      }

      const requestBody = {
        category: newBudgetData.category.trim(),
        amount: amountValue,
        userId: user.id
      };

      console.log("Submitting budget:", requestBody); // Debug log

      const response = await fetch("http://localhost:8080/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = "Budget creation failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Cannot connect to server. Please try again later.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.category.trim()) {
        throw new Error("Category is required");
      }

      if (!formData.amount) {
        throw new Error("Amount is required");
      }

      await createBudget({
        category: formData.category,
        amount: formData.amount
      });

      // Reset form and handle success
      setFormData({ category: "", amount: "" });
      if (onSuccess) onSuccess();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      {error && (
        <div style={{
          color: "#e63946",
          backgroundColor: "#ffebee",
          padding: "1rem",
          borderRadius: "4px",
          marginBottom: "1.5rem",
          border: "1px solid #e63946",
          fontSize: "0.9rem"
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="category" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1d3557" }}>
          Budget Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Groceries, Entertainment"
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "1rem",
          }}
        />
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="amount" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1d3557" }}>
          Budget Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "1rem",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "0.75rem 1.5rem",
          backgroundColor: isSubmitting ? "#457b9d" : "#1d3557",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          fontSize: "1rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          opacity: isSubmitting ? 0.7 : 1,
          transition: "all 0.3s ease"
        }}
      >
        {isSubmitting ? (
          <>
            <span className="spinner">⏳</span> Creating Budget...
          </>
        ) : (
          <>
            <span>✓</span> Create Budget
          </>
        )}
      </button>
    </form>
  );
};

export default AddBudgetForm;