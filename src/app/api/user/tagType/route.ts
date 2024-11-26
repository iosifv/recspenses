import { NextResponse } from "next/server"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType } = body

  await api.user.addTagType({ newTagTypeName: tagType })

  return NextResponse.json({ message: "success" })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { tagTypeId } = body

  try {
    await api.user.deleteTagType({ existingTagTypeId: tagTypeId })
    return NextResponse.json({ message: "success" }, { status: 200 })
  } catch (error: any) {
    console.error(" error in api/user/tagType/route.ts:\n")
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
    
}
