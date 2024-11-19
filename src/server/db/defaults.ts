import type { TagType, Tag } from "~/types/recspensesTypes"

// Custom enum-like types
export const CURRENCIES = ["GBP", "USD", "EUR", "RON"] as const
export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const

export const DEFAULT_TAG_TYPES: TagType[] = [
  {
    id: "housing",
    name: "Housing",
    color: "#FFA500",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "#9370DB",
  },
] satisfies TagType[]

export const DEFAULT_TAGS: Tag[] = [
  {
    id: "rent",
    name: "Rent",
    color: "#FF8C00",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
  {
    id: "electricity",
    name: "Electricity",
    color: "#228B22",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
  {
    id: "netflix",
    name: "Netflix",
    color: "#8A2BE2",
    type: DEFAULT_TAG_TYPES[1]!.id,
  },
  {
    id: "spotify",
    name: "Spotify",
    color: "#8A2BE2",
    type: DEFAULT_TAG_TYPES[1]!.id,
  },
] satisfies Tag[]
