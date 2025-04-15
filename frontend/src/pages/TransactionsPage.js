import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  return (
    <div className="transactions-page">
      <h3>Transactions</h3>
      <button onClick={() => history.push("/add-transaction")}>Add Transaction</button>
      
      <ul>
        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.description}: ${transaction.amount}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TransactionsPage;
