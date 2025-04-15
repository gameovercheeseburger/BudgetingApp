import React, { useState, useEffect } from "react";

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data));
  }, []);

  const addBudget = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount })
    });
    if (response.ok) {
      setBudgets([...budgets, { category, amount }]);
    }
  };

  return (
    <div>
      <h3>Budgets</h3>
      <form onSubmit={addBudget}>
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit">Add Budget</button>
      </form>
      <ul>
        {budgets.map((budget, index) => (
          <li key={index}>{budget.category}: ${budget.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default BudgetPage;