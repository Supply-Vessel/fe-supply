"use client"

import { WaybillMeasurements } from "@/src/components/requests/request/waybill-measurements"
import { WaybillExperiments } from "@/src/components/requests/request/waybill-experiments"
import { WaybillBasicInfo } from "@/src/components/requests/request/waybill-basic-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { WaybillRecords } from "@/src/components/requests/request/waybill-records"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Calendar, Clock, Edit, MapPin, Plus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { useRouter } from "next/navigation"

export interface WaybillRecordViewProps {
    wayBillId: string;
    userId: string;
    logistics: any;
}

export default function WaybillRecordView({userId, wayBillId, logistics}: WaybillRecordViewProps) {
  const router = useRouter();
  const trackingData = logistics?.data;
  const airline = logistics?.metadata?.airline;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid gap-6">
        {/* Waybill Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 rounded-md border">
            <AvatarImage src={"/placeholder.svg"} alt={airline?.name || "Авиакомпания"} />
            <AvatarFallback className="rounded-md bg-blue-100 text-blue-600 text-xl">
              {airline?.iata_code || "WB"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold">{airline?.name || "Накладная"}</h1>
              <Badge className="w-fit bg-blue-600 hover:bg-blue-700">{wayBillId}</Badge>
              <StatusBadge status={trackingData?.status || "UNKNOWN"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {trackingData?.from?.iata_code} → {trackingData?.to?.iata_code}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Flight: {trackingData?.flight_number}
                </span>
              </div>
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
                  value="measurements"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Statistics
                </TabsTrigger>
                <TabsTrigger
                  value="medical-records"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="experiments"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Routes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="pt-6">
                <WaybillBasicInfo logistics={logistics} />
              </TabsContent>

              <TabsContent value="measurements" className="pt-6">
                <WaybillMeasurements logistics={logistics} />
              </TabsContent>

              <TabsContent value="medical-records" className="pt-6">
                <WaybillRecords logistics={logistics} />
              </TabsContent>

              <TabsContent value="experiments" className="pt-6">
                <WaybillExperiments logistics={logistics} />
              </TabsContent>
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
        return "Доставлено"
      case "IN_TRANSIT":
        return "В пути"
      case "ARRIVED":
        return "Прибыл"
      case "DEPARTED":
        return "Отправлен"
      case "BOOKED":
        return "Забронировано"
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
