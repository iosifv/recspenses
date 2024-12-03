import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { expense } = body

  return executeWithTryCatch(async () => {
    await api.expense.createMine({ expense: JSON.stringify(expense) })
  })
}
