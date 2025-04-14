import { CurrencyDollarIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef } from 'react';

const AddBudgetForm = ({ updateBudgets }) => {
  const formRef = useRef()
  const focusRef = useRef() // move cursor to name, not amount

  const addBudget = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const category = formData.get('newBudgetName');
    const amount = formData.get('newBudgetAmount');

    const response = await fetch("http://localhost:8080/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount })
    });
    if (response.ok) {
      const newBudget = { category, amount };
      updateBudgets(newBudget);
      formRef.current.reset();
      focusRef.current.focus();
    }
  };

  useEffect(() => {
    if (formRef.current) {
      focusRef.current.focus();
    }
  }, []);

  return (
    <div className="form-wrapper border border-gray-200 p-4">
      <h2>Create Budget Profile</h2>
      <form onSubmit={addBudget} ref={formRef}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Profile Name</label>
          <input 
            type="text" 
            name="newBudgetName"
            id="newBudgetName"
            placeholder="Enter budget name"
            required
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input 
            type="number"
            step="0.01" 
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="Enter budget amount"
            inputMode="decimal"
            min = "0.01"
            required
          />
        </div>
        <input type="hidden" name="_action" value="createBudget" />
        <button 
          type="submit"
        >
          Create Budget
          <CurrencyDollarIcon width={20} />
        </button>
      </form>
    </div>
  )
}

export default AddBudgetForm;
