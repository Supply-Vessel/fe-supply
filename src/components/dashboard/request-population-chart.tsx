import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { Request } from "@/src/app/[vesselId]/dashboard/types"
import { useMemo } from "react"

const colors = [
  { label: "Engine", color: "#FFA500" },
  { label: "Electrical", color: "#808080" },
  { label: "Deck", color: "#00FFFF" },
] as const

function processRequestData(requests: Request[]): { chartData: any[], requestTypes: string[] } {
  if (!requests || requests.length === 0) {
    return { chartData: [], requestTypes: [] }
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentRequests = requests.filter(request => {
    const createdAt = new Date(request.createdAt)
    return createdAt >= thirtyDaysAgo
  })

  if (recentRequests.length === 0) {
    return { chartData: [], requestTypes: [] }
  }

  const requestsByDate = recentRequests.reduce((acc, request) => {
    const date = new Date(request.createdAt)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (!acc[dateKey]) {
      acc[dateKey] = {}
    }
    
    const requestType = request.requestType
    if (!acc[dateKey][requestType]) {
      acc[dateKey][requestType] = 0
    }
    
    acc[dateKey][requestType]++
    return acc
  }, {} as Record<string, Record<string, number>>)

  const allRequestTypes = Array.from(new Set(recentRequests.map(r => r.requestType)))
  
  const dateRange = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dateRange.push(date.toISOString().split('T')[0])
  }
  
  const chartData = dateRange.map(dateKey => {
    const formattedDate = new Date(dateKey).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    })
    
    const dataPoint: any = { date: formattedDate }
    
    allRequestTypes.forEach(type => {
      dataPoint[type] = (requestsByDate[dateKey] && requestsByDate[dateKey][type]) || 0
    })
    
    return dataPoint
  })

  return { chartData, requestTypes: allRequestTypes }
}

export function RequestPopulationChart({requests}: {requests: Request[]}) {
  const { chartData, requestTypes } = useMemo(() => processRequestData(requests), [requests])

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data to render!
      </div>
    )
  }

  const config = useMemo(() => requestTypes.reduce((acc: Record<string, { label: string; color: string }>, type: string, index: number) => {
    acc[type] = {
      label: type,
      color: colors[index % colors.length].color,
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>), [requestTypes])

  return (
    <ChartContainer
      config={config}
      className="h-[300px] [display: contents] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          {requestTypes.map((type: string, index: number) => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              stroke={colors[index % colors.length].color}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
