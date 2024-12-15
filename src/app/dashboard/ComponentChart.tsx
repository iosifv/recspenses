"use client"

import { Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

// interface ChartProps {
//   data: Array<{
//     month: string
//     desktop: number
//     mobile: number
//   }>
//   config: ChartConfig
// }

export default function ComponentChart({ data }: { data: any }) {
  const expenseChartData = data.map((expense) => {
    return {
      name: expense.name,
      amount: expense.amount,
      fill: `var(--color-${expense.name.toLowerCase()})`,
    }
  })
  const expenseChartConfig = data.reduce((acc, expense, index) => {
    return {
      ...acc,
      [expense.name.toLowerCase()]: {
        label: expense.name.toUpperCase(),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      },
    }
  }, {}) satisfies ChartConfig

  return (
    <ChartContainer config={expenseChartConfig} className="min-h-[200px] max-h-[600px] w-full">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="amount" label nameKey="name" />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
