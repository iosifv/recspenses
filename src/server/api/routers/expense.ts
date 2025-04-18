import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { expenses } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"
import { eq } from "drizzle-orm"
import { DBExpense, Expense, SimplifiedExpense } from "~/types/Expense"

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
      const userId = await getUserId()
      const expenseData = JSON.parse(input.expense)

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
      const userId = await getUserId()
      const expense = await ctx.db.query.expenses.findFirst({
        where: (expenses, { eq }) => eq(expenses.id, input.id),
      })
      console.log("expense", expense)
      console.log("userId", userId)
      if (!expense) {
        throw new Error("Expense not found")
      }
      if (expense.userId !== userId) {
        throw new Error("You are not authorized to delete this expense")
      }

      // await ctx.db.delete(expenses).where(eq(expenses.id, input.id))
    }),

  updateMine: publicProcedure
    .input(z.object({ id: z.number(), expense: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = await getUserId()
      const expenseData = JSON.parse(input.expense)

      const dbExpense = await ctx.db.query.expenses.findFirst({
        where: (expense: DBExpense, { eq }) => eq(expense.id, input.id),
      })

      if (!dbExpense) {
        throw new Error("Expense not found")
      }

      if (dbExpense.userId !== userId) {
        throw new Error("You are not authorized to edit this expense")
      }

      dbExpense.name = expenseData.name
      dbExpense.amount = expenseData.amount
      dbExpense.currency = expenseData.currency
      dbExpense.frequency = expenseData.frequency
      dbExpense.tags = expenseData.tags

      await ctx.db.update(expenses).set(dbExpense).where(eq(expenses.id, input.id))
    }),

  getMine: publicProcedure.query<Expense[]>(async ({ ctx }) => {
    const user = await touchUser()
   
    const dbExpenses = await ctx.db.query.expenses.findMany({
      where: (expense: DBExpense, { eq }) => eq(expense.userId, user.userId),
      orderBy: (expenses, { asc }) => [asc(expenses.name)],
    })

    let expenses: Expense[] = []
    dbExpenses.forEach((dbExpense: DBExpense) => {
      const newExpense = new Expense(user, dbExpense)
      expenses.push(newExpense)
    })

    return expenses
  }),



  /**
   * @deprecated
   */
  getMineSimple: publicProcedure.query<SimplifiedExpense[]>(async ({ ctx }) => {
    const user = await touchUser()

    const dbExpenses = await ctx.db.query.expenses.findMany({
      where: (expense: DBExpense, { eq }) => eq(expense.userId, user.userId),
      orderBy: (expenses, { asc }) => [asc(expenses.name)],
    })

    let simplifiedExpenses: SimplifiedExpense[] = []

    dbExpenses.forEach((dbExpense: DBExpense) => {
      const newExpense = new Expense(user, dbExpense)
      const se = newExpense.toSimplifiedExpense()
      simplifiedExpenses.push(se)
    })

    return simplifiedExpenses
  }),

  removeMyTag: publicProcedure
    .input(z.object({ expenseId: z.number(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = await getUserId()

      const dbExpense = await ctx.db.query.expenses.findFirst({
        where: (expense: DBExpense, { eq }) => eq(expense.id, input.expenseId),
      })

      console.log("dbExpense", dbExpense)

      console.log("dbExpense.tags =>", dbExpense.tags)
      dbExpense.tags = dbExpense.tags.filter((tagId: string) => tagId !== input.tagId)

      console.log("dbExpense.tags =>", dbExpense.tags)
      await ctx.db
        .update(expenses)
        .set({ tags: dbExpense.tags })
        .where(eq(expenses.id, input.expenseId))

      return dbExpense
    }),
})
