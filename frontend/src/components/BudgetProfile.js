import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatPercentage
} from "../helpers";
import {
  BanknotesIcon,
  TrashIcon,
  PencilIcon
} from "@heroicons/react/20/solid";
import { useState } from "react";

const BudgetProfile = ({ budget, showDelete = false, onUpdate, onDelete }) => {
  const { id, name, amount, color } = budget;
  const [newAmount, setNewAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Dummy spent logic (replace with actual)
  const spent = budget.spent || 0;
  const remaining = amount - spent;
  const percentage = spent / amount;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newAmount || isNaN(newAmount)) return;

    const response = await fetch(`http://localhost:8080/api/budget/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(newAmount) }),
    });

    const result = await response.text();
    if (response.ok) {
      alert("✅ Budget updated!");
      onUpdate?.(); // optional callback
      setIsEditing(false);
    } else {
      alert("❌ Update failed: " + result);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    const response = await fetch(`http://localhost:8080/api/budget/${id}`, {
      method: "DELETE",
    });

    const result = await response.text();
    if (response.ok) {
      alert("🗑️ Budget deleted!");
      onDelete?.(); // optional callback
    } else {
      alert("❌ Delete failed: " + result);
    }
  };

  return (
    <div className="budget" style={{ "--accent": color }}>
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>

      <progress max={amount} value={spent}>
        {formatPercentage(percentage)}
      </progress>

      <div>
        {remaining < 0 ? (
          <div className="progress-text text-red-400">
            <small>{formatCurrency(spent)} spent</small>
            <small>{formatCurrency(-remaining)} over budget</small>
          </div>
        ) : (
          <div className="progress-text">
            <small>{formatCurrency(spent)} spent</small>
            <small>{formatCurrency(remaining)} remaining</small>
          </div>
        )}
      </div>

      <div className="flex-sm">
        {showDelete ? (
          <>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="flex-sm">
                <input
                  type="number"
                  placeholder="New amount"
                  step="0.01"
                  min="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="edit-input"
                  required
                />
                <button type="submit" className="btn btn--dark">
                  <span>Update</span>
                  <PencilIcon width={20} />
                </button>
              </form>
            ) : (
              <button
                className="btn btn--dark"
                onClick={() => setIsEditing(true)}
              >
                <span>Edit Amount</span>
                <PencilIcon width={20} />
              </button>
            )}

            <button className="btn btn--warning" onClick={handleDelete}>
              <span>Delete Budget</span>
              <TrashIcon width={20} />
            </button>
          </>
        ) : (
          <Link to={`/budget/${id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BudgetProfile;
