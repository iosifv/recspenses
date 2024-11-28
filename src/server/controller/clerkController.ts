import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "~/server/db"
import { expenses, users } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import { DEFAULT_TAG_TYPES, DEFAULT_TAGS, exampleExpenses } from "~/server/db/seedNewUser"
import { User } from "~/types/User"

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

export const touchUser = async (): Promise<User> => {
  const userId = getUserId()
  console.log("touching User", userId)

  if (!userId) {
    throw new Error("Not logged in")
  }

  const existingUser = await db.query.users.findFirst({
    where: (user: User, { eq }) => eq(user.userId, userId),
  })

  if (!existingUser) {
    // Create new user if doesn't exist
    const newUser = await db.insert(users).values({
      userId: userId,
      tagTypes: DEFAULT_TAG_TYPES,
      tags: DEFAULT_TAGS,
      metadata: {},
    })
    // Create example expenses for the new user

    await db.insert(expenses).values(exampleExpenses(userId))

    console.log("newUser", newUser)
  } else {
    // Update existing user's seenAt timestamp
    await db.update(users).set({ seenAt: new Date() }).where(eq(users.userId, userId))
  }

  return existingUser
}
