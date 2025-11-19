import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { AlertCircle, Clipboard, FileText, Microscope, Pill, Stethoscope, Weight } from "lucide-react"
import Link from "next/link"

interface QuickActionPanelProps {
  animalId: string
}

export function QuickActionPanel({ animalId }: QuickActionPanelProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link href={`/animals/${animalId}/measurements/new`}>
            <Button variant="outline" className="w-full justify-start">
              <Weight className="mr-2 h-4 w-4 text-blue-600" />
              Record Measurement
            </Button>
          </Link>

          <Button variant="outline" className="w-full justify-start">
            <Stethoscope className="mr-2 h-4 w-4 text-blue-600" />
            Add Medical Record
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Microscope className="mr-2 h-4 w-4 text-blue-600" />
            Add to Experiment
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Pill className="mr-2 h-4 w-4 text-blue-600" />
            Record Treatment
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
            Add Observation
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Clipboard className="mr-2 h-4 w-4 text-blue-600" />
            Generate Report
          </Button>

          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <AlertCircle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActivityItem
            icon={Weight}
            title="Weight Measurement"
            description="Recorded by Dr. Johnson"
            time="Today, 9:45 AM"
          />

          <ActivityItem
            icon={Stethoscope}
            title="Health Check"
            description="Performed by Dr. Smith"
            time="Yesterday, 2:30 PM"
          />

          <ActivityItem
            icon={Microscope}
            title="Blood Sample"
            description="Collected for EXP-2024-001"
            time="Mar 10, 11:15 AM"
          />

          <ActivityItem
            icon={FileText}
            title="Observation Added"
            description="Behavior notes updated"
            time="Mar 8, 4:20 PM"
          />

          <Button variant="link" className="w-full text-blue-600 hover:text-blue-700 p-0 h-auto">
            View all activity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ElementType
  title: string
  description: string
  time: string
}

function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-blue-50 rounded-full p-1.5">
        <Icon className="h-3.5 w-3.5 text-blue-600" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  )
}
