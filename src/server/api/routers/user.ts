import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { users } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"
import { eq } from "drizzle-orm"
import { Tag, TagType } from "~/types/recspensesTypes"

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

  addTag: publicProcedure
    .input(z.object({ tag: z.string(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()

      try {
        const myUser = await ctx.db.query.users.findFirst({
          where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
        })

        console.log(" ===============> myUsers tags", myUser.tags)

        const newTag: Tag = {
          id: input.tag,
          name: input.tag,
          color: getRandomColor(),
          type: input.type,
        }

        myUser.tags.push(newTag)
        await ctx.db.update(users).set({ tags: myUser.tags }).where(eq(users.userId, userId))

        console.log("------------------> myUsers tags", myUser.tags)

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

      const newTagType: TagType = {
        id: input,
        name: input,
        color: getRandomColor(),
      }

      myUser.tagTypes.push(newTagType)
      await ctx.db.update(users).set({ tagTypes: myUser.tagTypes }).where(eq(users.userId, userId))

      return myUser
    } catch (error) {
      console.error("Database error:\n", error)
      throw error
    }
  }),
})

// Function to generate a random color in hex format
function getRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)
  return `#${randomColor}`
}
