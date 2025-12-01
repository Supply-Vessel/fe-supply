import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Download, Filter, MapPin, Package, Plane, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"

interface WaybillRoutesProps {
  logistics: any
}

export function WaybillRoutes({ logistics }: WaybillRoutesProps) {
  const routes = logistics?.data?.routes || []

  return (
    <div className="space-y-6">
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
                        ? new Date(route.departure_datetime_local.actual).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : route.departure_datetime_local?.estimated 
                          ? new Date(route.departure_datetime_local.estimated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : "-"
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {route.arrival_datetime_local?.actual 
                        ? new Date(route.arrival_datetime_local.actual).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : route.arrival_datetime_local?.estimated 
                          ? new Date(route.arrival_datetime_local.estimated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
