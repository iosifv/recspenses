import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { users } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"

export const userRouter = createTRPCRouter({
  getMe: publicProcedure.query(async ({ ctx }) => {
    const userId = getUserId()

    try {
      const myUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.userId, userId),
      })

      return myUser
    } catch (error) {
      console.error("Database error:\n", error)
      throw error
    }
  }),
})
