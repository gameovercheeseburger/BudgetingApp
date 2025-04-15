import React, { useContext } from "react";
import { Link } from "react-router-dom";
import BudgetPage from "./BudgetPage";
import TransactionsPage from "./TransactionsPage";
import AuthContext from "../context/AuthContext";

function DashboardPage() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container" style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📊 Welcome to Your Budget Dashboard</h2>
        <button onClick={logout} style={styles.logoutButton}>Logout</button>
      </div>

      <div className="dashboard-actions" style={styles.actions}>
        <button style={styles.actionButton}>
          <Link to="/add-budget" style={styles.link}>➕ Add Budget</Link>
        </button>
        <button style={styles.actionButton}>
          <Link to="/add-transaction" style={styles.link}>💸 Add Transaction</Link>
        </button>
      </div>

      <div className="dashboard-section" style={styles.section}>
        <h3>💼 Budgets</h3>
        <BudgetPage />
      </div>

      <div className="dashboard-section" style={styles.section}>
        <h3>📄 Transactions</h3>
        <TransactionsPage />
      </div>
    </div>
  );
}

const styles = {
  logoutButton: {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer"
  },
  actions: {
    display: "flex",
    gap: "1rem",
    margin: "1rem 0"
  },
  actionButton: {
    backgroundColor: "#1d3557",
    border: "none",
    padding: "0.75rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  },
  section: {
    marginTop: "2rem"
  }
};

export default DashboardPage;
