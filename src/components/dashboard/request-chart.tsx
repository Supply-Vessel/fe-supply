import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { Request } from "@/src/app/[vesselId]/dashboard/types"
import { useMemo } from "react"

// Fallback colors if requestType doesn't have a color
const fallbackColors = ["#FFA500", "#808080", "#00FFFF", "#10B981", "#F59E0B", "#EF4444"]

function processRequestData(requests: Request[]): { chartData: any[], requestTypes: string[], typeColors: Record<string, string> } {
  if (!requests || requests.length === 0) {
    return { chartData: [], requestTypes: [], typeColors: {} }
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentRequests = requests.filter(request => {
    const createdAt = new Date(request.createdAt)
    return createdAt >= thirtyDaysAgo
  })

  if (recentRequests.length === 0) {
    return { chartData: [], requestTypes: [], typeColors: {} }
  }

  // Collect colors from requestTypes
  const typeColors: Record<string, string> = {}
  
  const requestsByDate = recentRequests.reduce((acc, request) => {
    const date = new Date(request.createdAt)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (!acc[dateKey]) {
      acc[dateKey] = {}
    }
    
    // requestType is now an object with name, displayName, color properties
    const requestTypeName = request.requestType?.name || request.requestType?.displayName || 'Unknown'
    
    // Store color from requestType if available
    if (request.requestType?.color && !typeColors[requestTypeName]) {
      typeColors[requestTypeName] = request.requestType.color
    }
    
    if (!acc[dateKey][requestTypeName]) {
      acc[dateKey][requestTypeName] = 0
    }
    
    acc[dateKey][requestTypeName]++
    return acc
  }, {} as Record<string, Record<string, number>>)

  const allRequestTypes = Array.from(new Set(recentRequests.map(r => r.requestType?.name || r.requestType?.displayName || 'Unknown')))
  
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

  return { chartData, requestTypes: allRequestTypes, typeColors }
}

export function RequestChart({requests}: {requests: Request[]}) {
  const { chartData, requestTypes, typeColors } = useMemo(() => processRequestData(requests), [requests])

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
      color: typeColors[type] || fallbackColors[index % fallbackColors.length],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>), [requestTypes, typeColors])

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
              stroke={typeColors[type] || fallbackColors[index % fallbackColors.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
