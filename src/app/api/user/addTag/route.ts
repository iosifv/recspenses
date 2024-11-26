import { NextResponse } from "next/server"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json()
  const { tagType, tag } = body
  
  console.log("    =====>    body", body)
  console.log("    =====>    tagType", { tag: tag, type: tagType })
  
  await api.user.addTag({ tag: tag, type: tagType })

  return NextResponse.json({ message: "success" })
}
