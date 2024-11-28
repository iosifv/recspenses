"use client"

import { Trash2 } from "lucide-react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { api } from "~/trpc/react"
import { Expense } from "~/types/Expense"
import { ExpenseTagBadge } from "~/components/custom/ExpenseTagBadge"

interface DataTableProps {
  columns: ColumnDef<Expense, any>[]
  data: Expense[]
}

export function DataTable({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const deleteMutation = api.expense.deleteMine.useMutation()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              // console.log(row.original)
              return (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const rowTags = row.original.tags
                    // console.log(rowTags)

                    return (
                      <TableCell key={cell.id}>
                        {cell.column.columnDef.header === "Tags"
                          ? rowTags.map((tag) => (
                              <ExpenseTagBadge
                                expenseId={row.original.id}
                                tagId={tag.id}
                                tagName={tag.name}
                              />
                            ))
                          : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="p-2"
                      onClick={() => {
                        // alert("Are you sure you want to delete this expense?")
                        deleteMutation.mutate({
                          id: row.original.id,
                        })
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
