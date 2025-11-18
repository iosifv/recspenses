# Claude AI Documentation - Backend Architecture

> **Part of:** Recspenses Claude Documentation Suite
> **Focus:** Backend architecture, API design, database schema, and server-side patterns
> **See also:** [CLAUDE.md](./CLAUDE.md) | [CLAUDE-FRONTEND.md](./CLAUDE-FRONTEND.md)

## Table of Contents

- [Backend Overview](#backend-overview)
- [Database Architecture](#database-architecture)
- [tRPC API Layer](#trpc-api-layer)
- [Business Logic Layer](#business-logic-layer)
- [Type System](#type-system)
- [Authentication & Authorization](#authentication--authorization)
- [Data Validation](#data-validation)
- [External Services](#external-services)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)

---

## Backend Overview

### Technology Stack

```
┌─────────────────────────────────────┐
│  Next.js 15 API Routes              │  ← HTTP Layer
├─────────────────────────────────────┤
│  tRPC 11 (Type-safe RPC)            │  ← API Layer
├─────────────────────────────────────┤
│  Drizzle ORM 0.36                   │  ← ORM Layer
├─────────────────────────────────────┤
│  Vercel Postgres (PostgreSQL)      │  ← Database
└─────────────────────────────────────┘
```

### Directory Structure

```
src/server/
├── api/
│   ├── root.ts                  # tRPC router aggregation
│   ├── trpc.ts                  # tRPC configuration & context
│   ├── routers/                 # API endpoint definitions
│   │   ├── expense.ts           # Expense CRUD operations
│   │   ├── user.ts              # User & tag management
│   │   ├── fx.ts                # Currency exchange rates
│   │   └── clerk.ts             # Authentication webhooks
│   └── utils/
│       ├── routeUtils.ts        # Shared route helpers
│       └── fxRateApiClient.ts   # External FX API client
├── controller/
│   └── clerkController.ts       # User authentication logic
├── db/
│   ├── index.ts                 # Database client initialization
│   ├── schema.ts                # Drizzle table definitions
│   └── seedNewUser.ts           # New user data seeding
└── queries.ts                   # (Currently unused/deprecated)
```

---

## Database Architecture

### Schema Definition Location

**File:** `src/server/db/schema.ts`

All database tables are defined using Drizzle ORM's PostgreSQL schema builder.

### Tables

#### 1. Users Table (`recspenses_user`)

**Purpose:** Store user profiles, preferences, and custom tagging system

```typescript
export const users = pgTable("recspenses_user", {
  userId: text("user_id").primaryKey(),  // Clerk user ID
  tags: json("tags").$type<DBTag[]>().notNull().default([]),
  tagTypes: json("tag_types").$type<TagType[]>().notNull().default([]),
  metadata: json("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  seenAt: timestamp("seen_at").defaultNow().notNull(),
});
```

**Fields:**
- `userId` (text, PK) - Clerk authentication ID
- `tags` (json) - Array of user's custom tags
- `tagTypes` (json) - Array of tag type categories
- `metadata` (json) - User preferences (currency, frequency, etc.)
- `createdAt` (timestamp) - Account creation time
- `updatedAt` (timestamp) - Last profile update
- `seenAt` (timestamp) - Last activity timestamp

**Indexes:** Primary key on `userId`

**Sample Data:**
```json
{
  "userId": "user_abc123",
  "tags": [
    { "tagId": "tag-food", "tagTypeId": "category", "name": "Food" },
    { "tagId": "tag-amex", "tagTypeId": "source", "name": "AMEX Card" }
  ],
  "tagTypes": [
    { "tagTypeId": "category", "name": "Category", "colour": "#3b82f6" },
    { "tagTypeId": "source", "name": "Source", "colour": "#10b981" }
  ],
  "metadata": {
    "currency": "GBP",
    "frequency": "monthly"
  }
}
```

#### 2. Expenses Table (`recspenses_expense`)

**Purpose:** Store individual expense records

```typescript
export const expenses = pgTable("recspenses_expense", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  tags: json("tags").$type<string[]>().notNull().default([]),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),  // Stored in cents/pence
  currency: text("currency").notNull(), // GBP, USD, EUR, RON
  frequency: text("frequency").notNull(), // daily, weekly, monthly, yearly
  extra: json("extra").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Fields:**
- `id` (serial, PK) - Auto-incrementing ID
- `userId` (text, FK) - References `users.userId`
- `tags` (json) - Array of tag IDs (e.g., `["tag-food", "tag-amex"]`)
- `name` (text) - Expense description
- `amount` (integer) - Amount in smallest currency unit (cents/pence)
- `currency` (text) - ISO currency code
- `frequency` (text) - Recurrence pattern
- `extra` (json) - Additional metadata
- `createdAt` (timestamp) - Record creation time
- `updatedAt` (timestamp) - Last modification time

**Indexes:** Primary key on `id`

**Important Notes:**
- Amounts stored as integers to avoid floating-point precision issues
- £12.50 stored as `1250` (pence)
- $100.00 stored as `10000` (cents)
- Division by 100 happens at display layer

**Sample Data:**
```json
{
  "id": 123,
  "userId": "user_abc123",
  "tags": ["tag-food", "tag-amex"],
  "name": "Starbucks Coffee",
  "amount": 425,  // £4.25
  "currency": "GBP",
  "frequency": "daily",
  "extra": {},
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

#### 3. FX Rates Table (`recspenses_fx_rates`)

**Purpose:** Cache currency exchange rates to reduce external API calls

```typescript
export const fxRates = pgTable("recspenses_fx_rates", {
  id: serial("id").primaryKey(),
  data: json("data").$type<FxRatePairs>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Fields:**
- `id` (serial, PK) - Auto-incrementing ID
- `data` (json) - Currency exchange rate matrix
- `createdAt` (timestamp) - Rate fetch timestamp

**Data Structure:**
```typescript
type FxRatePairs = {
  GBP: { GBP: 1, USD: number, EUR: number, RON: number };
  USD: { GBP: number, USD: 1, EUR: number, RON: number };
  EUR: { GBP: number, USD: number, EUR: 1, RON: number };
  RON: { GBP: number, USD: number, EUR: number, RON: 1 };
};
```

**Sample Data:**
```json
{
  "id": 5,
  "data": {
    "GBP": { "GBP": 1, "USD": 1.27, "EUR": 1.17, "RON": 5.82 },
    "USD": { "GBP": 0.79, "USD": 1, "EUR": 0.92, "RON": 4.58 },
    "EUR": { "GBP": 0.85, "USD": 1.08, "EUR": 1, "RON": 4.98 },
    "RON": { "GBP": 0.17, "USD": 0.22, "EUR": 0.20, "RON": 1 }
  },
  "createdAt": "2025-01-18T08:00:00Z"
}
```

**Usage Pattern:**
1. Fetch latest rate: `SELECT * FROM recspenses_fx_rates ORDER BY created_at DESC LIMIT 1`
2. Check if stale (e.g., >24 hours old)
3. If stale, fetch new rates from external API and insert new row

### Database Client

**File:** `src/server/db/index.ts`

```typescript
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });
```

**Configuration:** `drizzle.config.ts`

```typescript
export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
};
```

### Migrations

**Location:** `drizzle/` (auto-generated)

**Workflow:**
```bash
# 1. Edit src/server/db/schema.ts
# 2. Generate migration SQL
pnpm db:generate

# 3. Apply to database
pnpm db:push  # Development (immediate)
# OR
pnpm db:migrate  # Production (version controlled)
```

**Example Migration:**
```sql
-- drizzle/0000_add_seen_at_column.sql
ALTER TABLE "recspenses_user" ADD COLUMN "seen_at" timestamp DEFAULT now() NOT NULL;
```

---

## tRPC API Layer

### Configuration

**File:** `src/server/api/trpc.ts`

#### Context Creation

```typescript
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId } = await auth();  // Clerk authentication
  return { userId };
};
```

**Context Type:**
```typescript
type Context = {
  userId: string | null;  // Clerk user ID (null if not authenticated)
};
```

#### Procedure Definition

```typescript
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,  // Handles Date, Map, Set serialization
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const publicProcedure = t.procedure;  // Used by all routes
```

**Why `publicProcedure`?**
- Authentication handled by Clerk middleware (`src/middleware.ts`)
- All routes have access to `ctx.userId`
- Individual routes check `userId` existence if needed

### Router Aggregation

**File:** `src/server/api/root.ts`

```typescript
import { expenseRouter } from "./routers/expense";
import { userRouter } from "./routers/user";
import { fxRouter } from "./routers/fx";
import { clerkRouter } from "./routers/clerk";

export const appRouter = createCallerFactory(createTRPCRouter)({
  expense: expenseRouter,
  user: userRouter,
  fx: fxRouter,
  clerk: clerkRouter,
});

export type AppRouter = typeof appRouter;
```

**Type Export:**
- `AppRouter` type exported for client-side type inference
- Enables end-to-end type safety from server to client

### Routers

#### Expense Router

**File:** `src/server/api/routers/expense.ts`

**Procedures:**

1. **getMine** - Get all user expenses
```typescript
getMine: publicProcedure.query(async ({ ctx }) => {
  const userId = ctx.userId!;
  await touchUser(userId);  // Ensure user exists

  const expenses = await db.query.expenses.findMany({
    where: eq(schema.expenses.userId, userId),
    orderBy: [desc(schema.expenses.createdAt)],
  });

  return expenses.map(Expense.fromDB);  // Convert to class instances
}),
```

**Response Type:** `Expense[]`

2. **createMine** - Create new expense
```typescript
createMine: publicProcedure
  .input(z.object({
    name: z.string().min(1),
    amount: z.number().int().positive(),
    currency: z.string(),
    frequency: z.string(),
    tags: z.array(z.string()),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;

    const [expense] = await db.insert(schema.expenses).values({
      userId,
      name: input.name,
      amount: input.amount,
      currency: input.currency,
      frequency: input.frequency,
      tags: input.tags,
    }).returning();

    return Expense.fromDB(expense!);
  }),
```

**Input Schema:**
```typescript
{
  name: string;      // "Starbucks Coffee"
  amount: number;    // 425 (pence/cents)
  currency: string;  // "GBP"
  frequency: string; // "daily"
  tags: string[];    // ["tag-food", "tag-amex"]
}
```

**Response Type:** `Expense`

3. **updateMine** - Update existing expense
```typescript
updateMine: publicProcedure
  .input(z.object({
    id: z.number(),
    name: z.string().optional(),
    amount: z.number().int().positive().optional(),
    currency: z.string().optional(),
    frequency: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;
    const { id, ...updates } = input;

    // Verify ownership
    const existing = await db.query.expenses.findFirst({
      where: and(
        eq(schema.expenses.id, id),
        eq(schema.expenses.userId, userId)
      ),
    });

    if (!existing) throw new Error("Expense not found");

    const [updated] = await db.update(schema.expenses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.expenses.id, id))
      .returning();

    return Expense.fromDB(updated!);
  }),
```

4. **deleteMine** - Delete expense (currently disabled)
```typescript
deleteMine: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ ctx, input }) => {
    throw new Error("Delete is disabled");
    // Original implementation commented out
  }),
```

5. **removeMyTag** - Remove tag from expense
```typescript
removeMyTag: publicProcedure
  .input(z.object({
    expenseId: z.number(),
    tagId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;

    const expense = await db.query.expenses.findFirst({
      where: and(
        eq(schema.expenses.id, input.expenseId),
        eq(schema.expenses.userId, userId)
      ),
    });

    if (!expense) throw new Error("Expense not found");

    const updatedTags = expense.tags.filter(t => t !== input.tagId);

    await db.update(schema.expenses)
      .set({ tags: updatedTags })
      .where(eq(schema.expenses.id, input.expenseId));
  }),
```

#### User Router

**File:** `src/server/api/routers/user.ts`

**Procedures:**

1. **getMe** - Get current user with tags and tag types
```typescript
getMe: publicProcedure.query(async ({ ctx }) => {
  const userId = ctx.userId!;
  const user = await touchUser(userId);  // Auto-create if new
  return user;
}),
```

**Response Type:** `User` (with embedded `Tag[]` and `TagType[]`)

2. **addTag** - Add new tag to user profile
```typescript
addTag: publicProcedure
  .input(z.object({
    tagId: z.string(),
    tagTypeId: z.string(),
    name: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;
    const user = await touchUser(userId);

    const newTag: DBTag = {
      tagId: input.tagId,
      tagTypeId: input.tagTypeId,
      name: input.name,
    };

    const updatedTags = [...user.tags.map(t => t.toDB()), newTag];

    await db.update(schema.users)
      .set({ tags: updatedTags })
      .where(eq(schema.users.userId, userId));

    return newTag;
  }),
```

3. **deleteTag** - Delete tag from user profile
```typescript
deleteTag: publicProcedure
  .input(z.object({ tagId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;
    const user = await touchUser(userId);

    // Check if tag is in use
    const expensesWithTag = await db.query.expenses.findMany({
      where: and(
        eq(schema.expenses.userId, userId),
        sql`${schema.expenses.tags}::jsonb @> ${JSON.stringify([input.tagId])}::jsonb`
      ),
    });

    if (expensesWithTag.length > 0) {
      throw new Error("Cannot delete tag that is in use");
    }

    const updatedTags = user.tags
      .filter(t => t.tagId !== input.tagId)
      .map(t => t.toDB());

    await db.update(schema.users)
      .set({ tags: updatedTags })
      .where(eq(schema.users.userId, userId));
  }),
```

4. **addTagType** - Add new tag type category
```typescript
addTagType: publicProcedure
  .input(z.object({
    tagTypeId: z.string(),
    name: z.string(),
    colour: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;
    const user = await touchUser(userId);

    const newTagType = new TagType(
      input.tagTypeId,
      input.name,
      input.colour
    );

    const updatedTagTypes = [
      ...user.tagTypes.map(tt => tt.toPlainObject()),
      newTagType.toPlainObject()
    ];

    await db.update(schema.users)
      .set({ tagTypes: updatedTagTypes })
      .where(eq(schema.users.userId, userId));

    return newTagType;
  }),
```

5. **deleteTagType** - Delete tag type (with validation)
```typescript
deleteTagType: publicProcedure
  .input(z.object({ tagTypeId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;
    const user = await touchUser(userId);

    // Check if any tags use this tag type
    const tagsWithType = user.tags.filter(t => t.tagTypeId === input.tagTypeId);
    if (tagsWithType.length > 0) {
      throw new Error("Cannot delete tag type that has tags");
    }

    const updatedTagTypes = user.tagTypes
      .filter(tt => tt.tagTypeId !== input.tagTypeId)
      .map(tt => tt.toPlainObject());

    await db.update(schema.users)
      .set({ tagTypes: updatedTagTypes })
      .where(eq(schema.users.userId, userId));
  }),
```

6. **updateMetadata** - Update user preferences
```typescript
updateMetadata: publicProcedure
  .input(z.object({
    metadata: z.record(z.unknown()),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;

    await db.update(schema.users)
      .set({ metadata: input.metadata })
      .where(eq(schema.users.userId, userId));

    return input.metadata;
  }),
```

#### FX Router

**File:** `src/server/api/routers/fx.ts`

**Procedures:**

1. **getLatest** - Get latest FX rates (from DB cache)
```typescript
getLatest: publicProcedure.query(async () => {
  const latestRate = await db.query.fxRates.findFirst({
    orderBy: [desc(schema.fxRates.createdAt)],
  });

  if (!latestRate) {
    throw new Error("No FX rates available");
  }

  return FxRate.fromDB(latestRate);
}),
```

**Response Type:** `FxRate` (with `data: FxRatePairs`)

2. **update** - Fetch new rates from external API
```typescript
update: publicProcedure.mutation(async () => {
  const newRates = await fetchFxRates();  // External API call

  const [inserted] = await db.insert(schema.fxRates)
    .values({ data: newRates })
    .returning();

  return FxRate.fromDB(inserted!);
}),
```

**External API:** FxRatesApi client (`src/server/api/utils/fxRateApiClient.ts`)

#### Clerk Router

**File:** `src/server/api/routers/clerk.ts`

**Purpose:** Handle Clerk webhook events (user.created, user.updated, etc.)

**Note:** Currently minimal implementation - webhooks not fully configured.

---

## Business Logic Layer

### Controller Pattern

**File:** `src/server/controller/clerkController.ts`

#### touchUser Function

**Purpose:** Ensure user exists in database, create if new, update `seenAt` if existing

```typescript
export async function touchUser(userId: string): Promise<User> {
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.userId, userId),
  });

  if (existingUser) {
    // Update last seen timestamp
    await db.update(schema.users)
      .set({ seenAt: new Date() })
      .where(eq(schema.users.userId, userId));

    return User.fromDB(existingUser);
  } else {
    // Create new user with seed data
    console.log(`Creating new user: ${userId}`);
    return await seedNewUser(userId);
  }
}
```

**Usage:** Called at start of most API routes to ensure user record exists

**Benefits:**
- Auto-creates users on first API call
- Tracks user activity with `seenAt`
- Eliminates need for explicit user creation endpoint

### Seed New User

**File:** `src/server/db/seedNewUser.ts`

**Purpose:** Initialize new users with example data and default preferences

```typescript
export async function seedNewUser(userId: string): Promise<User> {
  // 1. Create default tag types
  const tagTypes = [
    new TagType("category", "Category", "#3b82f6"),  // Blue
    new TagType("source", "Source", "#10b981"),      // Green
    new TagType("account", "Account", "#f59e0b"),    // Amber
  ];

  // 2. Create default tags
  const tags = [
    new Tag("tag-food", "category", "Food"),
    new Tag("tag-transport", "category", "Transport"),
    new Tag("tag-salary", "category", "Salary"),
    new Tag("tag-amex", "source", "AMEX Card"),
    new Tag("tag-checking", "account", "Checking Account"),
  ];

  // 3. Set default metadata
  const metadata = {
    currency: "GBP",
    frequency: "monthly",
  };

  // 4. Insert user record
  const [newUser] = await db.insert(schema.users).values({
    userId,
    tags: tags.map(t => t.toDB()),
    tagTypes: tagTypes.map(tt => tt.toPlainObject()),
    metadata,
  }).returning();

  // 5. Create example expenses
  await db.insert(schema.expenses).values([
    {
      userId,
      name: "Morning Coffee",
      amount: 425,  // £4.25
      currency: "GBP",
      frequency: "daily",
      tags: ["tag-food", "tag-amex"],
    },
    {
      userId,
      name: "Weekly Groceries",
      amount: 8500,  // £85.00
      currency: "GBP",
      frequency: "weekly",
      tags: ["tag-food", "tag-checking"],
    },
    {
      userId,
      name: "Monthly Salary",
      amount: 350000,  // £3,500.00
      currency: "GBP",
      frequency: "monthly",
      tags: ["tag-salary", "tag-checking"],
    },
  ]);

  return User.fromDB(newUser!);
}
```

**Default Data Provided:**
- 3 tag types (Category, Source, Account)
- 5 tags (Food, Transport, Salary, AMEX, Checking)
- 3 example expenses (Coffee, Groceries, Salary)
- User preferences (GBP, monthly)

---

## Type System

### Type Hierarchy

```
┌─────────────────────────────────┐
│  Database Layer (Drizzle)       │
│  type DBUser, DBExpense, DBTag  │
└────────────┬────────────────────┘
             │ fromDB()
             ↓
┌─────────────────────────────────┐
│  Domain Layer (Classes)         │
│  class User, Expense, Tag       │
└────────────┬────────────────────┘
             │ toPlainObject()
             ↓
┌─────────────────────────────────┐
│  Transfer Layer (Plain Objects) │
│  JSON-serializable data         │
└────────────┬────────────────────┘
             │ tRPC
             ↓
┌─────────────────────────────────┐
│  Client Layer (React)           │
│  useState, props, etc.          │
└─────────────────────────────────┘
```

### Database Types

**Generated by Drizzle:**
```typescript
// src/server/db/schema.ts (inferred types)
export type DBUser = typeof users.$inferSelect;
export type DBExpense = typeof expenses.$inferSelect;
export type DBTag = { tagId: string; tagTypeId: string; name: string };
```

### Domain Classes

**Files:** `src/types/*.ts`

#### User Class

**File:** `src/types/User.ts`

```typescript
export class User implements PlainObjectConvertible {
  constructor(
    public userId: string,
    public tags: Tag[],
    public tagTypes: TagType[],
    public metadata: Record<string, unknown>,
    public createdAt: Date,
    public updatedAt: Date,
    public seenAt: Date
  ) {}

  static fromDB(dbUser: DBUser): User {
    return new User(
      dbUser.userId,
      dbUser.tags.map(Tag.fromDB),
      dbUser.tagTypes.map(TagType.fromPlainObject),
      dbUser.metadata,
      new Date(dbUser.createdAt),
      new Date(dbUser.updatedAt),
      new Date(dbUser.seenAt)
    );
  }

  toPlainObject() {
    return {
      userId: this.userId,
      tags: this.tags.map(t => t.toPlainObject()),
      tagTypes: this.tagTypes.map(tt => tt.toPlainObject()),
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      seenAt: this.seenAt.toISOString(),
    };
  }

  // Helper methods
  getTagById(tagId: string): Tag | undefined {
    return this.tags.find(t => t.tagId === tagId);
  }

  getTagTypeById(tagTypeId: string): TagType | undefined {
    return this.tagTypes.find(tt => tt.tagTypeId === tagTypeId);
  }
}
```

#### Expense Class

**File:** `src/types/Expense.ts`

```typescript
export class Expense implements PlainObjectConvertible {
  constructor(
    public id: number,
    public userId: string,
    public tags: string[],
    public name: string,
    public amount: number,  // In cents/pence
    public currency: string,
    public frequency: string,
    public extra: Record<string, unknown>,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromDB(dbExpense: DBExpense): Expense {
    return new Expense(
      dbExpense.id,
      dbExpense.userId,
      dbExpense.tags,
      dbExpense.name,
      dbExpense.amount,
      dbExpense.currency,
      dbExpense.frequency,
      dbExpense.extra,
      new Date(dbExpense.createdAt),
      new Date(dbExpense.updatedAt)
    );
  }

  toPlainObject() {
    return {
      id: this.id,
      userId: this.userId,
      tags: this.tags,
      name: this.name,
      amount: this.amount,
      currency: this.currency,
      frequency: this.frequency,
      extra: this.extra,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // Helper methods
  getAmountInMajorUnits(): number {
    return this.amount / 100;  // £1.50, $10.00, etc.
  }

  hasTag(tagId: string): boolean {
    return this.tags.includes(tagId);
  }
}
```

#### Tag Class

**File:** `src/types/Tag.ts`

```typescript
export class Tag implements PlainObjectConvertible {
  constructor(
    public tagId: string,
    public tagTypeId: string,
    public name: string
  ) {}

  static fromDB(dbTag: DBTag): Tag {
    return new Tag(dbTag.tagId, dbTag.tagTypeId, dbTag.name);
  }

  toDB(): DBTag {
    return {
      tagId: this.tagId,
      tagTypeId: this.tagTypeId,
      name: this.name,
    };
  }

  toPlainObject() {
    return {
      tagId: this.tagId,
      tagTypeId: this.tagTypeId,
      name: this.name,
    };
  }
}
```

#### TagType Class

**File:** `src/types/TagType.ts`

```typescript
export class TagType implements PlainObjectConvertible {
  constructor(
    public tagTypeId: string,
    public name: string,
    public colour: string
  ) {}

  static fromPlainObject(obj: any): TagType {
    return new TagType(obj.tagTypeId, obj.name, obj.colour);
  }

  toPlainObject() {
    return {
      tagTypeId: this.tagTypeId,
      name: this.name,
      colour: this.colour,
    };
  }
}
```

---

## Authentication & Authorization

### Clerk Integration

**Middleware:** `src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();  // Require authentication
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**Protected Routes:** Everything except `/sign-in` and `/sign-up`

### Authorization Pattern

**tRPC Context:**
```typescript
// src/server/api/trpc.ts
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId } = await auth();  // Clerk
  return { userId };  // null if not authenticated
};
```

**Route-Level Checks:**
```typescript
// src/server/api/routers/expense.ts
getMine: publicProcedure.query(async ({ ctx }) => {
  const userId = ctx.userId!;  // Assert non-null (middleware ensures auth)

  // Filter by userId for data isolation
  const expenses = await db.query.expenses.findMany({
    where: eq(schema.expenses.userId, userId),
  });

  return expenses.map(Expense.fromDB);
}),
```

**Data Isolation:**
- All queries filter by `userId`
- Users can only access their own data
- No cross-user data leakage

---

## Data Validation

### Zod Schemas

**Input Validation:**
```typescript
import { z } from "zod";

// Expense creation schema
const createExpenseSchema = z.object({
  name: z.string().min(1, "Name required"),
  amount: z.number().int().positive("Amount must be positive"),
  currency: z.enum(["GBP", "USD", "EUR", "RON"]),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  tags: z.array(z.string()),
});

// Usage in tRPC
createMine: publicProcedure
  .input(createExpenseSchema)
  .mutation(async ({ input }) => {
    // input is fully typed and validated
  }),
```

**Error Handling:**
```typescript
// src/server/api/trpc.ts
errorFormatter({ shape, error }) {
  return {
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError
        ? error.cause.flatten()
        : null,
    },
  };
}
```

**Client-Side Errors:**
```typescript
// Validation errors available in client
const mutation = api.expense.createMine.useMutation();
mutation.mutate(data, {
  onError: (error) => {
    if (error.data?.zodError) {
      console.log(error.data.zodError.fieldErrors);
    }
  },
});
```

---

## External Services

### FX Rates API

**File:** `src/server/api/utils/fxRateApiClient.ts`

**Purpose:** Fetch currency exchange rates from external API

```typescript
export async function fetchFxRates(): Promise<FxRatePairs> {
  const apiKey = process.env.FX_RATES_API_KEY;
  const response = await fetch(
    `https://api.fxratesapi.com/latest?apikey=${apiKey}&currencies=GBP,USD,EUR,RON`
  );

  const data = await response.json();

  // Transform API response to FxRatePairs format
  return {
    GBP: {
      GBP: 1,
      USD: data.rates.USD / data.rates.GBP,
      EUR: data.rates.EUR / data.rates.GBP,
      RON: data.rates.RON / data.rates.GBP,
    },
    USD: { /* ... */ },
    EUR: { /* ... */ },
    RON: { /* ... */ },
  };
}
```

**Caching Strategy:**
1. Check database for latest rate
2. If `createdAt` > 24 hours ago, fetch new rate
3. Store new rate in database
4. Return cached or fresh rate

---

## Error Handling

### Error Types

1. **Validation Errors** - Zod schema failures
2. **Not Found Errors** - Resource doesn't exist
3. **Authorization Errors** - User doesn't own resource
4. **Database Errors** - Query failures
5. **External API Errors** - FX API failures

### Error Patterns

**Example: Ownership Check**
```typescript
updateMine: publicProcedure
  .input(z.object({ id: z.number(), /* ... */ }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId!;

    const existing = await db.query.expenses.findFirst({
      where: and(
        eq(schema.expenses.id, input.id),
        eq(schema.expenses.userId, userId)
      ),
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Expense not found or you don't have permission",
      });
    }

    // Proceed with update...
  }),
```

**Example: Validation Check**
```typescript
deleteTag: publicProcedure
  .input(z.object({ tagId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if tag is in use
    const expensesWithTag = await db.query.expenses.findMany({
      where: and(
        eq(schema.expenses.userId, ctx.userId!),
        sql`${schema.expenses.tags}::jsonb @> ${JSON.stringify([input.tagId])}::jsonb`
      ),
    });

    if (expensesWithTag.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot delete tag that is in use by expenses",
      });
    }

    // Proceed with deletion...
  }),
