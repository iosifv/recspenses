import { object, z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { expenses } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"
import { eq } from "drizzle-orm"

import { DBExpense, Expense } from "~/types/recspensesTypes"
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

  deleteMine: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = getUserId()

      await ctx.db.delete(expenses).where(eq(expenses.id, input.id))
    }),

  getMine: publicProcedure.query<Expense[]>(async ({ ctx }) => {
    const user = await touchUser()

    const dbExpenses = await ctx.db.query.expenses.findMany({
      where: (expense: DBExpense, { eq }) => eq(expense.userId, user.userId),
      // orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
    })

    let expenses: Expense[] = []

    dbExpenses.forEach((dbExpense: DBExpense) => {
      expenses.push(new Expense(user, dbExpense))
    })

    console.log("expensessss", expenses)

    return expenses
  }),
})
