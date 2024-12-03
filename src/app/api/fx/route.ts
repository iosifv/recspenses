import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  return executeWithTryCatch(async () => {
    return await api.fx.getAll()
  })
}
