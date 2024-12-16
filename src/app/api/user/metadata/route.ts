import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  const body = await req.json()
  const { key, value } = body

  return executeWithTryCatch(async () => {
    await api.user.updateMetadata({ key: key, value: value })
  })
}
