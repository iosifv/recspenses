import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

// const selectResult = await db.query.posts.findFirst({
//   orderBy: (posts, { desc }) => [desc(posts.createdAt)],
// });
// console.log('Results', selectResult);