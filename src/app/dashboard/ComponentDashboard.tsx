"use client"

import { useEffect, useState } from "react"
import ComponentCardSettings from "./ComponentCardSettings"
import ComponentChart from "./ComponentChart"
import { DataTable } from "./data-table"
import { columns } from "./columns"

import { CURRENCY, FREQUENCY } from "~/types/CustomEnum"
import { FxRateData } from "~/types/FxRate"
import { ExpensePlainObject } from "~/types/Expense"
import { DashboardData } from "~/types/DashboardData"

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

  const dashboardData = new DashboardData(fxData, displayCurrency, displayFrequency)
  dashboardData.add(plainExpenses as ExpensePlainObject[])
  const dashboardExpenseArray = dashboardData.getAllExpenses()

  console.log(dashboardExpenseArray)

  return (
    <div className="flex">
      <div className="w-7/10">
        <ComponentCardSettings
          metadata={plainUser.metadata}
          onCurrencyChange={setDisplayCurrency}
          onFrequencyChange={setDisplayFrequency}
        />
        <DataTable columns={columns} data={dashboardExpenseArray} />
      </div>
      <div className="w-3/10">
        <ComponentChart data={dashboardExpenseArray} />
      </div>
    </div>
  )
}

export default ComponentDashboard
