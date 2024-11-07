export type Expense = {
  id: number
  userId: string
  categoryId: number | null
  sourceId: number | null
  name: string
  currency: "GBP" | "USD" | "EUR" | "RON"
  amount: number
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  extra: unknown
  createdAt: Date
  updatedAt: Date | null
}
