import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { fxRateApiClient } from "../utils/fxRateApiClient"
import { FxRateData } from "~/types/FxRateSnapshot"

export const fxRouter = createTRPCRouter({
  getAll: publicProcedure.query(async (): Promise<FxRateData> => {
    return await fxRateApiClient.getAll()
  }),
})
