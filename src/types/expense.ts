export type Expense = {
  id: number
  name: string
  userId: string
  currency: "GBP" | "USD" | "EUR" | "RON"
  amount: number
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  categoryId: number
  sourceId: number
  extra: unknown
  createdAt: Date
  updatedAt: Date | null
}
