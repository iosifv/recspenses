import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "../_components/ExpenseTable"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function Dashboard() {
  const myExpenses = await api.expense.getMine()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1>

          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={myExpenses} />
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
