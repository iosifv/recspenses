import { api } from "~/trpc/server"
import { executeWithTryCatch, getExpenseIdAndTagId } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function DELETE(req: Request) {
  const { expenseId, tagId } = getExpenseIdAndTagId(req)

  return executeWithTryCatch(async () => {
    await api.expense.removeMyTag({ expenseId: expenseId, tagId: tagId })
  })
}
