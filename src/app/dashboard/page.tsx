import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "../_components/ExpenseTable"
import type { Expense } from "~/types/expense"

export default async function Dashboard() {
  const myExpenses = (await api.expense.getMine()) as Expense[]

  void api.expense.getMine.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">dashboard</h1>

          <ExpenseTable expenses={myExpenses} />
        </div>
      </main>
    </HydrateClient>
  )
}
