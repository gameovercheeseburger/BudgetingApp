// Color Generator
export const generateRandomColour = (index = 0) => {
    return `${index * 34} 65% 50%`; // Adjust as needed
  };
  
  // Budget API helpers
  export const fetchBudgets = async () => {
    const res = await fetch("http://localhost:8080/api/budgets");
    return res.json();
  };
  
  export const createBudget = async ({ name, amount, userId }) => {
    const res = await fetch(`http://localhost:8080/api/budget/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: name, amount: parseFloat(amount) }),
    });
    return res.json();
  };
  
  // Transaction API helpers
  export const fetchTransactions = async () => {
    const res = await fetch("http://localhost:8080/api/transactions");
    return res.json();
  };
  
  export const createTransaction = async ({ budgetId, name, amount }) => {
    const res = await fetch("http://localhost:8080/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: name,
        amount: parseFloat(amount),
        budgetId: parseInt(budgetId),
      }),
    });
    return res.json();
  };
  
  export const deleteTransaction = async (id) => {
    const res = await fetch(`http://localhost:8080/api/transactions/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  };
  
  // Utility: Calculate spent by budget
  export const calculateSpentByBudget = async (budgetId) => {
    const all = await fetchTransactions();
    return all
      .filter((tx) => tx.budgetId === budgetId)
      .reduce((acc, tx) => acc + tx.amount, 0);
  };
  
  // Formatters
  export const formatCurrency = (amount) => {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    });
  };
  
  export const formatPercentage = (amount) => {
    return amount.toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 0,
    });
  };
  
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  