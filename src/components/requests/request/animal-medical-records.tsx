import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Download, FileText, Filter, Plus, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"

interface AnimalMedicalRecordsProps {
  animalId: string
}

export function AnimalMedicalRecords({ animalId }: AnimalMedicalRecordsProps) {
  // This would be fetched from an API in a real application
  const medicalRecords = [
    {
      id: 1,
      date: "2024-03-05",
      type: "Examination",
      condition: "Healthy",
      treatment: "None",
      veterinarian: "Dr. Smith",
      notes: "Routine health check, no issues found",
    },
    {
      id: 2,
      date: "2024-02-20",
      type: "Treatment",
      condition: "Minor Infection",
      treatment: "Antibiotics - 5 days",
      veterinarian: "Dr. Johnson",
      notes: "Small skin infection on right hind leg, prescribed antibiotics",
    },
    {
      id: 3,
      date: "2024-01-15",
      type: "Surgery",
      condition: "Tumor",
      treatment: "Tumor removal",
      veterinarian: "Dr. Williams",
      notes: "Small benign tumor removed from abdomen, recovery normal",
    },
    {
      id: 4,
      date: "2023-12-10",
      type: "Vaccination",
      condition: "Preventive",
      treatment: "Standard vaccination",
      veterinarian: "Dr. Smith",
      notes: "Annual vaccination administered",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search records..." className="w-full pl-8" />
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
          <Button size="sm" className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Veterinarian</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>
                    <RecordTypeBadge type={record.type} />
                  </TableCell>
                  <TableCell>{record.condition}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
                  <TableCell>{record.veterinarian}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      View
                    </Button>
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

interface RecordTypeBadgeProps {
  type: string
}

function RecordTypeBadge({ type }: RecordTypeBadgeProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "examination":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "treatment":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "surgery":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "vaccination":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={`${getTypeColor(type)}`}>
      {type}
    </Badge>
  )
}
