import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { auth, currentUser } from "@clerk/nextjs/server"

export const clerkRouter = createTRPCRouter({
  getMe: publicProcedure.query(async ({}) => {
    const user = await currentUser()

    return user ?? null
  }),

  getMyId: publicProcedure.query(async ({}) => {
    const { userId } = auth()

    return userId ?? null
  }),
})
