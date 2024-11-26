import { NextResponse } from "next/server"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType, tag } = body

  await api.user.addTag({ newTagName: tag, existingTagType: tagType })

  return NextResponse.json({ message: "success" })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { tagId } = body

  try {
    await api.user.deleteTag({ existingTagId: tagId })

    return NextResponse.json({ message: "success" })
  } catch (error) {
    console.error(" error:\n")
  }
}
