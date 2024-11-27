import { TagType } from "~/types/TagType"
import { DBTag, Tag } from "~/types/Tag"

// Custom enum-like types
export const CURRENCIES = ["GBP", "USD", "EUR", "RON"] as const
export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const

export const DEFAULT_TAG_TYPES: TagType[] = [
  {
    id: "category",
    name: "Category",
    color: "#FFA500",
  },
  {
    id: "source",
    name: "Source",
    color: "#9370DB",
  },
  {
    id: "account",
    name: "Account",
    color: "#448AFF",
  },
] satisfies TagType[]

export const DEFAULT_TAGS: DBTag[] = [
  {
    id: "living",
    name: "Living",
    color: "#FF8C00",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "#228B22",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
  {
    id: "salary",
    name: "Salary",
    color: "#8A2BE2",
    type: DEFAULT_TAG_TYPES[1]!.id,
  },
  {
    id: "savings",
    name: "Savings",
    color: "#8A2BE2",
    type: DEFAULT_TAG_TYPES[1]!.id,
  },
  {
    id: "credit-card",
    name: "Credit Card",
    color: "#8A2BE2",
    type: DEFAULT_TAG_TYPES[2]!.id,
  },
  {
    id: "debit-card",
    name: "Debit Card",
    color: "#8A2BE2",
    type: DEFAULT_TAG_TYPES[2]!.id,
  },
] satisfies Tag[]
