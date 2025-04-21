"use client"

import { useState } from "react"
import ComponentCardSettings from "./ComponentCardSettings"
import ComponentChart from "./ComponentChart"
import { DataTable } from "./data-table"
import { columns } from "./columns"

import { CURRENCY, FREQUENCY } from "~/types/CustomEnum"
import { FxRateData } from "~/types/FxRate"
import { FrontendExpense, FrontendExpenses } from "~/types/FrontendExpenses"

interface ComponentDashboardProps {
  plainExpenses: Record<string, unknown>[]
  fxData: FxRateData
  plainUser: Record<string, unknown>
}

const ComponentDashboard: React.FC<ComponentDashboardProps> = ({
  plainExpenses,
  fxData,
  plainUser,
}) => {
  const [displayCurrency, setDisplayCurrency] = useState<CURRENCY>(
    plainUser.metadata.currency as CURRENCY,
  )
  const [displayFrequency, setDisplayFrequency] = useState<FREQUENCY>(
    plainUser.metadata.frequency as FREQUENCY,
  )

  const frontendExpenses = new FrontendExpenses(fxData, displayCurrency, displayFrequency)
  frontendExpenses.add(plainExpenses)

  // console.dir(frontendExpenses.getAll(), { depth: null })

  return (
    <div className="flex">
      <div className="w-7/10">
        <ComponentCardSettings
          metadata={plainUser.metadata}
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