```

### Sentry Integration

**File:** `next.config.js`

```typescript
import { withSentryConfig } from "@sentry/nextjs";

const config = {
  // Next.js config
};

export default withSentryConfig(config, {
  org: "recspenses",
  project: "recspenses",
  silent: !process.env.CI,
});
```

**Error Tracking:**
- Automatic error capture in production
- Source map upload for stack traces
- Performance monitoring

---

## Performance Considerations

### Query Optimization

**Indexes:**
- Primary keys on `id` (expenses) and `userId` (users)
- Consider adding index on `expenses.userId` for faster filtering

**Query Patterns:**
```typescript
// Good: Filter early
const expenses = await db.query.expenses.findMany({
  where: eq(schema.expenses.userId, userId),
  orderBy: [desc(schema.expenses.createdAt)],
  limit: 100,  // Pagination if needed
});

// Avoid: Fetching all then filtering in JS
const allExpenses = await db.query.expenses.findMany();
const userExpenses = allExpenses.filter(e => e.userId === userId);  // ❌
```

### Caching Strategies

**FX Rates:**
- Store in database (cheap reads)
- TTL: 24 hours
- Reduces external API calls from N to ~1/day

**User Data:**
- `touchUser()` pattern updates `seenAt` but doesn't refetch
- Consider Redis for high-traffic scenarios

### JSON Storage Trade-offs

**Pros:**
- Flexible schema for tags
- No additional tables/joins needed
- Fast for small arrays (<100 items)

**Cons:**
- No referential integrity
- Harder to query specific tag properties
- Can't index individual tags easily

**Mitigation:**
- Application-level validation
- Keep tag arrays small
- Use PostgreSQL JSONB operators for querying

---

## Testing Considerations

### Manual Testing

**Drizzle Studio:**
```bash
pnpm db:studio
```
- Visual database browser
- Inspect records
- Run manual queries
- Test data validation

**Local Docker:**
```bash
docker compose up
```
- Isolated database
- Reproducible state
- Reset with `docker compose down -v`

### Future: Automated Testing

**Unit Tests:**
- Test domain class methods
- Test validation logic
- Test helper functions

**Integration Tests:**
- Test tRPC procedures
- Mock database with in-memory PostgreSQL
- Test authentication flows

**E2E Tests:**
- Playwright/Cypress
- Full user journeys
- Test with real Clerk auth

---

## Common Backend Tasks

### Adding a New Field to Expense

1. **Update schema:**
```typescript
// src/server/db/schema.ts
export const expenses = pgTable("recspenses_expense", {
  // ... existing fields
  notes: text("notes").default(""),  // New field
});
```

2. **Generate migration:**
```bash
pnpm db:generate
```

3. **Apply migration:**
```bash
pnpm db:push
```

4. **Update TypeScript class:**
```typescript
// src/types/Expense.ts
export class Expense {
  constructor(
    // ... existing fields
    public notes: string
  ) {}

  static fromDB(dbExpense: DBExpense): Expense {
    return new Expense(
      // ... existing fields
      dbExpense.notes
    );
  }

  toPlainObject() {
    return {
      // ... existing fields
      notes: this.notes,
    };
  }
}
```

5. **Update tRPC input schemas:**
```typescript
// src/server/api/routers/expense.ts
createMine: publicProcedure
  .input(z.object({
    // ... existing fields
    notes: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    await db.insert(schema.expenses).values({
      // ... existing fields
      notes: input.notes ?? "",
    });
  }),
```

### Adding a New Router

1. **Create router file:**
```typescript
// src/server/api/routers/analytics.ts
import { createTRPCRouter, publicProcedure } from "../trpc";

export const analyticsRouter = createTRPCRouter({
  getMonthlyTotal: publicProcedure.query(async ({ ctx }) => {
    // Implementation
  }),
});
```

2. **Register in root:**
```typescript
// src/server/api/root.ts
import { analyticsRouter } from "./routers/analytics";

export const appRouter = createCallerFactory(createTRPCRouter)({
  // ... existing routers
  analytics: analyticsRouter,
});
```

3. **Use in components:**
```typescript
const { data } = api.analytics.getMonthlyTotal.useQuery();
```

---

## Security Checklist

- ✅ All routes protected by Clerk middleware
- ✅ User data filtered by `userId`
- ✅ Input validation with Zod
- ✅ SQL injection prevented (Drizzle ORM)
- ✅ Ownership checks before updates/deletes
- ✅ Error messages don't leak sensitive data
- ⚠️ Rate limiting (planned - Upstash)
- ⚠️ CSRF tokens (Next.js default)

---

## Summary

The Recspenses backend is built on:
1. **Type-safe APIs** with tRPC
2. **PostgreSQL database** via Drizzle ORM
3. **Class-based domain models** with validation
4. **Clerk authentication** with automatic user creation
5. **JSON storage** for flexible tagging system
6. **External FX API** with database caching

Key patterns:
- Touch pattern for user auto-creation
- Plain object serialization for Next.js
- Input validation with Zod
- Data isolation by userId
- Error handling with TRPCError

For frontend details, see [CLAUDE-FRONTEND.md](./CLAUDE-FRONTEND.md).
