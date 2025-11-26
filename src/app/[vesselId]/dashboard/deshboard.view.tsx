import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { RequestPopulationChart } from "@/src/components/dashboard/request-population-chart"
import { StatusStatisticsChart } from "@/src/components/dashboard/status-statistics-chart"
import { SubscriptionStatus } from "@/src/components/dashboard/subscription-status"
import { NotificationPanel } from "@/src/components/dashboard/notification-panel"
import { DashboardStatus } from "@/src/components/dashboard/dashboard-status"
import { UpcomingEvents } from "@/src/components/dashboard/upcoming-events"
import type { Experiment, Request, Task } from "./types"

export interface DashboardViewProps {
  requests: Request[];
  previousMonthData?: {
      requests: number;
  };
}

export default function DashboardView({requests, previousMonthData}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardStatus 
        previousMonthData={previousMonthData}
        requests={requests}
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 w-[315px] md:w-full">
          <CardHeader>
            <CardTitle>Request Activity</CardTitle>
            <CardDescription>Request changes over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <RequestPopulationChart requests={requests} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 w-[315px] md:w-full">
          <CardHeader>
            <CardTitle>Status Statistics</CardTitle>
            <CardDescription>Current request status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusStatisticsChart requests={requests} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
