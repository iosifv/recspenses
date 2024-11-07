import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "../_components/ExpenseTable"
import type { Expense } from "~/types/expense"
import dynamic from "next/dynamic"

import { ChartConfig, ChartContainer } from "~/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

// Move chart to client-side only
const DynamicChart = dynamic(() => import("../_components/Chart"), { ssr: false })

export default async function Dashboard() {
  const myExpenses = (await api.expense.getMine()) as Expense[]

  void api.expense.getMine.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">dashboard</h1>
          <DynamicChart data={chartData} config={chartConfig} />
          <ExpenseTable expenses={myExpenses} />
        </div>
      </main>
    </HydrateClient>
  )
}
