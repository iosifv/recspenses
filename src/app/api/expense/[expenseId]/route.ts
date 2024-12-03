import { api } from "~/trpc/server"
import { executeWithTryCatch, getExpenseId } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function DELETE(req: Request) {
  const expenseId = getExpenseId(req)

  return executeWithTryCatch(async () => {
    await api.expense.deleteMine({ id: expenseId })
  })
}

export async function PUT(req: Request) {
  const expenseId = getExpenseId(req)
  const body = await req.json()
  const { expense } = body

  return executeWithTryCatch(async () => {
    await api.expense.updateMine({ id: expenseId, expense: JSON.stringify(expense) })
  })
}
