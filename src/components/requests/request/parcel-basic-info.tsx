import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { MapPin, Package, Truck } from "lucide-react"
import type React from "react"

export function ParcelBasicInfo({ logistics }: { logistics: any }) {
  const trackingData = logistics?.data;
  const parcelCompany = logistics?.metadata?.parcel_company;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parcel Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Status" value={trackingData?.status || "-"} />
            <InfoItem 
              label="Logistics Company" 
              value={parcelCompany?.name || "-"} 
              icon={Truck} 
            />
            <InfoItem 
              label="Carrier Code" 
              value={parcelCompany?.carrier_code || "-"} 
            />
            <InfoItem 
              label="Tracking Number" 
              value={logistics?.metadata?.request_parameters?.number || "-"}
              icon={Package} 
            />
            <InfoItem 
              label="Estimated Departure Date" 
              value={trackingData?.departure_datetime?.estimated ? new Date(trackingData.departure_datetime.estimated).toLocaleString('en-US') : "-"} 
            />
            <InfoItem 
              label="Actual Departure Date" 
              value={trackingData?.departure_datetime?.actual ? new Date(trackingData.departure_datetime.actual).toLocaleString('en-US') : "-"} 
            />
            <InfoItem 
              label="Estimated Arrival Date" 
              value={trackingData?.arrival_datetime?.estimated ? new Date(trackingData.arrival_datetime.estimated).toLocaleString('en-US') : "-"} 
            />
            <InfoItem 
              label="Actual Arrival Date" 
              value={trackingData?.arrival_datetime?.actual ? new Date(trackingData.arrival_datetime.actual).toLocaleString('en-US') : "-"} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Origin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              label="Location" 
              value={trackingData?.from?.name || "-"} 
              icon={MapPin} 
              className="md:col-span-2" 
            />
            <InfoItem label="State/Region" value={trackingData?.from?.state || "-"} />
            <InfoItem label="Country" value={trackingData?.from?.country || "-"} />
            <InfoItem label="Country Code" value={trackingData?.from?.country_code || "-"} />
            <InfoItem label="LOCODE" value={trackingData?.from?.locode || "-"} />
            {trackingData?.from?.lat && trackingData?.from?.lng && (
              <>
                <InfoItem label="Latitude" value={trackingData.from.lat.toString()} />
                <InfoItem label="Longitude" value={trackingData.from.lng.toString()} />
              </>
            )}
            {trackingData?.from?.timezone && (
              <InfoItem label="Timezone" value={trackingData.from.timezone} className="md:col-span-2" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Destination</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              label="Location" 
              value={trackingData?.to?.name || "-"} 
              icon={MapPin} 
              className="md:col-span-2" 
            />
            <InfoItem label="State/Region" value={trackingData?.to?.state || "-"} />
            <InfoItem label="Country" value={trackingData?.to?.country || "-"} />
            <InfoItem label="Country Code" value={trackingData?.to?.country_code || "-"} />
            <InfoItem label="LOCODE" value={trackingData?.to?.locode || "-"} />
            {trackingData?.to?.lat && trackingData?.to?.lng && (
              <>
                <InfoItem label="Latitude" value={trackingData.to.lat.toString()} />
                <InfoItem label="Longitude" value={trackingData.to.lng.toString()} />
              </>
            )}
            {trackingData?.to?.timezone && (
              <InfoItem label="Timezone" value={trackingData.to.timezone} className="md:col-span-2" />
            )}
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

