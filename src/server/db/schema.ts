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

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `recspenses_${name}`)

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
)

export const expenses = createTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }),
    name: varchar("name", { length: 256 }),
    currency: varchar("currency", { length: 6 }),
    amount: integer("amount").notNull(),
    frequency: varchar("frequency", { length: 12 }),
    extra: json("extra").default("{}"),
    // createdAt: timestamp("created_at", { withTimezone: true })
    //   .default(sql`CURRENT_TIMESTAMP`)
    //   .notNull(),
    // updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  // (example) => ({
  //   nameIndex: index("user_idx").on(example.userId),
  // })
)
