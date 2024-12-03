import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "./ComponentTableExpense"
import dynamic from "next/dynamic"

import { ChartConfig } from "~/components/ui/chart"
import { Expense } from "~/types/Expense"

// Move chart to client-side only
const DynamicChart = dynamic(() => import("./ComponentChart"), { ssr: false })

export default async function Dashboard() {
  const myExpenses = (await api.expense.getMine()) as Expense[]
  void api.expense.getMine.prefetch()
  const expenseChartData = myExpenses.map((expense) => {
    return {
      name: expense.name,
      amount: expense.amount,
      fill: `var(--color-${expense.name.toLowerCase()})`,
    }
  })
  const expenseChartConfig = myExpenses.reduce((acc, expense, index) => {
    return {
      ...acc,
      [expense.name.toLowerCase()]: {
        label: expense.name.toUpperCase(),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      },
    }
  }, {}) satisfies ChartConfig

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">dashboard</h1> */}
          <DynamicChart data={expenseChartData} config={expenseChartConfig} />
          <ExpenseTable expenses={myExpenses} />
        </div>
      </main>
    </HydrateClient>
  )
}
