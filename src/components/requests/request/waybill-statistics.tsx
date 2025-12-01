"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { WaybillEvents } from "./waybill-events"
import { WaybillRoutes } from "./waybill-routes"
import { Download, Filter } from "lucide-react"

interface WaybillStatisticsProps {
  logistics: any;
}

export function WaybillStatistics({ logistics }: WaybillStatisticsProps) {
  const routes = logistics?.data?.routes || []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{logistics?.data?.weight || 0} kg</div>
            <p className="text-sm text-gray-500 mt-2">Total weight of all cargo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Number of pieces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{logistics?.data?.piece || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Total number of pieces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{routes.length}</div>
            <p className="text-sm text-gray-500 mt-2">Number of segments</p>
          </CardContent>
        </Card>
      </div>

      <WaybillRoutes logistics={logistics} />

      <WaybillEvents logistics={logistics} />
    </div>
  )
}
