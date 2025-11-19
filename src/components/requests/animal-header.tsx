import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ArrowLeft, Edit, Printer, Share2 } from "lucide-react"
import Link from "next/link"

interface AnimalHeaderProps {
  id: string
}

export function AnimalHeader({ id }: AnimalHeaderProps) {
  // This would normally fetch data based on the ID
  const animal = {
    id,
    name: "Alpha",
    species: "Mouse",
    sex: "Male",
    age: "6 months",
    status: "Healthy",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/animals">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to animals</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {animal.name}
          <span className="ml-2 text-gray-500">{animal.id}</span>
        </h1>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <span className="text-3xl">🐭</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {animal.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {animal.species} • {animal.sex} • {animal.age}
              </span>
            </div>
            <p className="text-sm text-gray-500">Added on Jan 15, 2025 • Last updated 2 days ago</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-1 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}
