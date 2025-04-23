"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"
import { DashboardExpense } from "~/types/DashboardData"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

type TagType = {
  id: string
  name: string
  description: string
  color: string
}

type ChartDataItem = {
  name: string
  amount: number
  color?: string
}

export default function ComponentChart({
  data,
  plainUser,
}: {
  data: DashboardExpense[]
  plainUser: Record<string, unknown>
}) {
  // Extract tag types from user profile
  const tagTypes = plainUser.tagTypes as TagType[]
  
  if (!tagTypes || tagTypes.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium">No tag types defined in your profile</h3>
        <p className="text-sm text-gray-400 mt-2">Create tag types to see expense distribution by category</p>
      </div>
    )
  }

  // Generate chart colors scheme
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6A7FDB']
  
  // Group expenses by tag type
  const getExpensesByTagType = (tagTypeId: string) => {
    // Filter expenses that have tags of this type
    const filtered = data.filter(expense => 
      expense.tags?.some(tag => tag.type?.id === tagTypeId)
    )
    
    // Group expenses by tag id and sum their amounts
    const tagSums = new Map<string, { name: string; amount: number; color?: string }>()
    
    filtered.forEach(expense => {
      const relevantTags = expense.tags.filter(tag => tag.type?.id === tagTypeId)
      
      relevantTags.forEach(tag => {
        if (!tagSums.has(tag.id)) {
          tagSums.set(tag.id, {
            name: tag.name,
            amount: 0,
            color: tag.type?.colour || COLORS[tagSums.size % COLORS.length],
          })
        }
        
        const current = tagSums.get(tag.id)!
        tagSums.set(tag.id, {
          ...current,
          amount: current.amount + expense.transformed,
        })
      })
    })
    
    return Array.from(tagSums.values())
  }
  
  // Create chart config for each tag type
  const createChartConfig = (chartData: ChartDataItem[]): ChartConfig => {
    return chartData.reduce((acc, item, index) => {
      return {
        ...acc,
        [item.name.toLowerCase()]: {
          label: item.name,
          color: item.color || `hsl(var(--chart-${(index % 5) + 1}))`,
        },
      }
    }, {}) as ChartConfig
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold mb-4">Expense Distribution by Categories</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tagTypes.map((tagType, typeIndex) => {
          const chartData = getExpensesByTagType(tagType.id)
          
          if (chartData.length === 0) {
            return (
              <Card key={tagType.id} className="bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tagType.color || '#888888' }}
                    />
                    {tagType.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-40">
                  <p className="text-gray-400 text-sm">No expenses with this tag type</p>
                </CardContent>
              </Card>
            )
          }
          
          const config = createChartConfig(chartData)
          
          return (
            <Card key={tagType.id} className="bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tagType.color || '#888888' }}
                  />
                  {tagType.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie 
                        data={chartData} 
                        dataKey="amount" 
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={({ name, percent }) => 
                          percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
