// Custom enum-like types
export type CURRENCY = "GBP" | "USD" | "EUR" | "RON"
export type FREQUENCY = "daily" | "weekly" | "monthly" | "yearly"
export const CURRENCIES: CURRENCY[] = ["GBP", "USD", "EUR", "RON"] as const
export const FREQUENCIES: FREQUENCY[] = ["daily", "weekly", "monthly", "yearly"] as const
