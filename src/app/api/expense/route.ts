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

// export async function DELETE(req: Request) {
//   const body = await req.json()
//   const { tagId } = body

//   return executeWithTryCatch(async () => {
//     await api.user.deleteTag({ existingTagId: tagId })
//   })
// }
