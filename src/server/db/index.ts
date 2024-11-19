import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"

import { drizzle as drizzleLocal } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "~/env"

import * as schema from "./schema"

let db
let databaseType: "local" | "vercel"

if (env.POSTGRES_URL.includes("my_local_db")) {
  const client = postgres(env.POSTGRES_URL)
  db = drizzleLocal(client, { schema })
  databaseType = "local"
} else {
  db = drizzleVercel(sql, { schema })
  databaseType = "vercel"
}

console.info(` => Using ${databaseType} database`)

export { db }
