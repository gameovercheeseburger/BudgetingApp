import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./DashboardPage.css";

function DashboardPage() {
  const { logout, user } = useContext(AuthContext);
  console.log("User object from context:", user);

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBudget, setNewBudget] = useState(null);  // Added state to track new budget creation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch budgets with remaining amounts
        const budgetsResponse = await fetch(`/api/budgets/user/${user.id}`);
        const budgetsData = await budgetsResponse.json();
        
        // Fetch recent transactions
        const transactionsResponse = await fetch(`/api/transactions?userId=${user.id}&limit=5`);
        const transactionsData = await transactionsResponse.json();
        
        setBudgets(budgetsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, newBudget]);  // Trigger refetch when newBudget state changes

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateBudget = async (newBudgetData) => {
    try {
      const response = await fetch(`/api/budgets?userId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBudgetData),
      });

      if (response.ok) {
        const createdBudget = await response.json();
        setNewBudget(createdBudget);  // Set new budget state to trigger refetch
        navigate("/dashboard");  // Optionally navigate back to the dashboard after creation
      } else {
        alert("Error creating budget");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      alert("Error creating budget");
    }
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💰 Budget Dashboard</h1>
          <div className="user-welcome">
            <span>Hello, {user.name || user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Link to="/add-budget" className="action-btn">
          <span className="btn-icon">➕</span> Create Budget
        </Link>
        <Link to="/add-transaction" className="action-btn">
          <span className="btn-icon">💸</span> Add Transaction
        </Link>
      </div>

      {/* Budget Summary */}
      <section className="dashboard-section">
        <h2>📊 Your Budgets</h2>
        {budgets.length === 0 ? (
          <div className="empty-state">
            <p>No budgets yet. Create your first budget to get started!</p>
          </div>
        ) : (
          <div className="budget-grid">
            {budgets.map((budget) => {
              const percentage = (budget.remainingAmount / budget.amount) * 100;
              const progressColor = 
                percentage < 20 ? '#e63946' : 
                percentage < 50 ? '#ffbe0b' : '#2a9d8f';

              return (
                <div key={budget.id} className="budget-card">
                  <h3>{budget.category}</h3>
                  <div className="progress-container">
                    <div 
                      className="progress-bar"
                      style={{
                        '--progress': `${percentage}%`,
                        '--color': progressColor
                      }}
                    >
                      <span>{Math.round(percentage)}%</span>
                    </div>
                  </div>
                  <div className="budget-numbers">
                    <p>Total: <span>${budget.amount.toFixed(2)}</span></p>
                    <p>Remaining: <span>${budget.remainingAmount.toFixed(2)}</span></p>
                  </div>
                  <Link 
                    to={`/transactions?budget=${budget.id}`} 
                    className="view-transactions"
                  >
                    View Transactions
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="dashboard-section">
        <h2>⏳ Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet. Add your first transaction!</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-main">
                  <span className="transaction-description">
                    {transaction.description}
                  </span>
                  <span className="transaction-amount">
                    -${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="transaction-meta">
                  <span className="transaction-category">
                    {budgets.find(b => b.id === transaction.budgetId)?.category || 'Uncategorized'}
                  </span>
                  <span className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
