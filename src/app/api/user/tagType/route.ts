import { NextResponse } from "next/server"
import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType, description, color } = body

  return executeWithTryCatch(async () => {
    await api.user.addTagType({
      newTagTypeName: tagType,
      newTagTypeDescription: description,
      newTagTypeColor: color,
    })
  })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { tagTypeId } = body

  return executeWithTryCatch(async () => {
    await api.user.deleteTagType({ existingTagTypeId: tagTypeId })
  })
}
