"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ParcelEvents } from "./parcel-events"

interface ParcelStatisticsProps {
  logistics: any;
}

export function ParcelStatistics({ logistics }: ParcelStatisticsProps) {
  const events = logistics?.data?.events || []
  const trackingData = logistics?.data;

  // Подсчет различных типов событий
  const customsEvents = events.filter((event: any) => 
    event.description?.toLowerCase().includes('customs') || 
    event.description?.toLowerCase().includes('таможня')
  ).length;

  const transitEvents = events.filter((event: any) => 
    event.description?.toLowerCase().includes('transit') || 
    event.description?.toLowerCase().includes('транзит')
  ).length;

  // Calculate delivery time
  const calculateDeliveryTime = () => {
    if (trackingData?.departure_datetime?.actual && trackingData?.arrival_datetime?.actual) {
      const departure = new Date(trackingData.departure_datetime.actual).getTime();
      const arrival = new Date(trackingData.arrival_datetime.actual).getTime();
      const diffDays = Math.ceil((arrival - departure) / (1000 * 60 * 60 * 24));
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
    }
    return "-";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{events.length}</div>
            <p className="text-sm text-gray-500 mt-2">Total number of tracked events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customs Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customsEvents}</div>
            <p className="text-sm text-gray-500 mt-2">Customs clearances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{calculateDeliveryTime()}</div>
            <p className="text-sm text-gray-500 mt-2">Total transit time</p>
          </CardContent>
        </Card>
      </div>

      <ParcelEvents logistics={logistics} />
    </div>
  )
}

