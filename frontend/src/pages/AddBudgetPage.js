import React from "react";
import { useNavigate } from "react-router-dom";
import AddBudgetForm from "./AddBudgetForm";

const AddBudgetPage = () => {
  const navigate = useNavigate();

  const handleBudgetAdded = () => {
    // Redirect to dashboard after successful submission
    navigate("/dashboard", {
      state: { refresh: true }
    });
  };
  


  return (
    <div style={{ 
      padding: "2rem",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ 
        color: "#1d3557",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span style={{ fontSize: "1.5rem" }}>➕</span> Create New Budget
      </h2>
      
      {/* Form with visible submit button */}
      <AddBudgetForm onSuccess={handleBudgetAdded} />
      
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#e63946",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
          width: "100%",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}
      >
        <span>←</span> Cancel and Return to Dashboard
      </button>
    </div>
  );
};

export default AddBudgetPage;