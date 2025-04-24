# Recspenses: Expense Management System Schema

## System Architecture

```mermaid
flowchart TB
    subgraph "Frontend"
        NextJS[Next.js App]
        
        subgraph "UI Components"
            Dashboard[Dashboard Components]
            Editor[Editor Components]
            DataTables[Data Tables]
            Charts[Chart Visualizations]
            Settings[User Settings]
        end
        
        subgraph "State Management"
            TRPC[TRPC Client]
            LocalState[Local State]
            Settings[User Preferences]
        end
        
        subgraph "Auth System"
            Clerk[Clerk Auth]
            Auth[User Authentication]
            AuthGuards[Protected Routes]
        end
    end

    subgraph "Backend"
        API[API Routes]
        TRPCServer[TRPC Server]
        
        subgraph "Data Layer"
            DB[(Database)]
            Models[Data Models]
            ClerkServer[Clerk Server]
        end
        
        subgraph "Services"
            ExpenseService[Expense Service]
            TagService[Tag Service]
            FXService[FX Rate Service]
            UserService[User Service]
        end
    end

    NextJS --> Dashboard
    NextJS --> Editor
    NextJS --> DataTables
    NextJS --> Charts
    NextJS --> TRPC
    NextJS --> Auth
    
    Dashboard --> TRPC
    Editor --> TRPC
    DataTables --> LocalState
    Charts --> LocalState
    
    TRPC <--> TRPCServer
    Auth <--> ClerkServer

    TRPCServer --> ExpenseService
    TRPCServer --> TagService
    TRPCServer --> FXService
    TRPCServer --> UserService
    
    ExpenseService --> Models
    TagService --> Models
    FXService --> Models
    UserService --> Models
    
    Models --> DB
    ClerkServer --> DB
    
    subgraph "Core Data Models"
        Expense[Expense]
        Tag[Tag]
        TagType[TagType]
        User[User]
        FXRates[FX Rates]
    end
    
    ExpenseService --> Expense
    TagService --> Tag
    TagService --> TagType
    UserService --> User
    FXService --> FXRates

    classDef frontend fill:#c4e3f3,stroke:#0275d8
    classDef backend fill:#d9edf7,stroke:#5bc0de
    classDef models fill:#dff0d8,stroke:#5cb85c
    classDef services fill:#fcf8e3,stroke:#f0ad4e
    
    class NextJS,Dashboard,Editor,DataTables,Charts,Settings,TRPC,LocalState,Auth,AuthGuards,Clerk frontend
    class API,TRPCServer,ExpenseService,TagService,FXService,UserService services
    class DB,Models,ClerkServer backend
    class Expense,Tag,TagType,User,FXRates models
```

## Data Models

### Core Types

#### User

```typescript
type DBUser = {
  userId: string
  tags: DBTag[]         // Stored as JSON in DB
  tagTypes: TagType[]   // Stored as JSON in DB
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date | null
  seenAt: Date | null
}

class User implements PlainObjectConvertible {
  userId: string
  tags: Tag[]
  tagTypes: TagType[]
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date | null
  seenAt: Date | null
  
  constructor(dbUser: DBUser)
  toPlainObject(): Record<string, any>
}
```

#### Expense

```typescript
type DBExpense = {
  id?: number
  userId: string
  tags: string[]        // Stored as JSON in DB
  name: string
  amount: number
  currency: CURRENCY
  frequency: FREQUENCY
  extra: Record<string, unknown>  // Stored as JSON in DB
  createdAt: Date
  updatedAt: Date
}

type ExpensePlainObject = {
  id?: number
  userId: string
  tags: any[]
  name: string
  amount: number
  currency: CURRENCY
  frequency: FREQUENCY
  extra: Record<string, unknown>
  createdAt: string | Date
  updatedAt: string | Date
}

class Expense implements PlainObjectConvertible {
  id?: number
  userId: string
  tags: Tag[]
  name: string
  amount: number
  currency: CURRENCY
  frequency: FREQUENCY
  extra: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  
  constructor(user: User, dbExpense: DBExpense)
  toPlainObject(): ExpensePlainObject
}
```

#### Tag

```typescript
type DBTag = {
  id: string
  name: string
  description: string
  color: string
  type: string  // Reference to TagType id
}

class Tag implements PlainObjectConvertible {
  id: string
  name: string
  description: string
  color: string
  type: TagType
  
  constructor(id: string, name: string, description: string, color: string, type: TagType)
  static buildWithUnknownId(id: string): Tag
  toPlainObject(): Record<string, any>
}
```

#### TagType

```typescript
class TagType {
  id: string
  name: string
  description: string
  color: string
  
  constructor(id: string, name: string, description: string, color: string)
  static buildWithUnknownId(id: string): TagType
}
```

### Enums and Constants

```typescript
type CURRENCY = "GBP" | "USD" | "EUR" | "RON"
type FREQUENCY = "daily" | "weekly" | "monthly" | "yearly"

const CURRENCIES: CURRENCY[] = ["GBP", "USD", "EUR", "RON"] as const
const FREQUENCIES: FREQUENCY[] = ["daily", "weekly", "monthly", "yearly"] as const
```

### Dashboard Data

