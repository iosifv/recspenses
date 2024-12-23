import { SimplifiedExpense } from "../Expense"
import { CURRENCIES, FREQUENCIES } from "~/types/backend/CustomEnum"
import { Tag } from "../Tag"
import { FxRateSnapshot } from "./FxRateSnapshot"
import { FrequencyLookup } from "./FrequencyLookup"
import { CURRENCY, FREQUENCY } from "~/types/backend/CustomEnum"

export type FrontendExpense = {
  id?: number
  name: string
  amount: number
  transformed: number
  original: string
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  tags: { id: string; name: string }[]
  createdAt: Date
  updatedAt: Date
}

export class FrontendExpenses {
  frontendExpenses: FrontendExpense[] = []
  fxRate: FxRateSnapshot
  displayCurrency: CURRENCY
  displayFrequency: FREQUENCY

  constructor(fxData: any, displayCurrency: CURRENCY, displayFrequency: FREQUENCY) {
    this.fxRate = new FxRateSnapshot(fxData)
    this.displayCurrency = displayCurrency
    this.displayFrequency = displayFrequency
  }

  transform(expense: SimplifiedExpense): number {
    let transform =
      expense.amount /
      this.fxRate.get(this.displayCurrency, expense.currency) /
      FrequencyLookup.get(this.displayFrequency, expense.frequency)
    return Math.floor(transform * 100) / 100
  }

  add(simplifiedExpenses: SimplifiedExpense[]) {
    simplifiedExpenses.forEach((se: SimplifiedExpense) => {
      this.frontendExpenses.push({
        id: se.id,
        name: se.name,
        amount: se.amount,
        transformed: this.transform(se),
        original: `${se.amount} ${se.currency} ${se.frequency}`,
        currency: se.currency,
        frequency: se.frequency,
        tags: se.tags,
        createdAt: se.createdAt,
        updatedAt: se.updatedAt,
      } as FrontendExpense)
    })
  }

  getAll(): FrontendExpense[] {
    return this.frontendExpenses
  }

  // errorrMessages: string[] = []
  // validate(): boolean {
  //   if (this.name.trim() === "") {
  //     this.errorrMessages.push("Expense name can not be empty")
  //   }
  //   if (this.amount <= 0) {
  //     this.errorrMessages.push("Expense amount must be greater than 0")
  //   }
  //   if (this.currency.trim() === "") {
  //     this.errorrMessages.push("Expense currency can not be empty")
  //   }
  //   if (this.frequency.trim() === "") {
  //     this.errorrMessages.push("Expense frequency can not be empty")
  //   }
  //   if (this.errorrMessages.length > 0) {
  //     return false
  //   }

  //   return true
  // }

  // // Todo: move this only for the frontend object
  // getErrorMessages(): string[] {
  //   return this.errorrMessages
  // }
}
