import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchData, deleteItem } from '../helpers';
import Table from '../components/Table';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = () => {
      const transactions = fetchData("transactions") || [];
      setTransactions(transactions);
    };
    loadTransactions();
  }, []);

  const handleDeleteTransaction = (transactionId) => {
    try {
      const updatedTransactions = deleteItem({
        key: "transactions",
        id: transactionId
      });
      setTransactions(updatedTransactions);
      toast.success("Expense deleted!");
    } catch (e) {
      toast.error("There was a problem deleting the expense.");
    }
  };

  return (
    <div className="grid-lg">
      <h1>All Transactions</h1>
      {transactions && transactions.length > 0 ? (
        <div className="grid-md">
          <h2>Recent Transactions <small>({transactions.length} total)</small></h2>
          <Table 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
          />
        </div>
      ) : (
        <p>No expenses to show.</p>
      )}
    </div>
  );
}