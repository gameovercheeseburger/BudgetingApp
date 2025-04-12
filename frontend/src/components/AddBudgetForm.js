'use client';

import { CurrencyDollarIcon } from '@heroicons/react/20/solid';
import { useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createBudget } from '../actions/budgetActions';

const AddBudgetForm = () => {
  const [state, formAction] = useFormState(createBudget, null);
  const { pending } = useFormStatus();
  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!pending) {
      formRef.current?.reset();
      focusRef.current?.focus();
    }
  }, [pending]);

  return (
    <div className="form-wrapper border border-gray-200 p-4">
      <h2>Create Budget Profile</h2>
      <form action={formAction} className="grid-sm" ref={formRef}>
        <div className="grid-xs">
          <label htmlFor="newBudgetName">Budget Profile Name</label>
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
            min="0.01"
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn--dark"
          disabled={pending}
        >
          {pending ? 
            <span>Creating...</span> 
          : (
            <>
              <span>Create Budget</span>
              <CurrencyDollarIcon width={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBudgetForm;