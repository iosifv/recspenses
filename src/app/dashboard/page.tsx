"use server"

import { api, HydrateClient } from "~/trpc/server"
import ComponentDashboard from "./ComponentDashboard"

export default async function Dashboard() {
  const expenseData = await api.expense.getMine()
  const fxData = await api.fx.getLatest()
  const userData = await api.user.getMe()

  // console.dir(expenseData, { depth: null })
  // console.dir(fxData, { depth: null })
  // console.dir(userData, { depth: null })

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <ComponentDashboard simplifiedExpenses={expenseData} fxData={fxData} userData={userData} />
      </main>
    </HydrateClient>
  )
}
