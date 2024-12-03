import { NextResponse } from "next/server"
import { d } from "node_modules/drizzle-kit/index-BfiZoTqG.mjs"

export const executeWithTryCatch = async (func: () => Promise<any>) => {
  try {
    const result = await func()
    return NextResponse.json({ message: "success", data: result })
  } catch (error: any) {
    console.error("An error occurred:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

/**
 *
 * @param req Assuming the structure is /api/expense/[expenseId]
 * @returns
 */
export function getExpenseId(req: Request): number {
  const { pathname } = new URL(req.url)
  return Number(pathname.split("/").pop())
}

/**
 * Assuming the structure is /api/expense/[expenseId]/tag/[tagId]
 *
 * @param req
 * @returns
 */
export function getExpenseIdAndTagId(req: Request): { expenseId: number; tagId: string } {
  const { pathname } = new URL(req.url)
  const segments = pathname.split("/")

  const expenseId = segments[segments.length - 3] // Get the expenseId
  const tagId = segments[segments.length - 1] // Get the tagId

  return { expenseId: Number(expenseId), tagId: String(tagId) }
}
