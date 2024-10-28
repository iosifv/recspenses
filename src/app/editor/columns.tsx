"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

// export const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "amount",
//     header: "Amount",
//   },
// ]

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  id: number
  name: string
  amount: number
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  // {
  //   accessorKey: "currency",
  //   header: "Currency",
  // },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
