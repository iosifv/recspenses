import { type CURRENCIES, type FREQUENCIES } from "~/server/db/defaults"

export type User = {
  userId: string
  tags: Tag[] // stored as JSON in DB
  tagTypes: TagType[] // stored as JSON in DB
  metadata: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date | null
  seenAt: Date | null
}

// Todo: create an abstract tag type and extend it into Tag and TagType
export type TagType = {
  id: string
  name: string
  color?: string
}

export type Tag = {
  id: string
  name: string
  color?: string
  type: TagType
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
