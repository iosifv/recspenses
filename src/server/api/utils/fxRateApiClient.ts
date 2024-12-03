import { CURRENCY, CURRENCIES } from "~/server/db/schema"

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

    return {
      date: data.date,
      base: baseCurrency,
      rates: data.rates,
    }
  },
  getAll: async (): Promise<any> => {
    const baseCurrencies = CURRENCIES
    const data = await Promise.all(
      baseCurrencies.map(async (baseCurrency) => {
        const result = await fxRateApiClient.get(baseCurrency)
        return result
      }),
    )

    const simplifiedData = data.reduce((acc, item) => {
      acc[item.base] = item.rates
      return acc
    }, {})

    return simplifiedData
  },
}
