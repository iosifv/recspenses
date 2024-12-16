import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { users } from "~/server/db/schema"
import { getUserId } from "~/server/controller/clerkController"
import { eq } from "drizzle-orm"
import { generateUniqueId, getRandomColour } from "~/server/api/utils/routeUtils"
import { Tag } from "~/types/Tag"
import { TagType } from "~/types/TagType"

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

        if (input.newTagName.trim() === "") {
          throw new Error("Tag name can not be empty")
        }

        const newTag: Tag = {
          id: generateUniqueId(input.newTagName),
          name: input.newTagName,
          color: getRandomColour(),
          type: input.existingTagType,
        }

        myUser.tags.push(newTag)
        await ctx.db.update(users).set({ tags: myUser.tags }).where(eq(users.userId, userId))

        return myUser
      } catch (error: any) {
        console.error("Error in user.addTag:\n", error.message)
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

        if (tagsUsingTagType.length > 0) {
          throw new Error(`This TagType is being used by ${tagsUsingTagType.length} Tags`)
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

  updateMetadata: publicProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId()

      try {
        const myUser = await ctx.db.query.users.findFirst({
          where: (users: { userId: any }, { eq }: any) => eq(users.userId, userId),
        })

        if (input.key.trim() === "") {
          throw new Error("Key can not be empty")
        }

        if (input.value.trim() === "") {
          throw new Error("Value can not be empty")
        }

        const metadata = myUser.metadata
        metadata[input.key] = input.value

        await ctx.db.update(users).set({ metadata: metadata }).where(eq(users.userId, userId))

        return myUser
      } catch (error: any) {
        console.error("Error in user.addTag:\n", error.message)
        throw error
      }
    }),
})
