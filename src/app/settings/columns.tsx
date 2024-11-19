"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Expense } from "~/types/recspensesTypes"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "tagType",
    header: "Tag Type",
  },
  {
    accessorKey: "tag",
    header: "Tag",
  },
]
