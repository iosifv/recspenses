"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

import { ExpenseTagBadge } from "~/components/custom/ExpenseTagBadge"
import { FrontendExpense } from "~/types/FrontendExpenses"

interface DataTableProps {
  columns: ColumnDef<FrontendExpense, any>[]
  data: FrontendExpense[]
}

export function DataTable({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
              // console.log(row.original.id, row.id, row.original.name)
              return (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const rowTags = row.original.tags
                    // console.log(row.id)

                    return (
                      <TableCell key={cell.id}>
                        {cell.column.columnDef.header === "Tags"
                          ? rowTags.map((tag) => (
                              <ExpenseTagBadge
                                key={tag.id}
                                expenseId={row.original.id ?? 0}
                                tagId={tag.id}
                                tagName={tag.name}
                                canDelete={false}
                              />
                            ))
                          : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
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
