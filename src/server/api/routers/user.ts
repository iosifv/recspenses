import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { users } from "~/server/db/schema"
import { getUserId, touchUser } from "~/server/controller/clerkController"
import { eq } from "drizzle-orm"
import { Tag, TagType } from "~/types/recspensesTypes"
import { generateUniqueId, getRandomColour } from "~/server/api/utils/routeUtils"

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
    .input(z.object({ newTagName: z.string(), existingTagType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()

      try {
        const myUser = await ctx.db.query.users.findFirst({
          where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
        })

        const newTag: Tag = {
          id: generateUniqueId(input.newTagName),
          name: input.newTagName,
          color: getRandomColour(),
          type: input.existingTagType,
        }

        myUser.tags.push(newTag)
        await ctx.db.update(users).set({ tags: myUser.tags }).where(eq(users.userId, userId))

        return myUser
      } catch (error) {
        console.error("Database error:\n", error)
        throw error
      }
    }),

  deleteTag: publicProcedure
    .input(z.object({ existingTagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()

      try {
        const myUser = await ctx.db.query.users.findFirst({
          where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
        })

        myUser.tags = myUser.tags.filter((tag: Tag) => tag.id !== input.existingTagId)
        await ctx.db.update(users).set({ tags: myUser.tags }).where(eq(users.userId, userId))

        return myUser
      } catch (error) {
        console.error("Database error:\n", error)
        throw error
      }
    }),

  addTagType: publicProcedure
    .input(z.object({ newTagTypeName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()

      try {
        const myUser = await ctx.db.query.users.findFirst({
          where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
        })

        const newTagType: TagType = {
          id: generateUniqueId(input.newTagTypeName),
          name: input.newTagTypeName,
          color: getRandomColour(),
        }

        myUser.tagTypes.push(newTagType)
        await ctx.db
          .update(users)
          .set({ tagTypes: myUser.tagTypes })
          .where(eq(users.userId, userId))

        return myUser
      } catch (error) {
        console.error("Database error:\n", error)
        throw error
      }
    }),

  deleteTagType: publicProcedure
    .input(z.object({ existingTagTypeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()

      try {
        const myUser = await ctx.db.query.users.findFirst({
          where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
        })

        const tagsUsingTagType = myUser.tags.filter(
          (tag: Tag) => tag.type === input.existingTagTypeId,
        )

        console.log("tagsUsingTagType", tagsUsingTagType)

        if (tagsUsingTagType.length > 0) {
          throw new Error(
            `Can not delete Tag Type as it is being used by ${tagsUsingTagType.length} tags`,
          )
        }

        myUser.tagTypes = myUser.tagTypes.filter(
          (tagType: TagType) => tagType.id !== input.existingTagTypeId,
        )
        await ctx.db
          .update(users)
          .set({ tagTypes: myUser.tagTypes })
          .where(eq(users.userId, userId))

        return myUser
      } catch (error: any) {
        console.error("Error in user.deleteTagType:\n", error.message)
        throw error
      }
    }),
})
