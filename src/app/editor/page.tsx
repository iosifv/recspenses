import { api, HydrateClient } from "~/trpc/server"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { Expense } from "~/types/Expense"

export default async function Editor() {
  const myExpenses = await api.expense.getMine()
  const myUser = await api.user.getMe()

  console.log("myExpenses", myExpenses)
  // If the return type is not already Expense[], we cast:
  const expenses = myExpenses as Expense[]

  const tableExpenses = expenses.map((expense: Expense) => expense.toFrontendExpense())

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center  bg-black text-white">
        <div className="container flex flex-col items-center  gap-12 px-4 py-6">
          {/* <h1 className="text-3xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1> */}

          <div className="container mx-auto py-10">
            <DataTable
              columns={columns}
              data={tableExpenses as unknown as any}
              user={myUser}
            />
          </div>

          {/* <pre>{JSON.stringify(myExpenses, null, 2)}</pre>
          <pre>{JSON.stringify(myExpenses[0]?.tags[0], null, 2)}</pre> */}
        </div>
      </main>
    </HydrateClient>
  )
}
