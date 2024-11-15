import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { expenses } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"

export const expenseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ userId: z.string(), expense: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const expenseData = JSON.parse(input.expense)

      await ctx.db.insert(expenses).values({
        userId: input.userId,
        name: expenseData.name,
        currency: expenseData.currency,
        amount: parseInt(expenseData.amount),
        frequency: expenseData.frequency,
        extra: {}, // Will use schema default
      })
    }),

  // Todo: make this function call the create function above
  createMine: publicProcedure
    .input(z.object({ expense: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()
      const expenseData = JSON.parse(input.expense)

      // console.log(expenseData)

      await ctx.db.insert(expenses).values({
        userId: userId,
        name: expenseData.name,
        currency: expenseData.currency,
        amount: parseInt(expenseData.amount),
        frequency: expenseData.frequency,
        extra: {}, // Will use schema default
      })
    }),
  getMine: publicProcedure.query(async ({ ctx }) => {
    const userId = await touchUser()

    const expense = await ctx.db.query.expenses.findMany({
      where: (expenses, { eq }) => eq(expenses.userId, userId),
      // orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
    })

    return expense ?? null
  }),

  // deleteMine: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { userId } = auth()
  //     if (!userId) {
  //       throw new Error("Not logged in")
  //     }

  //     await ctx.db.delete(expenses).where(eq(expenses.id, input.id))
  //   }),
})
