import { CURRENCIES, CURRENCY } from "~/types/CustomEnum"

export type FxRatePairs = { [key: string]: { [key: string]: number } }

export type FxRateData = {
  id: number | null
  data: FxRatePairs
  createdAt: Date
}

export class FxRate {
  private id: number | null
  private rates: { [key: string]: { [key: string]: number } } = {}
  private createdAt: Date

  constructor(rates: FxRatePairs, createdAt?: Date, id?: number | null) {
    this.rates = rates
    if (!this.validate()) {
      console.error("Invalid currency data. Dumping object: ")
      console.dir(this, { depth: null })
      throw new Error("Invalid currency data")
    }
    this.createdAt = createdAt || new Date()
    this.id = id || null
  }
  static buildFromData(fxRateData: FxRateData): FxRate {
    return new FxRate(fxRateData.data, fxRateData.createdAt, fxRateData.id)
  }

  validate(): boolean {
    return Object.keys(this.rates).every((key) => CURRENCIES.includes(key as CURRENCY))
  }

  getRates(): FxRatePairs {
    return this.rates
  }

  get(baseCurrency: CURRENCY, targetCurrency: CURRENCY): number {
    const baseRates = this.rates[baseCurrency]
    if (!baseRates || !(targetCurrency in baseRates)) {
      throw new Error(`Rate not found for ${baseCurrency} to ${targetCurrency}`)
    }
    return baseRates[targetCurrency] as number
  }

  dump(): FxRateData {
    return {
      id: this.id,
      data: this.rates,
      createdAt: this.createdAt,
    }
  }
}
