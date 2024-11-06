// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm"
import {
  index,
  integer,
  json,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `recspenses_${name}`)

// Custom enum-like types
export const CURRENCIES = ["GBP", "USD", "EUR", "RON"] as const
export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const

export const categories = createTable(
  "category",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    extra: json("extra").default("{}").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIndex: index("category_user_idx").on(table.userId),
  }),
)

export const sources = createTable(
  "source",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    extra: json("extra").default("{}").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIndex: index("source_user_idx").on(table.userId),
  }),
)

export const expenses = createTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    categoryId: integer("category_id")
      // .notNull()
      .references(() => categories.id),
    sourceId: integer("source_id")
      // .notNull()
      .references(() => sources.id),
    name: varchar("name", { length: 256 }).notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3, enum: CURRENCIES }).notNull(),
    frequency: varchar("frequency", { length: 10, enum: FREQUENCIES }).notNull(),
    extra: json("extra").default("{}").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdIndex: index("expense_user_idx").on(table.userId),
    categoryIndex: index("expense_category_idx").on(table.categoryId),
    sourceIndex: index("expense_source_idx").on(table.sourceId),
  }),
)

// Relations
export const expenseRelations = relations(expenses, ({ one }) => ({
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
  source: one(sources, {
    fields: [expenses.sourceId],
    references: [sources.id],
  }),
}))

// Example seed data
export const seedCategories = [
  { name: "Food & Groceries", userId: "user123" },
  { name: "Transport", userId: "user123" },
  { name: "Utilities", userId: "user123" },
]

export const seedSources = [
  { name: "Bank Account", userId: "user123" },
  { name: "Credit Card", userId: "user123" },
  { name: "Cash", userId: "user123" },
]

export const seedExpenses = [
  {
    name: "Groceries",
    userId: "user123",
    currency: "GBP",
    amount: 20000, // £200.00
    frequency: "weekly",
    categoryId: 1,
    sourceId: 1,
    extra: {},
  },
  {
    name: "Electricity",
    userId: "user123",
    currency: "GBP",
    amount: 15000, // £150.00
    frequency: "monthly",
    categoryId: 3,
    sourceId: 1,
    extra: {},
  },
]
