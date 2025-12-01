import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { MapPin, Package, Plane } from "lucide-react"
import type React from "react"

export function WaybillBasicInfo({ logistics }: { logistics: any }) {
  const trackingData = logistics?.data;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Information about the cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Status" value={trackingData?.status || "-"} />
            <InfoItem label="Flight number" value={trackingData?.flight_number || "-"} icon={Plane} />
            <InfoItem label="Number of pieces" value={trackingData?.piece?.toString() || "-"} icon={Package} />
            <InfoItem label="Weight" value={trackingData?.weight ? `${trackingData.weight} kg` : "-"} />
            <InfoItem 
              label="Estimated departure date" 
              value={trackingData?.departure_datetime_local?.estimated ? new Date(trackingData.departure_datetime_local.estimated).toLocaleString('en-US') : "-"} 
            />
            <InfoItem 
              label="Actual departure date" 
              value={trackingData?.departure_datetime_local?.actual ? new Date(trackingData.departure_datetime_local.actual).toLocaleString('en-US') : "-"} 
            />
            <InfoItem 
              label="Estimated arrival date" 
              value={trackingData?.arrival_datetime_local?.estimated ? new Date(trackingData.arrival_datetime_local.estimated).toLocaleString('en-US') : "-"} 
            />
            <InfoItem 
              label="Actual arrival date" 
              value={trackingData?.arrival_datetime_local?.actual ? new Date(trackingData.arrival_datetime_local.actual).toLocaleString('en-US') : "-"} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Departure point</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Airport" value={trackingData?.from?.name || "-"} icon={MapPin} className="md:col-span-2" />
            <InfoItem label="City" value={trackingData?.from?.nearest_city || "-"} />
            <InfoItem label="Country" value={trackingData?.from?.country || "-"} />
            <InfoItem label="IATA code" value={trackingData?.from?.iata_code || "-"} />
            <InfoItem label="ICAO code" value={trackingData?.from?.icao_code || "-"} />
            <InfoItem label="Timezone" value={trackingData?.from?.timezone || "-"} className="md:col-span-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Destination point</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Airport" value={trackingData?.to?.name || "-"} icon={MapPin} className="md:col-span-2" />
            <InfoItem label="City" value={trackingData?.to?.nearest_city || "-"} />
            <InfoItem label="Country" value={trackingData?.to?.country || "-"} />
            <InfoItem label="IATA code" value={trackingData?.to?.iata_code || "-"} />
            <InfoItem label="ICAO code" value={trackingData?.to?.icao_code || "-"} />
            <InfoItem label="Timezone" value={trackingData?.to?.timezone || "-"} className="md:col-span-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
  icon?: React.ElementType
  className?: string
}

function InfoItem({ label, value, icon: Icon, className }: InfoItemProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
