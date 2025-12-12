"use client"

import { WaybillStatistics } from "@/src/components/requests/request/waybill-statistics"
import { WaybillBasicInfo } from "@/src/components/requests/request/waybill-basic-info"
import { ParcelStatistics } from "@/src/components/requests/request/parcel-statistics"
import { ParcelBasicInfo } from "@/src/components/requests/request/parcel-basic-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"
import { WayBillType } from "@/src/components/requests/types";
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"

export interface WaybillRecordViewProps {
    wayBillType: WayBillType;
    organizationName: string;
    wayBillId: string;
    vesselId: string;
    userId: string;
    logistics: any;
}

export default function WaybillRecordView({userId, wayBillId, wayBillType, logistics, vesselId, organizationName}: WaybillRecordViewProps) {
  const router = useRouter();
  const trackingData = logistics?.data;
  const airline = logistics?.metadata?.airline;
  const parcelCompany = logistics?.metadata?.parcel_company;
  
  const isParcel = wayBillType === WayBillType.PARCEL_WAYBILL;
  const companyName = isParcel ? (parcelCompany?.name || "Parcel") : (airline?.name || "Waybill");
  const companyCode = isParcel ? parcelCompany?.carrier_code : airline?.iata_code;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-4">
        <Link href={`/${organizationName}/${vesselId}/requests`}>
          <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-blue-600 hover:text-blue-700"
          >
              <ArrowLeft className="h-4 w-4 text-blue-600 hover:text-blue-700" />
              Back to Requests
          </Button>
        </Link>
      </div>
      <div className="grid gap-6">
        {/* Waybill Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 rounded-md border">
            <AvatarImage src={"/placeholder.svg"} alt={companyName} />
            <AvatarFallback className="rounded-md bg-blue-100 text-blue-600 text-xl">
              {companyCode || "WB"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold">{companyName}</h1>
              <Badge className="w-fit bg-blue-600 hover:bg-blue-700">{wayBillId}</Badge>
              <StatusBadge status={trackingData?.status || "UNKNOWN"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {isParcel 
                    ? `${trackingData?.from?.country_code || "?"} → ${trackingData?.to?.country_code || "?"}`
                    : `${trackingData?.from?.iata_code || "?"} → ${trackingData?.to?.iata_code || "?"}`
                  }
                </span>
              </div>
              {!isParcel && trackingData?.flight_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Flight: {trackingData.flight_number}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Updated at: {logistics?.metadata?.updated_at ? new Date(logistics.metadata.updated_at).toLocaleString('ru-RU') : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="basic-info"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Basic Information
                </TabsTrigger>
                <TabsTrigger
                  value="statistics"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Statistics
                </TabsTrigger>
              </TabsList>

              {wayBillType === WayBillType.AIR_WAYBILL && 
              <>
                <TabsContent value="basic-info" className="pt-6">
                  <WaybillBasicInfo logistics={logistics} />
                </TabsContent>

                <TabsContent value="statistics" className="pt-6">
                  <WaybillStatistics logistics={logistics} />
                </TabsContent>
              </>
              }

              {wayBillType === WayBillType.PARCEL_WAYBILL && 
              <>
                <TabsContent value="basic-info" className="pt-6">
                  <ParcelBasicInfo logistics={logistics} />
                </TabsContent>

                <TabsContent value="statistics" className="pt-6">
                  <ParcelStatistics logistics={logistics} />
                </TabsContent>
              </>
              }
              
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "IN_TRANSIT":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "ARRIVED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "DEPARTED":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "BOOKED":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "Delivered"
      case "IN_TRANSIT":
        return "In Transit"
      case "ARRIVED":
        return "Arrived"
      case "DEPARTED":
        return "Departed"
      case "BOOKED":
        return "Booked"
      default:
        return status
    }
  }

  return (
    <Badge variant="outline" className={`${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </Badge>
  )
}
