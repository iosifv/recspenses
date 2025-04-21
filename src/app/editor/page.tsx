import { api, HydrateClient } from "~/trpc/server"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { Expense } from "~/types/Expense"
import type { User } from "~/types/User"

export default async function Editor() {
  const myExpenses = (await api.expense.getMine()) as Expense[]
  const myUser = await api.user.getMe()
  const plainExpenses = myExpenses.map((expense: Expense) => expense.toPlainObject())
  const plainUser = myUser.toPlainObject()

  // console.log("myExpenses", myExpenses)
  // console.log("myUser", myUser)
  // console.log("plainExpenses", plainExpenses)
  // console.log("plainUser", plainUser)

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center  bg-black text-white">
        <div className="container flex flex-col items-center  gap-12 px-4 py-6">
          {/* <h1 className="text-3xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1> */}

          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={plainExpenses} user={plainUser} />
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
