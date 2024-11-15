import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import { eq } from "drizzle-orm"

export const getUserId = () => {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Not logged in")
  }
  return userId
}

export const getUser = () => {
  const user = currentUser()
  if (!user) {
    throw new Error("Not logged in")
  }
  return user
}

export const touchUser = async (): Promise<string> => {
  const userId = getUserId()
  if (!userId) {
    throw new Error("Not logged in")
  }

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.userId, userId),
  })

  if (!existingUser) {
    // Create new user if doesn't exist
    await db.insert(users).values({
      userId: userId,
      metadata: {}, // Will use schema default
    })
  } else {
    // Update existing user's seenAt timestamp
    await db.update(users).set({ seenAt: new Date() }).where(eq(users.userId, userId))
  }

  return userId
}
