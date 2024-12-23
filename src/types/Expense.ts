import { Tag } from "./Tag"
import { User } from "./User" // Import User for reference
import { CURRENCIES, FREQUENCIES } from "~/types/CustomEnum"

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

// Define a type for the simplified expense
export type SimplifiedExpense = {
  id?: number
  name: string
  amount: number
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  tags: { id: string; name: string }[]
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

  toSimplifiedExpense(): SimplifiedExpense {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      currency: this.currency,
      frequency: this.frequency,
      tags: this.tags.map((tag) => ({ id: tag.id, name: tag.name })),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
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
