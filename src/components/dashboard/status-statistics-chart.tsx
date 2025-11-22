"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { Request } from "@/src/app/[vesselId]/dashboard/types"
import { useMemo } from "react"

const statusMapping = {
  WAITING: { label: "Waiting", color: "#10B981" },
  ORDERED: { label: "Ordered", color: "#FF69B4" },
  RECEIVED: { label: "Received", color: "#F59E0B" },
  ON_HOLD: { label: "On Hold", color: "#6B7280" },
  CANCELLED: { label: "Cancelled", color: "#EF4444" },
} as const

function processStatusData(requests: Request[]) {
  if (!requests || requests.length === 0) {
    return []
  }

  const statusCounts = requests.reduce((acc, request) => {
    const status = request.status
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status]++
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(statusCounts)
    .map(([status, count]) => ({
      name: statusMapping[status as keyof typeof statusMapping]?.label || status,
      value: count,
      color: statusMapping[status as keyof typeof statusMapping]?.color || "#6B7280",
      status: status
    }))
    .sort((a, b) => b.value - a.value)
  
  return chartData
}

export function StatusStatisticsChart({requests}: {requests: Request[]}) {
  const chartData = useMemo(() => processStatusData(requests), [requests])

  const config = useMemo(() => {
    if (!chartData || chartData.length === 0) return {}
    
    return chartData.reduce((acc, item) => {
      acc[item.status] = {
        label: item.name,
        color: item.color,
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>)
  }, [chartData])

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data to render!
      </div>
    )
  }

  return (
    <ChartContainer
      config={config}
      className="h-[300px] w-[315px] md:w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
