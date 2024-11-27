import { TagType } from "~/types/TagType"
import { DBTag } from "~/types/Tag"

// Custom enum-like types
export const CURRENCIES = ["GBP", "USD", "EUR", "RON"] as const
export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const

export const DEFAULT_TAG_TYPES: TagType[] = [
  {
    id: "category",
    name: "Category",
    description: "A way to categorize your expenses",
    color: "#FFA500",
  },
  {
    id: "source",
    name: "Source",
    description: "A source of income from where you pay your expenses",
    color: "#9370DB",
  },
  {
    id: "account",
    name: "Account",
    description: "An account from which you pay your expenses",
    color: "#448AFF",
  },
] satisfies TagType[]

export const DEFAULT_TAGS: DBTag[] = [
  {
    id: "living",
    name: "Living",
    description: "All living expenses",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "All entertainment expenses",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
  {
    id: "salary",
    name: "Salary",
    description: "All salary income",
    type: DEFAULT_TAG_TYPES[1]!.id,
  },
  {
    id: "savings",
    name: "Savings",
    description: "All savings income",
    type: DEFAULT_TAG_TYPES[1]!.id,
  },
  {
    id: "credit-card",
    name: "Credit Card",
    description: "All credit card expenses",
    type: DEFAULT_TAG_TYPES[2]!.id,
  },
  {
    id: "debit-card",
    name: "Debit Card",
    description: "All debit card expenses",
    type: DEFAULT_TAG_TYPES[2]!.id,
  },
] satisfies DBTag[]
