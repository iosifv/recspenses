import { NextResponse } from "next/server"
import { api } from "~/trpc/server"

export const dynamic = "force-dynamic"

// A faulty API route to test Sentry's error monitoring
export async function POST(req: Request) {
  const body = await req.json()
  const { tagType } = body
  console.log("    =>    body", body)
  await api.user.addTagType(tagType)

  return NextResponse.json({ message: "success" })
}
