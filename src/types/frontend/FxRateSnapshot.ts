import { CURRENCIES, CURRENCY } from "~/types/backend/CustomEnum"

export class FxRateSnapshot {
  private rates: { [key: string]: { [key: string]: number } } = {}

  constructor(currencyData: { [key: string]: { [key: string]: number } }) {
    this.rates = currencyData
    if (!this.validate()) {
      throw new Error("Invalid currency data")
    }
  }

  validate(): boolean {
    return Object.keys(this.rates).every((key) => CURRENCIES.includes(key as CURRENCY))
  }

  get(baseCurrency: CURRENCY, targetCurrency: CURRENCY): number {
    const baseRates = this.rates[baseCurrency]
    if (!baseRates || !(targetCurrency in baseRates)) {
      throw new Error(`Rate not found for ${baseCurrency} to ${targetCurrency}`)
    }
    return baseRates[targetCurrency] as number
  }
}
