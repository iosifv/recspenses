import { NextResponse } from "next/server"
import { api } from "~/trpc/server"
import { executeWithTryCatch } from "~/lib/appApiUtils"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType } = body

  return executeWithTryCatch(async () => {
    await api.user.addTagType({ newTagTypeName: tagType })
  })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { tagTypeId } = body

  return executeWithTryCatch(async () => {
    await api.user.deleteTagType({ existingTagTypeId: tagTypeId })
  })
}
