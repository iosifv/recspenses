import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "../_components/ExpenseTable"
import type { Expense } from "~/types/expense"
import dynamic from "next/dynamic"

import { ChartConfig } from "~/components/ui/chart"

const chartData = [
  { name: "chrome", amount: 275, fill: "var(--color-chrome)" },
  { name: "safari", amount: 200, fill: "var(--color-safari)" },
  { name: "firefox", amount: 187, fill: "var(--color-firefox)" },
  { name: "edge", amount: 173, fill: "var(--color-edge)" },
  { name: "other", amount: 90, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

// Move chart to client-side only
const DynamicChart = dynamic(() => import("~/app/_components/Chart"), { ssr: false })

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

  // console.log(expenseChartConfig)
  // console.log(expenseChartData)

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">dashboard</h1>
          <DynamicChart data={expenseChartData} config={expenseChartConfig} />
          <ExpenseTable expenses={myExpenses} />
        </div>
      </main>
    </HydrateClient>
  )
}
