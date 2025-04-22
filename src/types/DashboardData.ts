import { ExpensePlainObject } from "./Expense"
import { CURRENCIES, FREQUENCIES } from "~/types/CustomEnum"
import { FxRateData, FxRate } from "./FxRate"
import { FrequencyLookup } from "./FrequencyLookup"
import { CURRENCY, FREQUENCY } from "~/types/CustomEnum"

export type DashboardExpense = {
  id?: number
  name: string
  amount: number
  transformed: number
  original: string
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  // TODO fix the colour part here
  tags: { id: string; name: string; type: { id: string; colour: string } }[]
  createdAt: Date
  updatedAt: Date
}

export class DashboardData {
  dashboardExpenseArray: DashboardExpense[] = []
  fxRate: FxRate
  displayCurrency: CURRENCY
  displayFrequency: FREQUENCY

  constructor(fxData: FxRateData, displayCurrency: CURRENCY, displayFrequency: FREQUENCY) {
    this.fxRate = FxRate.buildFromData(fxData)
    this.displayCurrency = displayCurrency
    this.displayFrequency = displayFrequency
  }

  transform(expense: ExpensePlainObject): number {
    let transform =
      expense.amount /
      this.fxRate.get(this.displayCurrency, expense.currency) /
      FrequencyLookup.get(this.displayFrequency, expense.frequency)
    return Math.floor(transform * 100) / 100
  }

  /**
   * Add an array of plain JS objects as returned by Expense.toPlainObject().
   * Dates may be ISO strings. All fields are assumed serializable.
   */
  add(plainExpenses: ExpensePlainObject[]) {
    plainExpenses.forEach((pe) => {
      this.dashboardExpenseArray.push({
        id: pe.id,
        name: pe.name,
        amount: pe.amount,
        transformed: this.transform({
          amount: pe.amount,
          currency: pe.currency,
          frequency: pe.frequency,
        } as ExpensePlainObject),
        original: `${pe.amount} ${pe.currency} ${pe.frequency}`,
        currency: pe.currency,
        frequency: pe.frequency,
        tags: pe.tags,
        createdAt: pe.createdAt,
        updatedAt: pe.updatedAt,
      } as DashboardExpense)
    })
  }

  getAllExpenses(): DashboardExpense[] {
    return this.dashboardExpenseArray
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
