import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTransactionPage.css";



const AddTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false); // Control visibility of the form

  const navigate = useNavigate(); // Using useNavigate instead of useHistory please work, I am confused of no sleep BRAH

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();

    const newTransaction = {
      description,
      amount: parseFloat(amount),
    };

    try {
      const response = await fetch("http://localhost:8080/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        const addedTransaction = await response.json();
        setTransactions((prev) => [...prev, addedTransaction]);
        setDescription("");
        setAmount("");
        setIsAdding(false); // Hide the form after saving
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const cancelTransaction = () => {
    setIsAdding(false); // Hide form and discard changes
    navigate("/dashboard"); // Use navigate() for navigation in React Router v6
  };

  const goBackToDashboard = () => {
    navigate("/dashboard"); // Use navigate() for navigation in React Router v6
  };

  return (
    <div className="transactions-page">
      <h3 className="page-title">Manage Your Transactions</h3>

      {/* Button to show Add Transaction Form */}
      {!isAdding && (
        <div className="actions">
          <button
            className="visible-add-button"
            onClick={() => setIsAdding(true)}
          >
            Add New Transaction
          </button>
        </div>
      )}

      {/* Form for Adding a Transaction */}
      {isAdding && (
        <form className="transaction-form" onSubmit={addTransaction}>
          <div className="form-inputs">
            <input
              type="text"
              className="input-field"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Save Transaction
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={cancelTransaction}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Transaction List */}
      {!isAdding && (
        <div className="transactions-list">
          {transactions.length > 0 ? (
            <ul className="transaction-list">
              {transactions.map((transaction, index) => (
                <li key={index} className="transaction-item">
                  <div className="transaction-content">
                    <span className="transaction-description">
                      {transaction.description}
                    </span>
                    <span className="transaction-amount">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddTransactionPage;
