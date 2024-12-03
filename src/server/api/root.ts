import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"
import { expenseRouter } from "./routers/expense"
import { clerkRouter } from "./routers/clerk"
import { userRouter } from "./routers/user"
import { fxRouter } from "./routers/fx"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  expense: expenseRouter,
  clerk: clerkRouter,
  user: userRouter,
  fx: fxRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
