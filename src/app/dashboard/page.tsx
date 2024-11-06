import { api, HydrateClient } from "~/trpc/server"
import { ExpenseTable } from "../_components/ExpenseTable"
export default async function Dashboard() {
  const mine = await api.expense.getMine()
  console.log(mine)

  void api.expense.getMine.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">dashboard</h1>

           <ExpenseTable expenses={mine} />
        </div>
      </main>
    </HydrateClient>
  )
}
