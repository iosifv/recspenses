import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { expenses } from "~/server/db/schema"

export const expenseRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(z.object({ userId: z.string(), expense: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(expenses).values({
  //       userId: input.userId,
  //       expense: input.expense,
  //     })
  //   }),

  createMine: publicProcedure
    .input(z.object({ expense: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = auth()
      if (!userId) {
        throw new Error("Not logged in")
      }
      await ctx.db.insert(expenses).values({
        userId: userId,
        name: "asb",
        currency: "USD",
        amount: 77,
        frequency: "monthly",
        extra: "{}",
      })
    }),

  getMine: publicProcedure.query(async ({ ctx }) => {
    const { userId } = auth()
    if (!userId) {
      throw new Error("Not logged in")
    }

    //test userid
    console.log(userId)

    const expense = await ctx.db.query.expenses.findMany({
      where: (expenses, { eq }) => eq(expenses.userId, userId),
      // orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
    })

    return expense ?? null
  }),
})
