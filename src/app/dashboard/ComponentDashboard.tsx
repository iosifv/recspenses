"use client"

import { useState } from "react"
import ComponentCardSettings from "./ComponentCardSettings"
import ComponentChart from "./ComponentChart"
import { DataTable } from "./data-table"
import { columns } from "./columns"

import { CURRENCY, FREQUENCY } from "~/types/backend/CustomEnum"
import { SimplifiedExpense } from "~/types/Expense"
import { FrontendExpense, FrontendExpenses } from "~/types/frontend/FrontendExpenses"
import { FxRateData } from "~/types/frontend/FxRateSnapshot"
import { User } from "~/types/User"

interface ComponentDashboardProps {
  simplifiedExpenses: SimplifiedExpense[]
  fxData: FxRateData
  userData: User
}

const ComponentDashboard: React.FC<ComponentDashboardProps> = ({
  simplifiedExpenses,
  fxData,
  userData,
}) => {
  const [displayCurrency, setDisplayCurrency] = useState<CURRENCY>(userData.metadata.currency)
  const [displayFrequency, setDisplayFrequency] = useState<FREQUENCY>(userData.metadata.frequency)

  const frontendExpenses = new FrontendExpenses(fxData, displayCurrency, displayFrequency)
  frontendExpenses.add(simplifiedExpenses)

  // console.dir(frontendExpenses.getAll(), { depth: null })

  return (
    <div className="flex">
      <div className="w-7/10">
        <ComponentCardSettings
          metadata={userData.metadata}
          onCurrencyChange={setDisplayCurrency}
          onFrequencyChange={setDisplayFrequency}
        />
        <DataTable columns={columns} data={frontendExpenses.getAll() as FrontendExpense[]} />
      </div>
      <div className="w-3/10">
        <ComponentChart data={frontendExpenses.getAll()} />
      </div>
    </div>
  )
}

export default ComponentDashboard
