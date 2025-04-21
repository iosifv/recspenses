"use server"

import { api, HydrateClient } from "~/trpc/server"
import ComponentDashboard from "./ComponentDashboard"
import { Expense } from "~/types/Expense"

export default async function Dashboard() {
  const myExpenses = (await api.expense.getMine()) as Expense[]
  const myUser = await api.user.getMe()
  const fxData = await api.fx.getLatest()

  const plainExpenses = myExpenses.map((expense: Expense) => expense.toPlainObject())
  const plainUser = myUser.toPlainObject()

  // console.dir(expenseData, { depth: null })
  // console.dir(fxData, { depth: null })
  // console.dir(userData, { depth: null })

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <ComponentDashboard plainExpenses={plainExpenses} fxData={fxData} plainUser={plainUser} />
      </main>
    </HydrateClient>
  )
}
