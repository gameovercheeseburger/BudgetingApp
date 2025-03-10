import React from "react";
import { Link } from "react-router-dom";
import BudgetPage from "./BudgetPage";
import TransactionsPage from "./TransactionsPage";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function DashboardPage() {
  const { logout } = useContext(AuthContext);
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <BudgetPage />
      <TransactionsPage />
    </div>
  );
}

export default DashboardPage;