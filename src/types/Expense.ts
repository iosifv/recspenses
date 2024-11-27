import { User } from "./User" // Import User for reference
import { CURRENCIES, FREQUENCIES } from "~/server/db/defaults" // Adjust the import path as necessary

export type DBExpense = {
  id: number
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
  id: number
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
      return foundTag
        ? foundTag
        : {
            id: tagId.toString(),
            name: "Unknown",
            color: "#FF0000",
            type: {
              id: "deleted-tag-types",
              name: "Deleted Tag Type",
              color: "#FF0000",
            },
          }
    })
  }
}
