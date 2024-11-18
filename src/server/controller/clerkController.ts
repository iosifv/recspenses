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
  console.log("touching User", userId)
  if (!userId) {
    throw new Error("Not logged in")
  }

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.userId, userId),
  })

  console.log("existingUser", existingUser)

  if (!existingUser) {
    // Create new user if doesn't exist
    const newUser = await db.insert(users).values({
      userId: userId,
      tags: [],
      tagTypes: [],
      metadata: {},
    })
    console.log("newUser", newUser)
  } else {
    // Update existing user's seenAt timestamp
    await db.update(users).set({ seenAt: new Date() }).where(eq(users.userId, userId))
  }

  return userId
}
