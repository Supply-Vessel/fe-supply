import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { MapPin } from "lucide-react"

interface ParcelEventsProps {
  logistics: any
}

export function ParcelEvents({ logistics }: ParcelEventsProps) {
  const events = logistics?.data?.events || []

  return (
    <div className="space-y-6">
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
                <TableHead>Transport Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow key={event.order_id}>
                  <TableCell className="font-medium">
                    {event.datetime?.actual 
                      ? new Date(event.datetime.actual).toLocaleString('en-US')
                      : event.datetime?.estimated 
                        ? new Date(event.datetime.estimated).toLocaleString('en-US')
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
                      <span className="text-sm">{event.location?.name || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.transport_mode ? (
                      <TransportModeBadge mode={event.transport_mode} />
                    ) : (
                      "-"
                    )}
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

interface EventCodeBadgeProps {
  code: string
}

function EventCodeBadge({ code }: EventCodeBadgeProps) {
  const getCodeColor = (code: string) => {
    if (!code) return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    
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

interface TransportModeBadgeProps {
  mode: string
}

function TransportModeBadge({ mode }: TransportModeBadgeProps) {
  const getModeColor = (mode: string) => {
    switch (mode.toUpperCase()) {
      case "AIR":
        return "bg-sky-100 text-sky-800 hover:bg-sky-100"
      case "SEA":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "ROAD":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "RAIL":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={`${getModeColor(mode)}`}>
      {mode}
    </Badge>
  )
}

