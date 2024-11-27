import { NextResponse } from "next/server"

export const executeWithTryCatch = async (func: () => Promise<any>) => {
  try {
    const result = await func()
    return NextResponse.json({ message: "success" })
  } catch (error: any) {
    console.error("An error occurred:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
