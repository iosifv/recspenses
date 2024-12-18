"use client"

import { useState } from "react"
import ComponentCardSettings from "./ComponentCardSettings"
import ComponentChart from "./ComponentChart"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { CURRENCY, FREQUENCY } from "~/types/backend/CustomEnum"
import { FxRateSnapshot } from "~/types/frontend/FxRateSnapshot"
import { FrequencyLookup } from "~/types/frontend/FrequencyLookup"

interface ComponentDashboardProps {
  simplifiedExpenses: any
  fxData: any
  userData: any
}

const ComponentDashboard: React.FC<ComponentDashboardProps> = ({
  simplifiedExpenses,
  fxData,
  userData,
}) => {
  const [displayCurrency, setDisplayCurrency] = useState<CURRENCY>(userData.metadata.currency)
  const [displayFrequency, setDisplayFrequency] = useState<FREQUENCY>(userData.metadata.frequency)

  const fxRate = new FxRateSnapshot(fxData)

  const transformExpense = (expense: any) => {
    let transform =
      expense.amount /
      fxRate.get(displayCurrency, expense.currency) /
      FrequencyLookup.get(displayFrequency, expense.frequency)
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
          metadata={userData.metadata}
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
