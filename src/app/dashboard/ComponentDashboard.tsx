"use client"

import ComponentCardSettings from "./ComponentCardSettings"
import { useState } from "react"
import ComponentChart from "./ComponentChart"
import { ChartConfig } from "~/components/ui/chart"

interface ComponentDashboardProps {
  myExpenses: string
  currencyData: string
}

const ComponentDashboard: React.FC<ComponentDashboardProps> = ({ myExpenses, currencyData }) => {
  const [displayCurrency, setDisplayCurrency] = useState<"GBP" | "USD" | "EUR" | "RON" | "">("GBP")

  const expenseTransformed = JSON.parse(myExpenses).map((expense: any) => {
    if (displayCurrency == "") {
      expense.transformed = "-"
    } else {
      expense.transformed =
        Math.floor((expense.amount / currencyData[displayCurrency][expense.currency]) * 100) / 100
    }
    return expense
  })

  const expenseChartData = JSON.parse(myExpenses).map((expense) => {
    return {
      name: expense.name,
      amount: expense.amount,
      fill: `var(--color-${expense.name.toLowerCase()})`,
    }
  })
  const expenseChartConfig = JSON.parse(myExpenses).reduce((acc, expense, index) => {
    return {
      ...acc,
      [expense.name.toLowerCase()]: {
        label: expense.name.toUpperCase(),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      },
    }
  }, {}) satisfies ChartConfig

  return (
    <div className="flex">
      <div className="w-7/10">
        <ComponentCardSettings onCurrencyChange={setDisplayCurrency} />
        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-5 gap-4 w-full max-w-4xl text-xl font-bold">
            <div>Name</div>
            <div>Original</div>
            <div>Amount</div>
            <div>Frequency</div>
            <div>Actions</div>
          </div>
          {expenseTransformed.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-5 gap-4 w-full max-w-4xl">
              <div>{item.name}</div>
              <div>
                {item.amount} ({item.currency})
              </div>
              <div>{item.transformed}</div>
              <div>{item.frequency}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-3/10">
        <ComponentChart data={expenseChartData} config={expenseChartConfig} />
      </div>
    </div>
  )
}

export default ComponentDashboard
