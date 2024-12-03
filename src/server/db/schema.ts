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
import { TagType } from "~/types/TagType"
import { DBTag } from "~/types/Tag"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `recspenses_${name}`)

// Custom enum-like types
export type CURRENCY = "GBP" | "USD" | "EUR" | "RON"
export type FREQUENCY = "daily" | "weekly" | "monthly" | "yearly"
export const CURRENCIES: CURRENCY[] = ["GBP", "USD", "EUR", "RON"] as const
export const FREQUENCIES: FREQUENCY[] = ["daily", "weekly", "monthly", "yearly"] as const

export const users = createTable(
  "user",
  {
    // Todo: maybe rename userId to whatever Clerk uses ?
    userId: varchar("user_id", { length: 256 }).primaryKey(),
    tagTypes: json("tag_types").$type<TagType[]>().default([]).notNull(),
    tags: json("tags").$type<DBTag[]>().default([]).notNull(),
    metadata: json("metadata").default("{}").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    seenAt: timestamp("seen_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIndex: index("user_idx").on(table.userId),
  }),
)

export const expenses = createTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    tags: json("tags").default("[]").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("GBP"),
    frequency: varchar("frequency", { length: 10 }).notNull(),
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
  }),
)

// Relations
export const expenseRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.userId],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
}))
