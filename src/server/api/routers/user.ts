import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { users } from "~/server/db/schema"

export const userRouter = createTRPCRouter({
  initialize: publicProcedure.mutation(async ({ ctx }) => {
    const { userId } = auth()
    if (!userId) {
      throw new Error("Not logged in")
    }

    await ctx.db.insert(users).values({
      userId,
    })
  }),
  // getMine: publicProcedure.query(async ({ ctx }) => {
  //   const { userId } = auth()
  //   if (!userId) {
  //     throw new Error("Not logged in")
  //   }
  //   const expense = await ctx.db.query.expenses.findMany({
  //     where: (expenses, { eq }) => eq(expenses.userId, userId),
  //     // orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
  //   })
  //   return expense ?? null
  // }),
})
