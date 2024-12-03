import { Tag } from "./Tag"
import { User } from "./User" // Import User for reference
import { CURRENCIES, FREQUENCIES } from "~/server/db/schema" // Adjust the import path as necessary

export type DBExpense = {
  id?: number
  userId: string
  tags: string[] // stored as JSON in DB
  name: string
  amount: number
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  extra: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date
}

export class Expense {
  id?: number
  userId: string
  tags: Tag[] // stored as JSON in DB
  name: string
  amount: number
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  extra: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date

  constructor(user: User, dbExpense: DBExpense) {
    this.id = dbExpense.id
    this.userId = dbExpense.userId
    this.name = dbExpense.name
    this.amount = dbExpense.amount
    this.currency = dbExpense.currency
    this.frequency = dbExpense.frequency
    this.extra = dbExpense.extra
    this.createdAt = dbExpense.createdAt
    this.updatedAt = dbExpense.updatedAt

    this.tags = dbExpense.tags.map((tagId) => {
      const foundTag = user.tags.find((tag) => tag.id === tagId)
      return foundTag ? foundTag : Tag.buildWithUnknownId(tagId)
    })
  }

  // static factoryFromFrontend(expense: any): Expense {
  //   const newExpense = new Expense(
  //     expense.userId,
  //     expense.name,
  //     expense.amount,
  //     expense.currency,
  //     expense.frequency,
  //     expense.tags,
  //     expense.extra,
  //     expense.createdAt,
  //     expense.updatedAt,
  //   )
  //   this.name = expense.name
  //   this.amount = expense.amount
  //   this.currency = expense.currency
  //   this.frequency = expense.frequency
  //   this.tags = expense.tags
  //   this.extra = expense.extra
  //   this.createdAt = expense.createdAt
  //   this.updatedAt = expense.updatedAt

  //   return this
  // }

  errorrMessages: string[] = []

  validate(): boolean {
    if (this.name.trim() === "") {
      this.errorrMessages.push("Expense name can not be empty")
    }
    if (this.amount <= 0) {
      this.errorrMessages.push("Expense amount must be greater than 0")
    }
    if (this.currency.trim() === "") {
      this.errorrMessages.push("Expense currency can not be empty")
    }
    if (this.frequency.trim() === "") {
      this.errorrMessages.push("Expense frequency can not be empty")
    }
    if (this.errorrMessages.length > 0) {
      return false
    }

    return true
  }

  getErrorMessages(): string[] {
    return this.errorrMessages
  }
}
