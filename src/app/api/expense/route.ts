import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

// export async function POST(req: Request) {
//   const body = await req.json()
//   const { tagType, tag } = body

//   return executeWithTryCatch(async () => {
//     await api.user.addTag({ newTagName: tag, existingTagType: tagType })
//   })
// }

export async function PUT(req: Request) {
  const body = await req.json()
  const { expense } = body

  return executeWithTryCatch(async () => {
    await api.expense.updateMine({ expense: JSON.stringify(expense) })
  })
}
