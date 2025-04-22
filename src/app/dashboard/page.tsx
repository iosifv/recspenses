"use server"

import { api, HydrateClient } from "~/trpc/server"
import ComponentDashboard from "./ComponentDashboard"
import { Expense } from "~/types/Expense"

export default async function Dashboard() {
  const myUser = await api.user.getMe()
  const myExpenses = (await api.expense.getMine()) as Expense[]
  const fxData = await api.fx.getLatest()

  const plainExpenses = myExpenses.map((expense: Expense) => expense.toPlainObject())
  const plainUser = myUser.toPlainObject()

  console.dir(plainUser, { depth: null })
  console.dir(plainExpenses, { depth: null })
  console.dir(fxData, { depth: null })

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <ComponentDashboard plainExpenses={plainExpenses} fxData={fxData} plainUser={plainUser} />
      </main>
    </HydrateClient>
  )
}
