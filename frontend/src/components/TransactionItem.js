'use client';

import { useState } from "react";
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon, DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { formatCurrency, formatDate, getAllMatchingItems } from "../helpers";
import Link from "next/link";
import { deleteTransaction, editTransaction, duplicateTransaction } from "../actions/transactionActions";

const TransactionItem = ({ transaction, showBudget = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(transaction.name);
  const [editedAmount, setEditedAmount] = useState(transaction.amount);
  
  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: transaction.budgetId
  })[0];

  const handleEditSubmit = async () => {
    await editTransaction({
      transactionId: transaction.id,
      newName: editedName,
      newAmount: editedAmount
    });
    setIsEditing(false);
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
      {showBudget && (
        <td>
          <Link
            href={`/budget/${budget.id}`}
            style={{ "--accent": budget.color }}
            className="text-accent hover:underline"
          >
            {budget.name}
          </Link>
        </td>
      )}
      <td>
        <div className="flex-sm">
          {isEditing ? (
            <>
              <button
                onClick={handleEditSubmit}
                className="btn btn--accent"
              >
                <CheckIcon width={20} />
              </button>
              <button
                className="btn btn--warning"
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(transaction.name);
                  setEditedAmount(transaction.amount);
                }}
              >
                <XMarkIcon width={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn--dark"
              >
                <PencilIcon width={20} />
              </button>
              <button
                onClick={() => duplicateTransaction(transaction.id)}
                className="btn btn--dark"
              >
                <DocumentDuplicateIcon width={20} />
              </button>
            </>
          )}
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="btn btn--warning"
          >
            <TrashIcon width={20} />
          </button>
        </div>
      </td>
    </>
  );
};

export default TransactionItem;