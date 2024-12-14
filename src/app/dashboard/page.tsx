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

  const myExpensesJson = JSON.stringify(myExpenses, null, 2)
  const currencyDataJson = JSON.stringify(currencyData, null, 2)

  // void api.expense.getMine.prefetch()
  // void api.fx.getAll.prefetch()

  // console.log("myExpensesJson", myExpensesJson)
  // console.log("currencyDataJson", currencyDataJson)

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <ComponentDashboard myExpenses={myExpensesJson} currencyData={currencyData} />
      </main>
    </HydrateClient>
  )
}
