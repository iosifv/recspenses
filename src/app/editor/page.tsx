import { api, HydrateClient } from "~/trpc/server"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function Editor() {
  const myExpenses = await api.expense.getMine()

  console.log("myExpensessssssss", myExpenses[0].tags[0])

  const simplifiedExpenses = myExpenses.map((expense) => {
    return {
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      currency: expense.currency,
      frequency: expense.frequency,
      tags: expense.tags.map((tag) => tag.name),
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    }
  })

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1>

          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={simplifiedExpenses} />
          </div>

          <pre>{JSON.stringify(myExpenses, null, 2)}</pre>
          <pre>{JSON.stringify(myExpenses[0].tags[0], null, 2)}</pre>
        </div>
      </main>
    </HydrateClient>
  )
}
