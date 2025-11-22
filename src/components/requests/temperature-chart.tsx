"use client"

import type { AnimalRecord } from "@/src/app/[vesselId]/requests/[id]/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface TemperatureChartProps {
  records: AnimalRecord[]
}

export function TemperatureChart({ records }: TemperatureChartProps) {
  // Transform the data for the chart
  const chartData = records
    .map((m) => ({
      date: `${new Date(m.date).getFullYear()}-${new Date(m.date).getMonth() + 1}-${new Date(m.date).getDate()}`,
      temperature: m.temperature,
    }))
    .reverse()

  return (
    <ChartContainer
      config={{
        temperature: {
          label: "Temperature (°C)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="temperature"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
