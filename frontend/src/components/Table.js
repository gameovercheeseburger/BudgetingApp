import React, { useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";

function Table({ userId, showBudget = true }) {
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("createdAtMostRecent");

  useEffect(() => {
    fetch(`http://localhost:8080/api/transactions/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((tx) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
        }));
        setTransactions(parsed);
      })
      .catch((err) => console.error("Failed to load transactions", err));
  }, [userId]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    switch (sortBy) {
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      case "amountAsc":
        return b.amount - a.amount;
      case "amountDesc":
        return a.amount - b.amount;
      case "createdAtMostRecent":
        return b.createdAt - a.createdAt;
      case "createdAtOldest":
        return a.createdAt - b.createdAt;
      default:
        return 0;
    }
  });

  const handleSelect = (e) => setSortBy(e.target.value);

  return (
    <div>
      <div className="flex justify-center items-center w-80 mb-4">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select id="sort" onChange={handleSelect} className="border rounded p-1">
          <option value="createdAtMostRecent">Most Recent</option>
          <option value="createdAtOldest">Oldest</option>
          <option value="nameAsc">Name ↑</option>
          <option value="nameDesc">Name ↓</option>
          <option value="amountAsc">Amount ↑</option>
          <option value="amountDesc">Amount ↓</option>
        </select>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            {showBudget && <th className="p-2">Budget Profile</th>}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b">
              <TransactionItem transaction={transaction} showBudget={showBudget} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
