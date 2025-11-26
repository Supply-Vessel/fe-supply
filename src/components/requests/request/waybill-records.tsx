import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Download, Filter, MapPin, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"

interface WaybillRecordsProps {
  logistics: any
}

export function WaybillRecords({ logistics }: WaybillRecordsProps) {
  const events = logistics?.data?.events || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search events..." className="w-full pl-8" />
        </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Event history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Flight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow key={event.order_id}>
                  <TableCell className="font-medium">
                    {event.datetime_local?.actual 
                      ? new Date(event.datetime_local.actual).toLocaleString('ru-RU')
                      : event.datetime_local?.estimated 
                        ? new Date(event.datetime_local.estimated).toLocaleString('ru-RU')
                        : "-"
                    }
                  </TableCell>
                  <TableCell>
                    <EventCodeBadge code={event.event_code} />
                  </TableCell>
                  <TableCell className="max-w-[300px]">{event.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{event.location?.iata_code || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{event.piece} pcs / {event.weight} kg</TableCell>
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

interface EventCodeBadgeProps {
  code: string
}

function EventCodeBadge({ code }: EventCodeBadgeProps) {
  const getCodeColor = (code: string) => {
    switch (code.toUpperCase()) {
      case "BKD":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "RCS":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "DEP":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "ARR":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "DLV":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      case "FWB":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
      case "FOH":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "RCF":
        return "bg-teal-100 text-teal-800 hover:bg-teal-100"
      case "NFD":
        return "bg-pink-100 text-pink-800 hover:bg-pink-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={`${getCodeColor(code)}`}>
      {code}
    </Badge>
  )
}
