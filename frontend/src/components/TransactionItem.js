import { useState, useEffect } from "react";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/20/solid";
import { formatCurrency, formatDate } from "../helpers";
import { Link } from "react-router-dom";

const TransactionItem = ({ transaction, showBudget = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(transaction.name);
  const [editedAmount, setEditedAmount] = useState(transaction.amount);
  const [budget, setBudget] = useState(null);

  // ✅ Fetch the budget from backend if needed
  useEffect(() => {
    if (showBudget && transaction.budgetId) {
      fetch(`http://localhost:8080/api/budgets`)
        .then((res) => res.json())
        .then((data) => {
          const match = data.find((b) => b.id === transaction.budgetId);
          setBudget(match);
        })
        .catch((err) => console.error("Failed to fetch budget:", err));
    }
  }, [transaction]);

  const handleUpdate = () => {
    // 🔄 call backend update endpoint (you can add this if needed)
    alert("Edit functionality not implemented.");
    setIsEditing(false);
  };

  const handleDelete = () => {
    // 🔄 call backend delete endpoint
    fetch(`http://localhost:8080/api/transactions/${transaction.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Transaction deleted");
        } else {
          alert("Failed to delete transaction");
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="edit-input"
            required
          />
        ) : (
          transaction.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
            className="edit-input"
            step="0.01"
            min="0.01"
            required
          />
        ) : (
          formatCurrency(transaction.amount)
        )}
      </td>
      <td>{formatDate(transaction.createdAt)}</td>
      {showBudget && budget && (
        <td>
          <Link to={`/budget/${budget.id}`} style={{ "--accent": budget.color }}>
            {budget.name}
          </Link>
        </td>
      )}
      <td>
        <div className="flex-sm">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="btn btn--accent"
                title="Save"
              >
                <CheckIcon width={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(transaction.name);
                  setEditedAmount(transaction.amount);
                }}
                className="btn btn--warning"
                title="Cancel"
              >
                <XMarkIcon width={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn--dark"
                title="Edit"
              >
                <PencilIcon width={20} />
              </button>
              <button
                onClick={handleDelete}
                className="btn btn--warning"
                title="Delete"
              >
                <TrashIcon width={20} />
              </button>
              <button
                onClick={() => alert("Duplicate not implemented")}
                className="btn btn--dark"
                title="Duplicate"
              >
                <DocumentDuplicateIcon width={20} />
              </button>
            </>
          )}
        </div>
      </td>
    </>
  );
};

export default TransactionItem;
