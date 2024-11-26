import { NextResponse } from "next/server"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType } = body

  await api.user.addTagType({ newTagTypeName: tagType })

  return NextResponse.json({ message: "success" })
}
