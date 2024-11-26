import { NextResponse } from "next/server"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType } = body

  try {
    await api.user.addTagType({ newTagTypeName: tagType })
    return NextResponse.json({ message: "success" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { tagTypeId } = body

  try {
    await api.user.deleteTagType({ existingTagTypeId: tagTypeId })
    return NextResponse.json({ message: "success" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
