import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "../_components/ExpenseTable"
import type { Expense } from "~/types/expense"
import dynamic from "next/dynamic"

import { ChartConfig } from "~/components/ui/chart"

// Move chart to client-side only
const DynamicChart = dynamic(() => import("~/app/_components/Chart"), { ssr: false })

export default async function Settings() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">Settings</h1>
        </div>
      </main>
    </HydrateClient>
  )
}
