import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { fxRateApiClient } from "../utils/fxRateApiClient"
import { FXRates } from "~/types/frontend/FXRate"

export const fxRouter = createTRPCRouter({
  getAll: publicProcedure.query(async (): Promise<FXRates> => {
    return await fxRateApiClient.getAll()
  }),
})
