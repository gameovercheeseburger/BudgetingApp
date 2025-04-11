'use server';

import { deleteItem, getAllMatchingItems, fetchData } from "../helpers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteBudget(params) {
  try {
    deleteItem({
      key: "budgets", 
      id: params.id
    });

    const associatedTransactions = getAllMatchingItems({
      category: "transactions",
      key: "budgetId",
      value: params.id
    });

    associatedTransactions.forEach((transaction) => {
      deleteItem({
        key: "transactions",
        id: transaction.id
      });
    });

    revalidatePath('/');
    return redirect("/");
  } catch (e) {
    throw new Error("There was a problem deleting the Budget Profile.");
  }
}

export async function editBudgetAmount({ request, params }) {
  const formData = await request.formData();
  const { newAmount } = Object.fromEntries(formData);
  
  try {
    // update the budget amount
    const budgets = fetchData("budgets") || [];
    const updatedBudgets = budgets.map(budget => 
      budget.id === params.id
        ? { ...budget, amount: Number(newAmount) }
        : budget
    );
    
    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
    revalidatePath(`/budget/${params.id}`);
    return redirect(`/budget/${params.id}`);
  } catch (e) {
    throw new Error("There was a problem updating the budget amount.");
  }
}