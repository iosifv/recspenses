import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { fxRateApiClient } from "../utils/fxRateApiClient"
import { fxRates } from "~/server/db/schema"
import { FxRateData } from "~/types/FxRate"

export const fxRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }): Promise<FxRateData> => {
    const result = await ctx.db.query.fxRates.findFirst({
      orderBy: (fxRates, { desc }) => [desc(fxRates.id)],
    })

    if (!result || !result.data) {
      console.info("No fx rate data found, fetching from API")

      const fxRateData = await fxRateApiClient.getAll()

      await ctx.db.insert(fxRates).values({ data: fxRateData })
      return {
        id: null,
        data: fxRateData,
        createdAt: new Date(),
      }
    }

    return result
  }),

  update: publicProcedure.mutation(async ({ ctx }) => {
    const fxRateData = await fxRateApiClient.getAll()

    await ctx.db.insert(fxRates).values({ data: fxRateData })
    return {
      id: null,
      data: fxRateData,
      createdAt: new Date(),
    }
  }),
})
