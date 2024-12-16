"use client"

import { useState } from "react"
import ComponentCardSettings from "./ComponentCardSettings"
import ComponentChart from "./ComponentChart"
import { DataTable } from "./data-table"
import { columns } from "./columns"

interface ComponentDashboardProps {
  simplifiedExpenses: any
  currencyData: string
  myUser: any
}

const frequencyLookup = {
  daily: {
    daily: 1,
    weekly: 7,
    monthly: 30.5,
    yearly: 365,
  },
  weekly: {
    daily: 1 / 7,
    weekly: 1,
    monthly: 30.5 / 7,
    yearly: 365 / 7,
  },
  monthly: {
    daily: 1 / 30.5,
    weekly: 7 / 30.5,
    monthly: 1,
    yearly: 365 / 30.5,
  },
  yearly: {
    daily: 1 / 365,
    weekly: 7 / 365,
    monthly: 30.5 / 365,
    yearly: 1,
  },
}

const ComponentDashboard: React.FC<ComponentDashboardProps> = ({
  simplifiedExpenses,
  currencyData,
}) => {
  const [displayCurrency, setDisplayCurrency] = useState<"GBP" | "USD" | "EUR" | "RON" | "">("GBP")
  const [displayFrequency, setDisplayFrequency] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly")

  const transformExpense = (expense: any) => {
    let transform =
      expense.amount /
      currencyData[displayCurrency][expense.currency] /
      frequencyLookup[displayFrequency][expense.frequency]
    return Math.floor(transform * 100) / 100
  }

  const expenseTransformed = simplifiedExpenses.map((expense: any) => {
    expense.transformed = transformExpense(expense)
    expense.original = `${expense.amount} ${expense.currency} ${expense.frequency}`
    return expense
  })

  return (
    <div className="flex">
      <div className="w-7/10">
        <ComponentCardSettings
          onCurrencyChange={setDisplayCurrency}
          onFrequencyChange={setDisplayFrequency}
        />
        <DataTable columns={columns} data={expenseTransformed as unknown as any} />
      </div>
      <div className="w-3/10">
        <ComponentChart data={expenseTransformed} />
      </div>
    </div>
  )
}

export default ComponentDashboard
