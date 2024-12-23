import { CURRENCY, CURRENCIES } from "~/types/CustomEnum"
import { FxRateData, FxRateSnapshot } from "~/types/FxRateSnapshot"

const latestUrl = "https://api.fxratesapi.com/latest"
const currencyList = CURRENCIES.reduce((acc, currency): string => {
  acc += currency + ","
  return acc
}, "").slice(0, -1)

export const fxRateApiClient = {
  get: async (baseCurrency: CURRENCY): Promise<any> => {
    const options = {
      method: "GET",
      url:
        latestUrl +
        `?base=${baseCurrency}&currencies=${currencyList}&resolution=1m&amount=1&places=6&format=json`,
    }
    const response = await fetch(options.url)
    const data = await response.json()

    if (data.error) {
      console.error(data.error)
      throw new Error(`FX API: ${data.error.message} (${data.error.description})`)
    }

    if (response.status !== 200) {
      throw new Error("Failed to fetch FX Rates.")
    }

    return {
      date: data.date,
      base: baseCurrency,
      rates: data.rates,
    }
  },
  getAll: async (): Promise<FxRateData> => {
    // const baseCurrencies = CURRENCIES
    // const data = await Promise.all(
    //   baseCurrencies.map(async (baseCurrency) => {
    //     const result = await fxRateApiClient.get(baseCurrency)
    //     return result
    //   }),
    // )

    // const simplifiedData = data.reduce((acc, item) => {
    //   acc[item.base] = item.rates
    //   return acc
    // }, {})

    // Todo: Obviously, take care of this bogus data some time
    const simplifiedData = {
      GBP: { EUR: 1.205206, GBP: 1, RON: 5.993941, USD: 1.26491 },
      USD: { EUR: 0.9528, GBP: 0.79057, RON: 4.738631, USD: 1 },
      EUR: { EUR: 1, GBP: 0.829733, RON: 4.973373, USD: 1.049538 },
      RON: { EUR: 0.201071, GBP: 0.166835, RON: 1, USD: 0.211031 },
    }

    const fxRates = new FxRateSnapshot(simplifiedData)

    return fxRates.getAll()
  },
}
