'use client';

import React from 'react';
import TransactionItem from './TransactionItem';

const Table = ({ transactions, showBudget = true }) => {
  const [sortBy, setSortBy] = React.useState("createdAtMostRecent");

  // Sorting logic
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === "nameAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "nameDesc") {
      return -a.name.localeCompare(b.name);
    } else if (sortBy === "amountDesc") {
      return a.amount - b.amount;
    } else if (sortBy === "amountAsc") {
      return b.amount - a.amount;
    } else if (sortBy === "createdAtMostRecent") {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div>
      <div className="flex justify-center items-center w-80">
        <label htmlFor="sort" className="w-30">Sort by: </label>
        <select 
          id="sort" 
          onChange={(e) => handleSortChange(e.target.value)} 
          value={sortBy}
          className="ml-2 p-1 border rounded"
        >
          <option value="createdAtMostRecent">Most Recent</option>
          <option value="createdAtOldest">Oldest</option>
          <option value="nameAsc">Name (A-Z)</option>
          <option value="nameDesc">Name (Z-A)</option>
          <option value="amountAsc">Amount (High to Low)</option>
          <option value="amountDesc">Amount (Low to High)</option>
        </select>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              {showBudget && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget Profile
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <TransactionItem transaction={transaction} showBudget={showBudget} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;