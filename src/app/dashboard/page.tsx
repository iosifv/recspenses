import { api, HydrateClient } from "~/trpc/server"
import dynamic from "next/dynamic"

import { ChartConfig } from "~/components/ui/chart"
import { Expense } from "~/types/Expense"
import ComponentDashboard from "./ComponentDashboard"

// Move chart to client-side only
const DynamicChart = dynamic(() => import("./ComponentChart"), { ssr: false })

export default async function Dashboard() {
  const myExpenses = await api.expense.getMine()
  const currencyData = await api.fx.getAll()
  const myUser = await api.user.getMe()

  const myExpensesJson = JSON.stringify(myExpenses, null, 2)
  const currencyDataJson = JSON.stringify(currencyData, null, 2)

  const simplifiedExpenses = myExpenses.map((expense) => {
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
          currencyData={currencyData}
          myUser={myUser}
        />
      </main>
    </HydrateClient>
  )
}
