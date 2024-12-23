import { TagType } from "~/types/TagType"
import { DBTag } from "~/types/Tag"
import { DBExpense } from "~/types/Expense"
import { CURRENCIES, FREQUENCIES } from "~/types/CustomEnum"

export const DEFAULT_TAG_TYPES: TagType[] = [
  {
    id: "category",
    name: "Category",
    description: "A diverse way to categorize your expenses",
    color: "#FFA500",
  },
  {
    id: "source",
    name: "Source",
    description: "Various income sources",
    color: "#9370DB",
  },
  {
    id: "account",
    name: "Account",
    description: "Accounts from which you pay your expenses",
    color: "#448AFF",
  },
] satisfies TagType[]

export const DEFAULT_TAGS: DBTag[] = [
  {
    id: "example",
    name: "Example",
    description: "Example expenses created by the app",
    type: DEFAULT_TAG_TYPES[0]!.id,
  },
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

function generateRandomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1))
}

export function exampleExpenses(userId: string): DBExpense[] {
  return exampleExpenseArray.map((expense, index) => ({
    ...expense,
    userId: userId,
    currency: CURRENCIES[generateRandomInt(CURRENCIES.length)] || "USD",
    frequency: FREQUENCIES[generateRandomInt(FREQUENCIES.length)] || "monthly",
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

export const exampleExpenseArray = [
  {
    tags: ["example", "living", "debit-card"],
    name: "Rent",
    amount: 1000,
  },
  {
    tags: ["example", "entertainment", "credit-card"],
    name: "Netflix",
    amount: 15,
  },
  {
    tags: ["example", "savings", "salary"],
    name: "Dolar cost averaging plan for Dow Jones",
    amount: 40,
  },
  {
    tags: ["example", "savings", "salary"],
    name: "Dolar cost averaging plan for DAX",
    amount: 1000,
  },
  {
    tags: ["example", "living", "debit-card"],
    name: "Gorceries cupon",
    amount: 300,
  },
  {
    tags: ["example", "entertainment", "credit-card"],
    name: "Dining Out",
    amount: 50,
  },
  {
    tags: ["example", "living", "debit-card"],
    name: "Electricity",
    amount: 150,
  },
  {
    tags: ["example", "living", "debit-card"],
    name: "Internet bill",
    amount: 50,
  },
  {
    tags: ["example", "entertainment", "credit-card"],
    name: "Spotify",
    amount: 12,
  },
]
