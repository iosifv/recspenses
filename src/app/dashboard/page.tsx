import { api, HydrateClient } from "~/trpc/server"
import dynamic from "next/dynamic"

import ComponentDashboard from "./ComponentDashboard"

// Move chart to client-side only
const DynamicChart = dynamic(() => import("./ComponentChart"), { ssr: false })

export default async function Dashboard() {
  const expenseData = await api.expense.getMine()
  const fxData = await api.fx.getAll()
  const userData = await api.user.getMe()

  const simplifiedExpenses = expenseData.map((expense) => {
    return {
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      currency: expense.currency,
      frequency: expense.frequency,
      tags: expense.tags.map((tag) => ({ id: tag.id, name: tag.name })),
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    }
  })

  // void api.expense.getMine.prefetch()
  // void api.fx.getAll.prefetch()

  // console.log("myExpensesJson", myExpensesJson)
  // console.log("currencyDataJson", currencyDataJson)

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <ComponentDashboard
          simplifiedExpenses={simplifiedExpenses}
          fxData={fxData}
          userData={userData}
        />
      </main>
    </HydrateClient>
  )
}
