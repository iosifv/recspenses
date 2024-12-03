import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url)
  const expenseId = Number(pathname.split("/").pop()) // Extracting the expenseId from the URL

  return executeWithTryCatch(async () => {
    await api.expense.deleteMine({ id: expenseId })
  })
}
