import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PDFUploadPage from "./pages/PDFUploadPage";
import AddBudgetPage from "./pages/AddBudgetPage";           // 🆕
import AddTransactionPage from "./pages/AddTransactionPage"; // 🆕

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/upload-pdf" element={<PrivateRoute><PDFUploadPage /></PrivateRoute>} />

      {/* 🆕 New Routes Below */}
      <Route path="/add-budget" element={<PrivateRoute><AddBudgetPage /></PrivateRoute>} />
      <Route path="/add-transaction" element={<PrivateRoute><AddTransactionPage /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
