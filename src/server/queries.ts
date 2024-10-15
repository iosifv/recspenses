// This file is not used in the app, but is used by the tRPC server
// import server-only to prevent this file from being imported in the browser
import "server-only"
import { db } from "./db"

export async function getExpenses() {
  const expenses = await db.query.expenses.findMany()

  return expenses
}
