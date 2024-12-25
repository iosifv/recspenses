import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { fxRateApiClient } from "../utils/fxRateApiClient"
import { FxRateData } from "~/types/FxRateSnapshot"
import { fxRates } from "~/server/db/schema"

export const fxRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }): Promise<any> => {
    const result = await ctx.db.query.fxRates.findFirst({
      orderBy: (fxRates, { desc }) => [desc(fxRates.id)],
    })

    return result.data
  }),

  update: publicProcedure.mutation(async ({ ctx }) => {
    const fxRateData = await fxRateApiClient.getAll()

    await ctx.db.insert(fxRates).values({ data: fxRateData })
    return fxRateData
  }),
})
