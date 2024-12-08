import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { fxRateApiClient } from "../utils/fxRateApiClient"

export const fxRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({}) => {
    return await fxRateApiClient.getAll()
  }),
})
