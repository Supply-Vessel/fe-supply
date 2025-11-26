import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Download, Filter, MapPin, Package, Plane, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"

interface WaybillExperimentsProps {
  logistics: any
}

export function WaybillExperiments({ logistics }: WaybillExperimentsProps) {
  const routes = logistics?.data?.routes || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search routes..." className="w-full pl-8" />
        </div>

        <div className="flex items-center gap-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Routes of transportation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route: any) => (
                <TableRow key={route.order_id}>
                  <TableCell className="font-medium">{route.order_id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm">{route.from?.iata_code} → {route.to?.iata_code}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {route.from?.nearest_city} → {route.to?.nearest_city}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RouteStatusBadge status={route.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Plane className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{route.transport_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{route.flight_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{route.piece} pcs / {route.weight} kg</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {route.departure_datetime_local?.actual 
                        ? new Date(route.departure_datetime_local.actual).toLocaleString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : route.departure_datetime_local?.estimated 
                          ? new Date(route.departure_datetime_local.estimated).toLocaleString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : "-"
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {route.arrival_datetime_local?.actual 
                        ? new Date(route.arrival_datetime_local.actual).toLocaleString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : route.arrival_datetime_local?.estimated 
                          ? new Date(route.arrival_datetime_local.estimated).toLocaleString('ru-RU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : "-"
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details of routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route: any, index: number) => (
              <div 
                key={route.order_id} 
                className={`flex items-center p-3 border rounded-md ${
                  route.status === 'ARRIVED' 
                    ? 'bg-green-50 border-green-200' 
                    : route.status === 'DEPARTED' 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${
                  route.status === 'ARRIVED' 
                    ? 'bg-green-600' 
                    : route.status === 'DEPARTED' 
                      ? 'bg-blue-600' 
                      : 'bg-gray-600'
                }`}></div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">Segment {route.order_id}: {route.from?.name} → {route.to?.name}</p>
                      <p className="text-sm text-gray-600">Flight {route.flight_number} • {route.piece} pcs • {route.weight} kg</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {route.arrival_datetime_local?.actual 
                        ? `Arrived: ${new Date(route.arrival_datetime_local.actual).toLocaleString('ru-RU')}`
                        : route.departure_datetime_local?.actual 
                          ? `Departed: ${new Date(route.departure_datetime_local.actual).toLocaleString('ru-RU')}`
                          : route.departure_datetime_local?.estimated 
                            ? `Expected: ${new Date(route.departure_datetime_local.estimated).toLocaleString('ru-RU')}`
                            : "Time unknown"
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface RouteStatusBadgeProps {
  status: string
}

function RouteStatusBadge({ status }: RouteStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ARRIVED":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "DEPARTED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "IN_TRANSIT":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      case "BOOKED":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={`${getStatusColor(status)}`}>
      {status}
    </Badge>
  )
}
