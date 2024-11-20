import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { users } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"
import { eq } from "drizzle-orm"

export const userRouter = createTRPCRouter({
  getMe: publicProcedure.query(async ({ ctx }) => {
    const userId = getUserId()

    try {
      const myUser = await ctx.db.query.users.findFirst({
        where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
      })

      return myUser
    } catch (error) {
      console.error("Database error:\n", error)
      throw error
    }
  }),
  updateMyTagTypes: publicProcedure.input(z.array(z.string())).mutation(async ({ ctx, input }) => {
    const userId = getUserId()
    await ctx.db.update(users).set({ tagTypes: input }).where(eq(users.userId, userId))
  }),
  updateMyTags: publicProcedure.input(z.array(z.string())).mutation(async ({ ctx, input }) => {
    const userId = getUserId()
    await ctx.db.update(users).set({ tags: input }).where(eq(users.userId, userId))
  }),
  addTag: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userId = getUserId()

    try {
      const myUser = await ctx.db.query.users.findFirst({
        where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
      })

      console.log("myUsers tags", myUser.tags)
      myUser.tags.push(input)
      await ctx.db.update(users).set({ tags: myUser.tags }).where(eq(users.userId, userId))

      console.log("myUsers tags", myUser.tags)

      return myUser
    } catch (error) {
      console.error("Database error:\n", error)
      throw error
    }
  }),
  addTagType: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userId = getUserId()

    try {
      const myUser = await ctx.db.query.users.findFirst({
        where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
      })

      console.log("myUsers tagTypes", myUser.tagTypes)
      myUser.tagTypes.push(input)
      await ctx.db.update(users).set({ tagTypes: myUser.tagTypes }).where(eq(users.userId, userId))

      console.log("myUsers tagTypes", myUser.tagTypes)

      return myUser
    } catch (error) {
      console.error("Database error:\n", error)
      throw error
    }
  }),
})
