import { useState, useRef, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

const AddTransactionForm = ({ budgets = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    budgetId: budgets.length === 1 ? budgets[0].id : "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  const focusRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.name,
          amount: parseFloat(formData.amount),
          budgetId: parseInt(formData.budgetId),
        }),
      });

      const data = await response.text();

      if (response.ok) {
        alert("✅ " + data);
        formRef.current.reset();
        focusRef.current.focus();
      } else {
        alert("❌ " + data);
      }
    } catch (err) {
      alert("⚠️ " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>
        Add New{" "}
        <span className="accent">
          {budgets.length === 1 && budgets[0].name}
        </span>{" "}
        Expense
      </h2>
      <form className="grid-sm" ref={formRef} onSubmit={handleSubmit}>
        <div className="transaction-inputs">
          <div className="grid-xs">
            <label htmlFor="name">Transaction Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter transaction name"
              ref={focusRef}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              id="amount"
              placeholder="Enter transaction amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {budgets.length > 1 && (
          <div className="grid-sm">
            <label htmlFor="budgetId">Select Budget Profile</label>
            <select
              name="budgetId"
              id="budgetId"
              value={formData.budgetId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select --</option>
              {budgets
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Creating...</span>
          ) : (
            <>
              <span>Add Transaction</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
