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
  type: string
}

export type Expense = {
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
