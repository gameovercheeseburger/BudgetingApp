import React from "react";
import AddBudgetForm from "../components/AddBudgetForm";

const AddBudgetPage = () => {
  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>➕ Add a New Budget</h2>
      <AddBudgetForm />
    </div>
  );
};

export default AddBudgetPage;
