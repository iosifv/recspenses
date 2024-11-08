"use client"

import { Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

interface ChartProps {
  data: Array<{
    month: string
    desktop: number
    mobile: number
  }>
  config: ChartConfig
}

export default function Chart({ data, config }: { data: any; config: any }) {
  return (
    <ChartContainer config={config} className="min-h-[200px] max-h-[600px] w-full">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="amount" label nameKey="name" />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
