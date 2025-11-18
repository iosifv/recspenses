# Claude AI Documentation - Frontend Architecture

> **Part of:** Recspenses Claude Documentation Suite
> **Focus:** Frontend architecture, component patterns, UI conventions, and state management
> **See also:** [CLAUDE.md](./CLAUDE.md) | [CLAUDE-BACKEND.md](./CLAUDE-BACKEND.md)

## Table of Contents

- [Frontend Overview](#frontend-overview)
- [App Router Structure](#app-router-structure)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [UI Component Library](#ui-component-library)
- [Styling Patterns](#styling-patterns)
- [Data Tables](#data-tables)
- [Forms & Dialogs](#forms--dialogs)
- [Charts & Visualization](#charts--visualization)
- [Responsive Design](#responsive-design)
- [Common Patterns](#common-patterns)

---

## Frontend Overview

### Technology Stack

```
┌───────────────────────────────────┐
│  Next.js 15 (App Router)          │  ← Framework
├───────────────────────────────────┤
│  React 19 + TypeScript            │  ← UI Layer
├───────────────────────────────────┤
│  tRPC Client (React Query)        │  ← Data Fetching
├───────────────────────────────────┤
│  Tailwind CSS + Shadcn UI         │  ← Styling
├───────────────────────────────────┤
│  Radix UI Primitives              │  ← Base Components
└───────────────────────────────────┘
```

### Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 15.1.6 | React framework with App Router |
| React | 19.0.0 | UI rendering |
| TypeScript | 5.5.3 | Type safety |
| Tailwind CSS | 3.4.3 | Utility-first styling |
| Shadcn UI | Latest | Pre-built components |
| Radix UI | Various | Headless UI primitives |
| TanStack Table | 8.20.5 | Data tables |
| TanStack Query | 5.50.0 | Server state (via tRPC) |
| Recharts | 2.13.3 | Charts & visualizations |
| Lucide React | Latest | Icons |
| Sonner | Latest | Toast notifications |
| next-themes | Latest | Dark mode |

### Directory Structure

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── ComponentTopNav.tsx       # Global navigation
│   │
│   ├── dashboard/                # Analytics page
│   │   ├── page.tsx              # Server component
│   │   ├── ComponentDashboard.tsx
│   │   ├── ComponentChart.tsx
│   │   ├── ComponentCardSettings.tsx
│   │   ├── columns.tsx           # Table column definitions
│   │   └── data-table.tsx        # Table component
│   │
│   ├── editor/                   # Expense CRUD page
│   │   ├── page.tsx
│   │   ├── ComponentDialogEdit.tsx
│   │   ├── ComponentDialogDelete.tsx
│   │   ├── ComponentTableRowNew.tsx
│   │   ├── columns.tsx
│   │   └── data-table.tsx
│   │
│   └── settings/                 # Settings page
│       ├── page.tsx
│       ├── ComponentCardMetadata.tsx
│       ├── ComponentCardTagTypeNew.tsx
│       ├── ComponentCardTagTypeExisting.tsx
│       └── ComponentHoverUserInfo.tsx
│
├── components/
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── hover-card.tsx
│   │   ├── sonner.tsx
│   │   └── ... (24 components total)
│   │
│   ├── custom/                   # Custom components
│   │   ├── ExpenseTagBadge.tsx
│   │   ├── SettingTagBadge.tsx
│   │   └── SimpleTagBadge.tsx
│   │
│   └── hero-icons/               # Icon components
│       ├── PlusIcon.tsx
│       ├── EditIcon.tsx
│       └── TrashIcon.tsx
│
├── lib/
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   ├── titleEnv.tsx              # Environment-aware page title
│   └── appApiUtils.ts            # Frontend API utilities
│
├── styles/
│   └── globals.css               # Global styles & Tailwind
│
└── trpc/
    ├── react.tsx                 # tRPC React client
    ├── server.ts                 # tRPC server client
    └── query-client.ts           # React Query config
```

---

## App Router Structure

### Root Layout

**File:** `src/app/layout.tsx`

**Purpose:** Global app shell with providers

```typescript
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system">
            <TRPCReactProvider>
              {children}
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

**Providers:**
1. **ClerkProvider** - Authentication context
2. **ThemeProvider** - Dark mode support
3. **TRPCReactProvider** - tRPC + React Query
4. **Toaster** - Global toast notifications

### Global Navigation

**File:** `src/app/ComponentTopNav.tsx`

**Purpose:** Top navigation bar with user menu

```typescript
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function ComponentTopNav() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-bold">
          Recspenses
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/editor">Editor</Link>
          <Link href="/settings">Settings</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
```

### Page Pattern

**Server Component Pattern:**

```typescript
// src/app/dashboard/page.tsx
import { api } from "~/trpc/server";
import { ComponentDashboard } from "./ComponentDashboard";

export default async function DashboardPage() {
  // Fetch data server-side
  const user = await api.user.getMe();
  const expenses = await api.expense.getMine();
  const fxRates = await api.fx.getLatest();

  // Serialize class instances to plain objects
  return (
    <ComponentDashboard
      user={user.toPlainObject()}
      expenses={expenses.map(e => e.toPlainObject())}
      fxRates={fxRates.toPlainObject()}
    />
  );
}
```

**Client Component Pattern:**

```typescript
// src/app/dashboard/ComponentDashboard.tsx
"use client";

import { api } from "~/trpc/react";

export function ComponentDashboard({ user, expenses, fxRates }) {
  // Client-side mutations
  const updateMetadata = api.user.updateMetadata.useMutation();

  // Interactive UI
  return <div>{/* ... */}</div>;
}
```

---

## Component Architecture

### Naming Conventions

**Page Components:**
- `Component{PageName}` - Main client component for page
- Examples: `ComponentDashboard`, `ComponentEditor`

**Feature Components:**
- `Component{Feature}{Type}` - Specific feature components
- Examples: `ComponentDialogEdit`, `ComponentCardSettings`

**UI Components:**
- `{component-name}` - Shadcn UI components (lowercase)
- Examples: `button`, `dialog`, `card`

**Custom Components:**
- `{Feature}{Type}Badge` - Custom badge variants
- Examples: `ExpenseTagBadge`, `SettingTagBadge`

### Component Structure

**Typical Component File:**

```typescript
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

interface ComponentProps {
  // Props typed from plain objects
  user: ReturnType<typeof User.prototype.toPlainObject>;
  onSuccess?: () => void;
}

export function ComponentExample({ user, onSuccess }: ComponentProps) {
  // Local state
  const [isOpen, setIsOpen] = useState(false);

  // tRPC mutations
  const updateUser = api.user.updateMetadata.useMutation({
    onSuccess: () => {
      toast.success("Updated successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Event handlers
  const handleSubmit = () => {
    updateUser.mutate({ metadata: { /* ... */ } });
  };

  // Render
  return (
    <div className="p-4">
      <Button onClick={handleSubmit}>
        {updateUser.isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
```

### Server vs Client Components

**Server Components (default):**
- ✅ Data fetching with `await`
- ✅ Direct database access via tRPC server
- ✅ No JavaScript sent to client
- ❌ No useState, useEffect, onClick
- **Examples:** `page.tsx` files

**Client Components (`"use client"`):**
- ✅ Interactive UI (onClick, onChange)
- ✅ React hooks (useState, useEffect)
- ✅ tRPC mutations
- ❌ Can't use `await` for data fetching
- **Examples:** `Component*.tsx` files

---

## State Management

### tRPC + React Query

**Query Pattern (Client):**

```typescript
"use client";

import { api } from "~/trpc/react";

export function MyComponent() {
  const { data, isLoading, error } = api.expense.getMine.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.length} expenses</div>;
}
```

**Mutation Pattern:**

```typescript
const utils = api.useUtils();

const createExpense = api.expense.createMine.useMutation({
  onSuccess: () => {
    // Invalidate and refetch expenses
    utils.expense.getMine.invalidate();
    toast.success("Expense created");
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

// Trigger mutation
createExpense.mutate({
  name: "Coffee",
  amount: 450,
  currency: "GBP",
  frequency: "daily",
  tags: ["tag-food"],
});
```

**Optimistic Updates:**

```typescript
const updateExpense = api.expense.updateMine.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.expense.getMine.cancel();

    // Snapshot previous value
    const previousExpenses = utils.expense.getMine.getData();

    // Optimistically update
    utils.expense.getMine.setData(undefined, (old) =>
      old?.map(e => e.id === newData.id ? { ...e, ...newData } : e)
    );

    return { previousExpenses };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.expense.getMine.setData(undefined, context?.previousExpenses);
  },
  onSettled: () => {
    // Refetch to sync with server
    utils.expense.getMine.invalidate();
  },
});
```

### Local State

**useState for UI State:**

```typescript
export function ComponentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* ... */}
    </Dialog>
  );
}
```

**Form State:**

```typescript
export function ComponentForm() {
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    currency: "GBP",
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Input
      value={formData.name}
      onChange={(e) => handleChange("name", e.target.value)}
    />
  );
}
```

---

## UI Component Library

### Shadcn UI Components

**Installation:**
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
```

**Configuration:** `components.json`
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils"
  }
}
```

### Available Components

**Installed Components (24 total):**
- accordion
- alert-dialog
- avatar
- badge
- button
- card
- dialog
- dropdown-menu
- hover-card
- input
- label
- popover
- select
- separator
- sonner (toaster)
- switch
- table
- tabs
- toast
- toggle
- toggle-group
- tooltip

### Button Component

**File:** `src/components/ui/button.tsx`

**Usage:**
```typescript
import { Button } from "~/components/ui/button";

<Button variant="default" size="md">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="link">Link style</Button>
```

**Variants:**
- `default` - Primary blue button
- `destructive` - Red delete button
- `outline` - Bordered button
- `secondary` - Gray button
- `ghost` - Transparent button
- `link` - Link-styled button

**Sizes:**
- `default` - Standard height
- `sm` - Small
- `lg` - Large
- `icon` - Square icon button

### Card Component

**File:** `src/components/ui/card.tsx`

**Usage:**
```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Expenses</CardTitle>
    <CardDescription>Manage your expenses</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Dialog Component

**File:** `src/components/ui/dialog.tsx`

**Usage:**
```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogDescription>Make changes here</DialogDescription>
    </DialogHeader>
    {/* Form fields */}
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Input Component

**File:** `src/components/ui/input.tsx`

**Usage:**
```typescript
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<div>
  <Label htmlFor="name">Name</Label>
  <Input
    id="name"
    type="text"
    placeholder="Enter name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>
```

### Select Component

**File:** `src/components/ui/select.tsx`

**Usage:**
```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

<Select value={currency} onValueChange={setCurrency}>
  <SelectTrigger>
    <SelectValue placeholder="Select currency" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="GBP">GBP (£)</SelectItem>
    <SelectItem value="USD">USD ($)</SelectItem>
    <SelectItem value="EUR">EUR (€)</SelectItem>
    <SelectItem value="RON">RON (lei)</SelectItem>
  </SelectContent>
</Select>
```

### Badge Component

**File:** `src/components/ui/badge.tsx`

**Usage:**
```typescript
import { Badge } from "~/components/ui/badge";

<Badge variant="default">Category</Badge>
<Badge variant="secondary">Source</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

---

## Styling Patterns

### Tailwind CSS

**Global Styles:** `src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... more CSS variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode overrides */
  }
}
```

**CSS Variables Pattern:**
- Light/dark mode with CSS variables
- HSL color format
- Shadcn UI theming system

### Utility Classes

**Common Patterns:**

```typescript
// Layout
<div className="container mx-auto px-4">
<div className="flex items-center justify-between">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Spacing
<div className="p-4">        // Padding all sides
<div className="px-4 py-2">  // Padding x and y
<div className="mt-4 mb-8">  // Margin top and bottom

// Typography
<h1 className="text-2xl font-bold">
<p className="text-sm text-muted-foreground">

// Colors
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-primary text-primary-foreground">

// Borders
<div className="border border-border rounded-lg">
<div className="border-b">

// Shadows
<div className="shadow-sm">
<div className="shadow-md">

// Dark mode
<div className="bg-white dark:bg-slate-900">
```

### cn() Utility

**File:** `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```typescript
import { cn } from "~/lib/utils";

// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  error && "error-class"
)} />

// Merge conflicting classes
<Button className={cn("px-4", customClasses)} />
```

### Dark Mode

**Theme Toggle:**

```typescript
"use client";

import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      Toggle theme
    </Button>
  );
}
```

---

## Data Tables

### TanStack Table Setup

**Column Definition:**

**File:** `src/app/editor/columns.tsx`

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export type ExpenseRow = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  frequency: string;
  tags: string[];
};

export const columns: ColumnDef<ExpenseRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const currency = row.original.currency;
      return `${(amount / 100).toFixed(2)} ${currency}`;
    },
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex gap-1">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">Edit</Button>
    ),
  },
];
```

**Table Component:**

**File:** `src/app/editor/data-table.tsx`

```typescript
"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

**Usage:**

```typescript
import { columns } from "./columns";
import { DataTable } from "./data-table";

export function ExpenseTable({ expenses }) {
  return <DataTable columns={columns} data={expenses} />;
}
```

### Table Features

**Sorting:**
```typescript
const [sorting, setSorting] = useState<SortingState>([]);

const table = useReactTable({
  // ...
  state: { sorting },
  onSortingChange: setSorting,
  getSortedRowModel: getSortedRowModel(),
});

// In column definition
{
  accessorKey: "amount",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Amount
      {column.getIsSorted() === "asc" ? " ↑" : " ↓"}
    </Button>
  ),
}
```

**Filtering:**
```typescript
const [globalFilter, setGlobalFilter] = useState("");

const table = useReactTable({
  // ...
  state: { globalFilter },
  onGlobalFilterChange: setGlobalFilter,
  getFilteredRowModel: getFilteredRowModel(),
});

<Input
  placeholder="Search..."
  value={globalFilter}
  onChange={(e) => setGlobalFilter(e.target.value)}
/>
```

**Pagination:**
```typescript
<div className="flex items-center justify-between">
  <Button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </Button>
  <span>
    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
  </span>
  <Button
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </Button>
</div>
```

---

## Forms & Dialogs

### Edit Dialog Pattern

**File:** `src/app/editor/ComponentDialogEdit.tsx`

```typescript
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

interface EditDialogProps {
  expense: {
    id: number;
    name: string;
    amount: number;
    currency: string;
    frequency: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentDialogEdit({
  expense,
  open,
  onOpenChange,
}: EditDialogProps) {
  const [formData, setFormData] = useState({
    name: expense.name,
    amount: expense.amount / 100,  // Convert cents to major units
    currency: expense.currency,
    frequency: expense.frequency,
  });

  const utils = api.useUtils();
  const updateExpense = api.expense.updateMine.useMutation({
    onSuccess: () => {
      toast.success("Expense updated");
      utils.expense.getMine.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    updateExpense.mutate({
      id: expense.id,
      name: formData.name,
      amount: Math.round(formData.amount * 100),  // Convert to cents
      currency: formData.currency,
      frequency: formData.frequency,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
            />
          </div>

          {/* Currency and Frequency selects... */}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateExpense.isPending}
          >
            {updateExpense.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Delete Confirmation Dialog

**File:** `src/app/editor/ComponentDialogDelete.tsx`

```typescript
"use client";

import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteDialogProps {
  expenseId: number;
  expenseName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentDialogDelete({
  expenseId,
  expenseName,
  open,
  onOpenChange,
}: DeleteDialogProps) {
  const utils = api.useUtils();
  const deleteExpense = api.expense.deleteMine.useMutation({
    onSuccess: () => {
      toast.success("Expense deleted");
      utils.expense.getMine.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{expenseName}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteExpense.mutate({ id: expenseId })}
            className="bg-destructive text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Charts & Visualization

### Recharts Integration

**File:** `src/app/dashboard/ComponentChart.tsx`

```typescript
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    amount: number;
  }[];
}

export function ComponentChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => `£${value.toFixed(2)}`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Legend />
        <Bar
          dataKey="amount"
          fill="hsl(var(--primary))"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

**Usage:**

```typescript
const chartData = [
  { name: "Food", amount: 450.50 },
  { name: "Transport", amount: 200.00 },
  { name: "Entertainment", amount: 150.25 },
];

<ComponentChart data={chartData} />
```

---

## Responsive Design

### Breakpoints

**Tailwind Breakpoints:**
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

**Responsive Grid:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

**Responsive Spacing:**
```typescript
<div className="px-4 md:px-8 lg:px-12">
  {/* Padding increases on larger screens */}
</div>
```

**Responsive Text:**
```typescript
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Font size increases on larger screens */}
</h1>
```

---

## Common Patterns

### Toast Notifications

```typescript
import { toast } from "sonner";

// Success
toast.success("Changes saved successfully");

// Error
toast.error("Failed to save changes");

// Info
toast.info("Processing your request");

// Loading
toast.loading("Saving...");

// Promise
toast.promise(
  saveData(),
  {
    loading: "Saving...",
    success: "Saved successfully",
    error: "Failed to save",
  }
);
```

### Custom Badge Component

**File:** `src/components/custom/ExpenseTagBadge.tsx`

```typescript
"use client";

import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

interface ExpenseTagBadgeProps {
  tag: { tagId: string; name: string };
  tagType: { colour: string };
  onRemove?: (tagId: string) => void;
}

export function ExpenseTagBadge({
  tag,
  tagType,
  onRemove,
}: ExpenseTagBadgeProps) {
  return (
    <Badge
      variant="outline"
      style={{ borderColor: tagType.colour }}
      className="flex items-center gap-1"
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={() => onRemove(tag.tagId)}
          className="ml-1 hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
```

### Loading States

```typescript
export function ComponentWithLoading() {
  const { data, isLoading } = api.expense.getMine.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}
```

### Error Boundaries

```typescript
export function ComponentWithError() {
  const { data, error } = api.expense.getMine.useQuery();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <h3 className="font-semibold text-destructive">Error</h3>
        <p className="text-sm text-destructive/80">{error.message}</p>
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}
```

---

## Performance Optimization

### Server-Side Data Fetching

```typescript
// ✅ Good: Fetch on server, render on client
export default async function Page() {
  const expenses = await api.expense.getMine();
  return <ClientComponent expenses={expenses.map(e => e.toPlainObject())} />;
}

// ❌ Avoid: Client-side fetching causes waterfall
export function Page() {
  const { data } = api.expense.getMine.useQuery();  // Waits for hydration
  return <div>...</div>;
}
```

### React Query Caching

```typescript
// Configure stale time for less frequent refetches
export const api = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 1 minute
      cacheTime: 5 * 60 * 1000,  // 5 minutes
    },
  },
});
```

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority  // For above-the-fold images
/>
```

---

## Accessibility

### ARIA Labels

```typescript
<Button aria-label="Delete expense">
  <TrashIcon />
</Button>
```

### Keyboard Navigation

```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === "Enter" && handleClick()}
  onClick={handleClick}
>
  Interactive element
</div>
```

### Form Labels

```typescript
<div>
  <Label htmlFor="expense-name">Expense Name</Label>
  <Input id="expense-name" />
</div>
```

---

## Summary

The Recspenses frontend is built with:
1. **Next.js App Router** for server/client components
2. **tRPC + React Query** for type-safe data fetching
3. **Shadcn UI + Tailwind** for consistent styling
4. **TanStack Table** for data grids
5. **Recharts** for visualizations
6. **Radix UI** for accessible primitives

Key patterns:
- Server components for initial data fetch
- Client components for interactivity
- Plain object serialization across boundary
- Toast notifications for feedback
- Dark mode support throughout

For backend details, see [CLAUDE-BACKEND.md](./CLAUDE-BACKEND.md).
