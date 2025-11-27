"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Download, Filter, MapPin, Package, Plane } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface WaybillStatisticsProps {
  logistics: any;
}

export function WaybillStatistics({ logistics }: WaybillStatisticsProps) {
  const events = logistics?.data?.events || []
  const routes = logistics?.data?.routes || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Statistics of cargo by routes</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Details of cargo by routes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Segment</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>Number of pieces</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Transport</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route: any) => (
                <TableRow key={route.order_id}>
                  <TableCell className="font-medium">#{route.order_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{route.from?.iata_code} → {route.to?.iata_code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Plane className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{route.flight_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{route.piece}</span>
                    </div>
                  </TableCell>
                  <TableCell>{route.weight}</TableCell>
                  <TableCell>{route.transport_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events with cargo data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Number of pieces</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Flight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow key={event.order_id}>
                  <TableCell className="font-medium">
                    {event.datetime_local?.actual 
                      ? new Date(event.datetime_local.actual).toLocaleString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : event.datetime_local?.estimated 
                        ? new Date(event.datetime_local.estimated).toLocaleString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : "-"
                    }
                  </TableCell>
                  <TableCell>{event.event_code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{event.location?.iata_code || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{event.piece}</span>
                    </div>
                  </TableCell>
                  <TableCell>{event.weight}</TableCell>
                  <TableCell>{event.flight_number || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
