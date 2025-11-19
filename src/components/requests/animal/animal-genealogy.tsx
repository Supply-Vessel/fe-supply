import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import Link from "next/link"

interface AnimalGenealogyProps {
  animalId: string
}

export function AnimalGenealogy({ animalId }: AnimalGenealogyProps) {
  // This would be fetched from an API in a real application
  const parents = [
    {
      id: "M-2022-089",
      name: "Subject M-089",
      type: "Mouse",
      sex: "Male",
      birthDate: "2022-08-10",
      status: "Active",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "M-2022-102",
      name: "Subject M-102",
      type: "Mouse",
      sex: "Female",
      birthDate: "2022-09-05",
      status: "Inactive",
      photo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const offspring = [
    {
      id: "M-2023-178",
      name: "Subject M-178",
      type: "Mouse",
      sex: "Male",
      birthDate: "2023-06-20",
      status: "Active",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "M-2023-179",
      name: "Subject M-179",
      type: "Mouse",
      sex: "Female",
      birthDate: "2023-06-20",
      status: "Active",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "M-2023-180",
      name: "Subject M-180",
      type: "Mouse",
      sex: "Male",
      birthDate: "2023-06-20",
      status: "Deceased",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "M-2023-181",
      name: "Subject M-181",
      type: "Mouse",
      sex: "Female",
      birthDate: "2023-06-20",
      status: "Active",
      photo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "M-2023-182",
      name: "Subject M-182",
      type: "Mouse",
      sex: "Male",
      birthDate: "2023-06-20",
      status: "Active",
      photo: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parents.map((parent) => (
              <AnimalCard key={parent.id} animal={parent} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Offspring</CardTitle>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Total: {offspring.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offspring.map((child) => (
              <AnimalCard key={child.id} animal={child} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Family Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="relative p-6 border border-dashed rounded-lg border-gray-300 text-center">
              <p className="text-gray-500">Interactive family tree visualization will be displayed here</p>
              <Button variant="outline" size="sm" className="mt-2">
                Generate Family Tree
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AnimalCardProps {
  animal: any
}

function AnimalCard({ animal }: AnimalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "deceased":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Link href={`/animals/${animal.id}`}>
      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
        <Avatar className="h-10 w-10 rounded-md border">
          <AvatarImage src={animal.photo || "/placeholder.svg"} alt={animal.name} />
          <AvatarFallback className="rounded-md bg-blue-100 text-blue-600">
            {animal.type.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{animal.name}</p>
            <Badge variant="outline" className={`${getStatusColor(animal.status)}`}>
              {animal.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{animal.id}</span>
            <span>•</span>
            <span>{animal.sex}</span>
            <span>•</span>
            <span>Born: {animal.birthDate}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
