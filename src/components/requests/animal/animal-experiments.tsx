import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Calendar, Clock, Download, ExternalLink, Filter, Search, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"
import Link from "next/link"

interface AnimalExperimentsProps {
  animalId: string
}

export function AnimalExperiments({ animalId }: AnimalExperimentsProps) {
  // This would be fetched from an API in a real application
  const experiments = [
    {
      id: "EXP-2024-001",
      title: "Neurotransmitter Response Study",
      status: "Active",
      startDate: "2024-02-15",
      endDate: "2024-04-30",
      principalInvestigator: "Dr. Emily Chen",
      department: "Neuroscience",
      role: "Test Subject",
    },
    {
      id: "EXP-2023-089",
      title: "Behavioral Response to Environmental Stimuli",
      status: "Completed",
      startDate: "2023-10-10",
      endDate: "2023-12-20",
      principalInvestigator: "Dr. Michael Johnson",
      department: "Behavioral Science",
      role: "Control Group",
    },
    {
      id: "EXP-2023-045",
      title: "Immune System Response to Vaccine Candidates",
      status: "Completed",
      startDate: "2023-05-05",
      endDate: "2023-08-15",
      principalInvestigator: "Dr. Sarah Williams",
      department: "Immunology",
      role: "Test Subject",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search experiments..." className="w-full pl-8" />
        </div>

        <div className="flex items-center gap-2">
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
          <CardTitle>Experiment Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Principal Investigator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiments.map((experiment) => (
                <TableRow key={experiment.id}>
                  <TableCell className="font-medium">{experiment.id}</TableCell>
                  <TableCell>{experiment.title}</TableCell>
                  <TableCell>
                    <ExperimentStatusBadge status={experiment.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">
                        {experiment.startDate} - {experiment.endDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{experiment.principalInvestigator}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/experiments/${experiment.id}`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experiment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Blood Sample Collection</p>
                    <p className="text-sm text-gray-600">EXP-2024-001: Neurotransmitter Response Study</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">Tomorrow, 9:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-purple-50 border border-purple-200 rounded-md">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Behavioral Test Session</p>
                    <p className="text-sm text-gray-600">EXP-2024-001: Neurotransmitter Response Study</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">March 25, 2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Final Assessment</p>
                    <p className="text-sm text-gray-600">EXP-2024-001: Neurotransmitter Response Study</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">April 28, 10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ExperimentStatusBadgeProps {
  status: string
}

function ExperimentStatusBadge({ status }: ExperimentStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "scheduled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
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
