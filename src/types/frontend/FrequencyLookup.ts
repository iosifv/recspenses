import { FREQUENCIES, FREQUENCY } from "~/types/backend/CustomEnum"

const lookupTable = {
  daily: {
    daily: 1,
    weekly: 7,
    monthly: 30.5,
    yearly: 365,
  },
  weekly: {
    daily: 1 / 7,
    weekly: 1,
    monthly: 30.5 / 7,
    yearly: 365 / 7,
  },
  monthly: {
    daily: 1 / 30.5,
    weekly: 7 / 30.5,
    monthly: 1,
    yearly: 365 / 30.5,
  },
  yearly: {
    daily: 1 / 365,
    weekly: 7 / 365,
    monthly: 30.5 / 365,
    yearly: 1,
  },
}

export class FrequencyLookup {
  static get(baseFrequency: FREQUENCY, targetFrequency: FREQUENCY): number {
    return lookupTable[baseFrequency][targetFrequency] as number
  }
}
