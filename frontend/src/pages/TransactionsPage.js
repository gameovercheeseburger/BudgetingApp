import React, { useState, useEffect } from "react";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, amount })
    });
    if (response.ok) {
      setTransactions([...transactions, { description, amount }]);
    }
  };

  return (
    <div>
      <h3>Transactions</h3>
      <form onSubmit={addTransaction}>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit">Add Transaction</button>
      </form>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>{transaction.description}: ${transaction.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionsPage;