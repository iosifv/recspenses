# Claude AI Documentation - Recspenses

> **Last Updated:** 2025-11-18
> **Version:** 0.1.0
> **Purpose:** Comprehensive guide for AI assistants working on the Recspenses codebase

## Table of Contents

- [Quick Reference](#quick-reference)
- [Project Overview](#project-overview)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Essential Patterns](#essential-patterns)
- [Common Tasks](#common-tasks)
- [Deep Dives](#deep-dives)

---

## Quick Reference

### What is Recspenses?

**Recspenses** is a modern expense management application that helps users track, categorize, and analyze their recurring expenses across multiple currencies and frequencies. Built with the T3 Stack (Next.js, TypeScript, tRPC, Tailwind, Drizzle ORM).

### Key Capabilities

- 💰 **Multi-Currency Support** - GBP, USD, EUR, RON with real-time FX rates
- 📊 **Frequency Normalization** - Convert expenses between daily/weekly/monthly/yearly
- 🏷️ **Hierarchical Tagging** - Organize expenses with custom tag types (Category, Source, Account)
- 📈 **Analytics Dashboard** - Visualize spending patterns with charts and tables
- 🔐 **Authentication** - Secure sign-in with Clerk
- 🎨 **Modern UI** - Shadcn UI components with dark mode support

### Tech Stack Summary

```
Frontend:  Next.js 15 + React 19 + TypeScript + Tailwind + Shadcn UI
Backend:   tRPC + Drizzle ORM + Vercel Postgres
Auth:      Clerk
Monitoring: Sentry
Deployment: Vercel
```

### Repository Structure

```
/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── dashboard/         # Analytics & visualization
│   │   ├── editor/            # Expense CRUD operations
│   │   └── settings/          # User settings & tags
│   ├── server/
│   │   ├── api/routers/       # tRPC API routes
│   │   ├── db/                # Database schema & client
│   │   └── controller/        # Business logic
│   ├── types/                 # TypeScript type definitions
│   ├── components/            # Reusable UI components
│   └── lib/                   # Utility functions
├── drizzle/                   # Database migrations
└── public/                    # Static assets
```

### Environment Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev                        # http://localhost:3000

# Database management
pnpm db:push                    # Push schema changes
pnpm db:studio                  # Open Drizzle Studio GUI

# Local PostgreSQL (Docker)
docker compose up               # Start PostgreSQL container
```

### Critical Files

| File | Purpose |
|------|---------|
| `src/server/db/schema.ts` | Database schema definition |
| `src/server/api/root.ts` | tRPC router aggregation |
| `src/types/*` | Core type definitions |
| `src/app/layout.tsx` | Root layout with providers |
| `src/middleware.ts` | Clerk authentication middleware |
| `drizzle.config.ts` | Database connection config |
| `.env` | Environment variables |

---

## Project Overview

### Business Domain

Recspenses solves the problem of tracking recurring expenses that occur at different frequencies (daily coffee, weekly groceries, monthly rent, yearly insurance) and in different currencies. The app normalizes these to a common frequency and currency for comparison and analysis.

### User Journey

1. **Sign Up** → Clerk authentication with automatic user seeding
2. **Dashboard** → View normalized expenses with analytics and charts
3. **Editor** → Create/edit/delete expenses with tag assignment
4. **Settings** → Manage tag types, tags, and preferences (currency, frequency)

### Core Entities

- **User** - Authenticated user with preferences and custom tags
- **Expense** - Individual expense record with amount, currency, frequency, tags
- **Tag** - Custom label for categorizing expenses (e.g., "Food", "Transportation")
- **TagType** - Category of tags (e.g., "Category", "Source", "Account")
- **FxRate** - Currency exchange rate data

---

## Architecture at a Glance

### Data Flow

```
┌─────────────┐
│ Client      │
│ (Browser)   │
└──────┬──────┘
       │ tRPC calls (type-safe)
       ↓
┌─────────────┐
│ Next.js API │
│ (tRPC)      │
└──────┬──────┘
       │ Drizzle ORM queries
       ↓
┌─────────────┐
│ PostgreSQL  │
│ (Vercel)    │
└─────────────┘
```

### Key Architectural Decisions

1. **Class-Based Domain Models** - Business entities are classes (User, Expense, Tag) with validation logic
2. **Plain Object Serialization** - Classes implement `toPlainObject()` for Next.js server/client boundary
3. **JSON Storage** - Tags and metadata stored as JSON in PostgreSQL for flexibility
4. **Touch Pattern** - Auto-create/update users on first access with `touchUser()`
5. **FX Rate Caching** - Store exchange rates in DB to minimize external API calls
6. **Public Procedures** - All tRPC routes use `publicProcedure` (auth handled in middleware)

### Type System Hierarchy

```typescript
// Database Layer (Drizzle schema types)
type DBUser, DBExpense, DBTag

// Domain Layer (Classes with business logic)
class User, Expense, Tag, TagType

// Transfer Layer (Serialized for client)
interface PlainObjectConvertible {
  toPlainObject(): Record<string, any>
}

// API Layer (tRPC input/output schemas)
z.object({ ... }) // Zod schemas
```

---

## Essential Patterns

### 1. Server/Client Component Pattern

**Server Components** (default in Next.js App Router):
```typescript
// src/app/dashboard/page.tsx
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const user = await api.user.getMe();
  const expenses = await api.expense.getMine();

  // Serialize classes to plain objects for client components
  return <ComponentDashboard
    user={user.toPlainObject()}
    expenses={expenses.map(e => e.toPlainObject())}
  />;
}
```

**Client Components** (interactive UI):
```typescript
// src/app/dashboard/ComponentDashboard.tsx
"use client";

import { api } from "~/trpc/react";

export function ComponentDashboard({ user, expenses }) {
  // Client-side tRPC hooks for mutations
  const updateUser = api.user.updateMetadata.useMutation();

  // ... interactive UI
}
```

### 2. Plain Object Serialization Pattern

**Why?** Next.js can't serialize class instances across server/client boundary.

```typescript
// src/types/User.ts
export class User implements PlainObjectConvertible {
  // ... class properties and methods

  toPlainObject() {
    return {
      userId: this.userId,
      tags: this.tags.map(tag => tag.toPlainObject()),
      tagTypes: this.tagTypes.map(tt => tt.toPlainObject()),
      metadata: this.metadata,
      // ... serialize all properties
    };
  }
}
```

### 3. Tag Management Pattern

Tags are hierarchical with TagTypes as categories:

```typescript
// TagType defines a category (e.g., "Category", "Source")
class TagType {
  tagTypeId: string;
  name: string;
  colour: string;
}

// Tag belongs to a TagType (e.g., "Food" belongs to "Category")
class Tag {
  tagId: string;
  tagTypeId: string;
  name: string;
}

// Expense has array of tag IDs
class Expense {
  tags: string[];  // ["tag-food", "tag-amex"]
}
```

### 4. Currency & Frequency Normalization Pattern

**Frequency Conversion:**
```typescript
// src/types/FrequencyLookup.ts
const frequencyLookup = {
  daily: { daily: 1, weekly: 7, monthly: 30.4375, yearly: 365.25 },
  weekly: { daily: 1/7, weekly: 1, monthly: 4.348, yearly: 52.179 },
  // ...
};

// Convert expense to target frequency
const normalizedAmount = expense.amount * frequencyLookup[expense.frequency][targetFrequency];
```

**Currency Conversion:**
```typescript
// FX rates stored as matrix
type FxRatePairs = {
  GBP: { USD: 1.27, EUR: 1.17, RON: 5.82 },
  USD: { GBP: 0.79, EUR: 0.92, RON: 4.58 },
  // ...
};

// Convert amount from one currency to another
const converted = amount * fxRates[fromCurrency][toCurrency];
```

### 5. Touch Pattern for User Management

```typescript
// src/server/controller/clerkController.ts
export async function touchUser(userId: string): Promise<User> {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });

  if (existingUser) {
    // Update seenAt timestamp
    await db.update(users).set({ seenAt: new Date() }).where(eq(users.userId, userId));
    return User.fromDB(existingUser);
  } else {
    // Create new user with seed data
    return await seedNewUser(userId);
  }
}
```

---

## Common Tasks

### Adding a New tRPC Route

1. **Define the procedure** in `src/server/api/routers/*.ts`:

```typescript
// src/server/api/routers/expense.ts
export const expenseRouter = createTRPCRouter({
  getMine: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const expenses = await db.query.expenses.findMany({
      where: eq(schema.expenses.userId, userId),
    });
    return expenses.map(Expense.fromDB);
  }),

  createMine: publicProcedure
    .input(z.object({
      name: z.string(),
      amount: z.number(),
      currency: z.string(),
      frequency: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      // ... create expense
    }),
});
```

2. **Register router** in `src/server/api/root.ts`:

```typescript
export const appRouter = createCallerFactory(createTRPCRouter)({
  expense: expenseRouter,
  user: userRouter,
  // ... your new router
});
```

3. **Use in components:**

```typescript
// Server component
import { api } from "~/trpc/server";
const expenses = await api.expense.getMine();

// Client component
"use client";
import { api } from "~/trpc/react";
const { data: expenses } = api.expense.getMine.useQuery();
```

### Adding a New Database Table

1. **Define schema** in `src/server/db/schema.ts`:

```typescript
export const myTable = pgTable("recspenses_my_table", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

2. **Generate migration:**

```bash
pnpm db:generate
```

3. **Push to database:**

```bash
pnpm db:push
```

4. **Create TypeScript types** in `src/types/`:

```typescript
// src/types/MyEntity.ts
export type DBMyEntity = typeof myTable.$inferSelect;

export class MyEntity implements PlainObjectConvertible {
  constructor(public id: number, public name: string) {}

  static fromDB(db: DBMyEntity): MyEntity {
    return new MyEntity(db.id, db.name);
  }

  toPlainObject() {
    return { id: this.id, name: this.name };
  }
}
```

### Adding a New Page

1. **Create page** in `src/app/my-page/page.tsx`:

```typescript
import { api } from "~/trpc/server";
import { ComponentMyPage } from "./ComponentMyPage";

export default async function MyPage() {
  const data = await api.myRouter.getData();

  return <ComponentMyPage data={data.toPlainObject()} />;
}
```

2. **Create client component** in `src/app/my-page/ComponentMyPage.tsx`:

```typescript
"use client";

export function ComponentMyPage({ data }) {
  return <div>{/* ... UI */}</div>;
}
```

3. **Add navigation** in `src/app/ComponentTopNav.tsx`:

```typescript
<Link href="/my-page">My Page</Link>
```

### Adding a New Shadcn Component

```bash
pnpm dlx shadcn@latest add [component-name]
```

Example:
```bash
pnpm dlx shadcn@latest add dropdown-menu
```

This adds the component to `src/components/ui/`.

---

## Deep Dives

### tRPC Authentication Flow

1. **Middleware** (`src/middleware.ts`) - Clerk validates session
2. **Context** (`src/server/api/trpc.ts`) - Extract `userId` from Clerk
3. **Procedures** (`src/server/api/routers/*.ts`) - Access `ctx.userId`
4. **Touch User** - Auto-create user on first API call

### Expense Normalization Pipeline

1. **Fetch Expenses** - Get all user expenses from DB
2. **Fetch FX Rates** - Get latest exchange rates
3. **Get User Preferences** - Target currency and frequency
4. **Convert Currency** - `amount * fxRate[from][to]`
5. **Convert Frequency** - `amount * frequencyLookup[from][to]`
6. **Aggregate by Tags** - Sum normalized amounts by tag
7. **Display** - Show in charts and tables

### Seeding New Users

When a new user signs up, they get:
- Default tag types: Category, Source, Account
- Example tags: Food, Transport, Salary, AMEX, Checking
- Sample expenses: Coffee, Groceries, Salary, Rent
- Default metadata: `currency: "GBP"`, `frequency: "monthly"`

See `src/server/db/seedNewUser.ts` for details.

---

## Advanced Topics

For detailed information on specific layers:

- **Backend Architecture** → See [CLAUDE-BACKEND.md](./CLAUDE-BACKEND.md)
  - Database schema deep dive
  - API router details
  - Business logic patterns
  - Data validation strategies

- **Frontend Patterns** → See [CLAUDE-FRONTEND.md](./CLAUDE-FRONTEND.md)
  - Component architecture
  - State management
  - UI patterns and conventions
  - Data table implementations

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Start PostgreSQL
docker compose up

# Terminal 2: Start dev server
pnpm dev

# Terminal 3: Open Drizzle Studio (optional)
pnpm db:studio
```

### Making Database Changes

```bash
# 1. Edit src/server/db/schema.ts
# 2. Generate migration
pnpm db:generate

# 3. Apply migration (development)
pnpm db:push

# 4. Verify in Drizzle Studio
pnpm db:studio
```

### Testing Changes

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run build
pnpm build
```

### Deployment

- **Platform:** Vercel
- **Database:** Vercel Postgres
- **Automatic:** Push to `main` triggers deployment
- **Preview:** PRs get preview deployments

---

## Troubleshooting

### Common Issues

**Issue:** tRPC type errors after schema change
```bash
# Solution: Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Issue:** Database connection error
```bash
# Solution: Check environment variables
cat .env | grep POSTGRES_URL

# Ensure Docker is running (local dev)
docker compose ps
```

**Issue:** "User not found" errors
```bash
# Solution: User auto-creation on first access
# Check Clerk authentication in browser console
# Verify CLERK_SECRET_KEY in .env
```

**Issue:** Stale data in UI
```bash
# Solution: tRPC uses React Query caching
# Force refetch or use invalidation:
utils.expense.getMine.invalidate();
```

---

## Best Practices

### When Writing Code

1. **Always use types** - Leverage TypeScript strictly (`noUncheckedIndexedAccess`)
2. **Server vs Client** - Keep data fetching in server components when possible
3. **Serialize classes** - Use `toPlainObject()` when passing to client components
4. **Validate inputs** - Use Zod schemas in tRPC procedures
5. **Handle errors** - Use try/catch and display errors with Sonner toasts
6. **Follow conventions** - Use existing naming patterns for consistency

### When Making Changes

1. **Check types first** - Look at `src/types/*` to understand domain model
2. **Update both layers** - If changing DB schema, update TypeScript types too
3. **Test both modes** - Verify changes work in light and dark mode
4. **Check mobile** - Tailwind classes should be responsive
5. **Use VSCode tasks** - Leverage `.vscode/tasks.json` for common commands

### Security Considerations

1. **Authentication** - All routes protected by Clerk middleware
2. **User isolation** - Always filter by `userId` in queries
3. **Input validation** - Zod schemas validate all user input
4. **SQL injection** - Drizzle ORM parameterizes queries automatically
5. **Rate limiting** - (Planned: Upstash integration)

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **tRPC Docs:** https://trpc.io/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs
- **Shadcn UI:** https://ui.shadcn.com
- **Clerk Auth:** https://clerk.com/docs
- **T3 Stack:** https://create.t3.gg

---

## Glossary

- **T3 Stack** - TypeScript, tRPC, Tailwind technology stack
- **tRPC** - TypeScript Remote Procedure Call - type-safe API layer
- **Drizzle ORM** - TypeScript-first SQL query builder and ORM
- **Shadcn UI** - Copy-paste component library built on Radix UI
- **Clerk** - Authentication and user management service
- **SuperJSON** - Serialization library for complex types (Date, Map, Set)
- **Frequency Normalization** - Converting expenses to common time period
- **Touch Pattern** - Auto-create/update user on first access
- **Plain Object** - Simple JavaScript object (no class methods)

---

**Next Steps:** For deeper dives into specific areas, see:
- [CLAUDE-BACKEND.md](./CLAUDE-BACKEND.md) - Backend architecture and API details
- [CLAUDE-FRONTEND.md](./CLAUDE-FRONTEND.md) - Frontend components and UI patterns
