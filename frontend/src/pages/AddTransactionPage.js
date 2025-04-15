import React, { useEffect, useState } from "react";
import AddTransactionForm from "../components/AddTransactionForm";

const AddTransactionPage = () => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch((err) => console.error("Failed to load budgets:", err));
  }, []);

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>💸 Add a New Transaction</h2>
      <AddTransactionForm budgets={budgets} />
    </div>
  );
};

export default AddTransactionPage;
