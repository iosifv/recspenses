"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer } from "~/components/ui/chart"

interface ChartProps {
  data: Array<{
    month: string
    desktop: number
    mobile: number
  }>
  config: ChartConfig
}

export default function Chart({ data, config }: ChartProps) {
  return (
    // <ChartContainer config={config} className="min-h-[200px] w-full">
    //   <ResponsiveContainer width="100%" height={300}>
    //     <BarChart data={data}>
    //       <XAxis dataKey="month" />
    //       <YAxis />
    //       <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    //       <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
    //     </BarChart>
    //   </ResponsiveContainer>
    // </ChartContainer>
  )
}
