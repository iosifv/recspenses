"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
  {
    accessorKey: "tags",
    header: "Tags",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "original",
    header: "Original",
  },
  {
    accessorKey: "transformed",
    header: "Transformed",
  },
]
