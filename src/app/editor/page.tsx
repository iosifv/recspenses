import { api, HydrateClient } from "~/trpc/server"
import { ExpenseForm } from "./ExpenseForm"

export default async function Dashboard() {
  const mine = await api.expense.getMine()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1>

          <div className="flex flex-col items-center gap-2">
            {mine.map((item, index) => (
              <p className="text-2xl text-white" key={index}>
                {item.userId}
              </p>
            ))}
          </div>

          <ExpenseForm />
        
        </div>
      </main>
    </HydrateClient>
  )
}
