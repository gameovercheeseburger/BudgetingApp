'use server';

import { deleteItem } from "../helpers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logoutAction() {
  try {
    // delete user data
    deleteItem({ key: "userName" });
    deleteItem({ key: "budgets" });
    deleteItem({ key: "transactions" });

    // Clear cache and revalidate
    revalidatePath('/');
    
    // redirect to homepage
    return redirect("/");
  } catch (error) {
    throw new Error("Failed to logout");
  }
}