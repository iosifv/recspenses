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
import { Expense } from "~/types/Expense"
import { User } from "~/types/User"
import { ExpenseTagBadge } from "~/components/custom/ExpenseTagBadge"
import ComponentDialogEdit from "./ComponentDialogEdit"
import ComponentDialogDelete from "./ComponentDialogDelete"
import ComponentTableRowNew from "./ComponentTableRowNew"

interface DataTableProps {
  columns: ColumnDef<Record<string, any>, any>[]
  data: Array<ReturnType<typeof Expense.prototype.toPlainObject>>
  user: ReturnType<typeof User.prototype.toPlainObject>
}

export function DataTable({ columns, data, user }: DataTableProps) {
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
              <TableHead style={{ justifyContent: "right" }}>Actions</TableHead>
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
                    // console.log("cell.id")

                    return (
                      <TableCell key={cell.id}>
                        {cell.column.columnDef.header === "Tags"
                          ? rowTags.map((tag) => (
                              <ExpenseTagBadge
                                key={tag.id}
                                expenseId={row.original.id ?? 0}
                                tagId={tag.id}
                                tagName={tag.name}
                                canDelete={true}
                                tagTypeColour={tag.type?.color}
                                tagColour={tag.color}
                              />
                            ))
                          : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <div style={{ display: "flex", justifyContent: "right" }}>
                      <ComponentDialogEdit row={row.original} user={user} />
                      <ComponentDialogDelete row={row.original} />
                    </div>
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
          {/* Create a new row for adding a new expense */}
          <ComponentTableRowNew />
        </TableBody>
      </Table>
    </div>
  )
}