```typescript
class DashboardData {
  fxData: FxRateData
  displayCurrency: CURRENCY
  displayFrequency: FREQUENCY
  expenses: DashboardExpense[]
  
  constructor(fxData: FxRateData, displayCurrency: CURRENCY, displayFrequency: FREQUENCY)
  add(expenses: ExpensePlainObject[])
  getAllExpenses(): DashboardExpense[]
}

type DashboardExpense = ExpensePlainObject & {
  original: number
  transformed: number
}

type FxRateData = {
  base: string
  rates: Record<string, number>
  date: string
}
```

## Components

### Data Tables

#### DataTable

```typescript
interface DataTableProps {
  columns: ColumnDef<Record<string, any>, any>[]
  data: Array<ReturnType<typeof Expense.prototype.toPlainObject>>
  user: ReturnType<typeof User.prototype.toPlainObject>
}

function DataTable({ columns, data, user }: DataTableProps)
```

### Dashboard Components

#### ComponentDashboard

```typescript
interface ComponentDashboardProps {
  plainExpenses: Record<string, unknown>[]
  fxData: FxRateData
  plainUser: Record<string, unknown>
}

function ComponentDashboard({ plainExpenses, fxData, plainUser }: ComponentDashboardProps)
```

#### ComponentChart

```typescript
function ComponentChart({
  data,
  plainUser,
  displayOthers = true,
}: {
  data: DashboardExpense[]
  plainUser: Record<string, unknown>
  displayOthers?: boolean
})
```

#### ComponentCardSettings

```typescript
function ComponentCardSettings({
  metadata,
  onCurrencyChange,
  onFrequencyChange,
  onDisplayOthersChange,
}: {
  metadata: Record<string, unknown>
  onCurrencyChange: (currency: CURRENCY) => void
  onFrequencyChange: (frequency: FREQUENCY) => void
  onDisplayOthersChange: (display: boolean) => void
})
```

### Editor Components

#### ComponentDialogEdit

```typescript
function ComponentDialogEdit({
  row,
  user,
}: {
  row: ExpensePlainObject
  user: ReturnType<typeof User.prototype.toPlainObject>
})
```

#### ComponentDialogDelete

```typescript
function ComponentDialogDelete({
  row,
}: {
  row: ExpensePlainObject
})
```

#### ComponentTableRowNew

```typescript
function ComponentTableRowNew()
```

## API Routes

### tRPC Routes

#### Expense Routes

```typescript
// User related routes
router.query("getUser", { ... })
router.mutation("updateUser", { ... })

// Expense related routes
router.query("getAllExpenses", { ... })
router.query("getExpenseById", { ... })
router.mutation("createExpense", { ... })
router.mutation("updateExpense", { ... })
router.mutation("deleteExpense", { ... })

// Tag related routes
router.query("getAllTags", { ... })
router.mutation("createTag", { ... })
router.mutation("updateTag", { ... })
router.mutation("deleteTag", { ... })

// TagType related routes
router.query("getAllTagTypes", { ... })
router.mutation("createTagType", { ... })
router.mutation("updateTagType", { ... })
router.mutation("deleteTagType", { ... })

// FX related routes
router.query("getFxRates", { ... })
```

## Database Schema

```mermaid
erDiagram
    USER {
        string userId PK
        json tags
        json tagTypes
        json metadata
        datetime createdAt
        datetime updatedAt
        datetime seenAt
    }
    
    EXPENSE {
        int id PK
        string userId FK
        json tags
        string name
        float amount
        string currency
        string frequency
        json extra
        datetime createdAt
        datetime updatedAt
    }
    
    USER ||--o{ EXPENSE : "has"
```

## Data Flow

```mermaid
sequenceDiagram
    participant Client
    participant NextJS
    participant TrpcClient
    participant TrpcServer
    participant Database
    
    Client->>NextJS: Access Dashboard
    NextJS->>TrpcClient: getUser()
    TrpcClient->>TrpcServer: Query getUser
    TrpcServer->>Database: Fetch User data
    Database-->>TrpcServer: Return User data
    TrpcServer-->>TrpcClient: Return User data
    TrpcClient-->>NextJS: User data
    
    NextJS->>TrpcClient: getAllExpenses()
    TrpcClient->>TrpcServer: Query getAllExpenses
    TrpcServer->>Database: Fetch Expenses
    Database-->>TrpcServer: Return Expenses data
    TrpcServer-->>TrpcClient: Return Expenses data
    TrpcClient-->>NextJS: Expenses data
    
    NextJS->>TrpcClient: getFxRates()
    TrpcClient->>TrpcServer: Query getFxRates
    TrpcServer-->>TrpcClient: Return FX data
    TrpcClient-->>NextJS: FX data
    
    NextJS->>Client: Render Dashboard
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Clerk
    participant Backend
    participant Database
    
    User->>Frontend: Login request
    Frontend->>Clerk: Authenticate
    Clerk-->>Frontend: Return token
    Frontend->>Backend: API requests with token
    Backend->>Clerk: Verify token
    Clerk-->>Backend: Token valid
    Backend->>Database: Execute queries
    Database-->>Backend: Return data
    Backend-->>Frontend: API response
    Frontend-->>User: Display data
```