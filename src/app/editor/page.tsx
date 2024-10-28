"use client"

import { useState } from "react"
// import { toast } from "sonner"
import { api, HydrateClient } from "~/trpc/server"
import { api as apiReact } from "~/trpc/react"
import { Expense, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Expense[]> {
  const mine = await api.expense.getMine()
  const expenses: Expense[] = mine.map((item, index) => {
    return {
      id: item.id,
      name: "asb",
      amount: 1030,
    }
  })

  return expenses
}

export default async function Dashboard() {
  const mine = await api.expense.getMine()
  console.log(mine)

  const utils = apiReact.useUtils()
  const [name, setName] = useState("")
  const createPost = apiReact.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate()
      setName("")
    },
  })

  function AddSvg() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    )
  }

  const data = await getData()

  void api.expense.getMine.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1>

          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
          </div>

          {/* Display the list of existing expenses */}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              createPost.mutate({ name })
            }}
            className="flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder="Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-full px-4 py-2 text-black"
            />
            <button
              type="submit"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
              disabled={createPost.isPending}
            >
              {createPost.isPending ? "Submitting..." : "Submit"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2">
            {mine.map((item, index) => {
              return (
                <p className="text-2xl text-white" key={index}>
                  {item.userId}
                </p>
              )
            })}
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
