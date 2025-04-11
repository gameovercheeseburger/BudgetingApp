import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchData, createBudget, createTransaction, deleteItem } from '../helpers';
import Register from '../components/Register';
import AddBudgetForm from '../components/AddBudgetForm';
import AddTransactionForm from '../components/AddTransactionForm';
import BudgetProfile from '../components/BudgetProfile';
import Table from '../components/Table';
import Link from 'next/link';
import Main from '../layouts/Main';

export default function Dashboard() {
  const [userName, setUserName] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const userName = fetchData("userName");
      const budgets = fetchData("budgets") || [];
      const transactions = fetchData("transactions") || [];
      setUserName(userName);
      setBudgets(budgets);
      setTransactions(transactions);
    };
    loadData();
  }, []);

  const handleNewUser = (values) => {
    try {
      localStorage.setItem("userName", JSON.stringify(values.userName));
      setUserName(values.userName);
      toast.success(`Welcome, ${values.userName}!`);
    } catch (e) {
      toast.error("There was a problem with your registration. Please try again.");
    }
  };

  const handleCreateBudget = (values) => {
    try {
      const newBudgets = createBudget(values);
      setBudgets(newBudgets);
      toast.success("Budget created successfully");
    } catch (e) {
      toast.error("There was a problem with your budget creation. Please try again.");
    }
  };

  const handleCreateTransaction = (values) => {
    try {
      const newTransactions = createTransaction(values);
      setTransactions(newTransactions);
      toast.success(`Transaction ${values.newTransactionName} created!`);
    } catch (e) {
      toast.error("There was a problem with your transaction creation. Please try again.");
    }
  };

  const handleDeleteTransaction = (transactionId) => {
    try {
      const newTransactions = deleteItem({
        key: "transactions",
        id: transactionId
      });
      setTransactions(newTransactions);
      toast.success("Transaction deleted!");
    } catch (e) {
      toast.error("There was a problem with your transaction deletion. Please try again.");
    }
  };

  return (
    <Main>
      {userName ? (
        <div className="dashboard">
          <h1>Welcome back, <span className="accent">{userName}</span></h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm onCreateBudget={handleCreateBudget} />
                  <AddTransactionForm 
                    budgets={budgets} 
                    onCreateTransaction={handleCreateTransaction} 
                  />
                </div>
                <h2>Existing Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetProfile key={budget.id} budget={budget} />
                  ))}
                </div>
                {transactions && transactions.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Transactions</h2>
                    <Table 
                      transactions={transactions
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0,5)
                      } 
                      onDeleteTransaction={handleDeleteTransaction}
                    />
                    {transactions.length > 5 && (
                      <Link href="/transactions" className="btn btn--dark">
                        View All Transactions
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Create a budget to get started!</p>
                <AddBudgetForm onCreateBudget={handleCreateBudget} />
              </div>
            )}
          </div>
        </div>
      ) : <Register onRegister={handleNewUser} />}
    </Main>
  );
}