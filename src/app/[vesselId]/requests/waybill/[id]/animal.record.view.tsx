"use client"

import { AnimalMedicalRecords } from "@/src/components/animals/animal/animal-medical-records"
import { AnimalMeasurements } from "@/src/components/animals/animal/animal-measurements"
import { AnimalExperiments } from "@/src/components/animals/animal/animal-experiments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { AnimalBasicInfo } from "@/src/components/animals/animal/animal-basic-info"
import { AnimalGenealogy } from "@/src/components/animals/animal/animal-genealogy"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { QuickActionPanel } from "@/src/components/animals/quick-action-panel"
import { Calendar, Clock, Edit, MapPin, Plus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import type { AnimalPagination } from "../../types"
import { useRouter } from "next/navigation"
import type { Animal } from "./types"

export interface AnimalDetailPageProps {
    handleUpdateDataPagination: (data: {page?: number, pageSize?: number}) => void;
    pagination: AnimalPagination;
    animalId: string;
    animal: Animal;
    userId: string;
    labId: string;
}

export default function AnimalDetailPage({userId, labId, animalId, animal, handleUpdateDataPagination, pagination}: AnimalDetailPageProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid gap-6">
        {/* Animal Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 rounded-md border">
            <AvatarImage src={"/placeholder.svg"} alt={animal.name} />
            <AvatarFallback className="rounded-md bg-blue-100 text-blue-600">
              {animal.animalType.name}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold">{animal.name}</h1>
              <Badge className="w-fit bg-blue-600 hover:bg-blue-700">{animal.id}</Badge>
              <StatusBadge status={animal.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{animal.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                    Born: {new Date(animal.birthDate || "").toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Last checked: {new Date(animal.acquisitionDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => {
                router.push(`/${labId}/animals/${animalId}/measurements/new`)
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Measurement
            </Button>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="basic-info"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="measurements"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Measurements
                </TabsTrigger>
                <TabsTrigger
                  value="medical-records"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Medical Records
                </TabsTrigger>
                <TabsTrigger
                  value="experiments"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Experiments
                </TabsTrigger>
                <TabsTrigger
                  value="genealogy"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Genealogy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="pt-6">
                <AnimalBasicInfo animal={animal} />
              </TabsContent>

              <TabsContent value="measurements" className="pt-6">
                <AnimalMeasurements
                    handleUpdateDataPagination={handleUpdateDataPagination}
                    pagination={pagination}
                    animalId={animalId}
                    animal={animal}
                    userId={userId}
                    labId={labId}
                />
              </TabsContent>

              <TabsContent value="medical-records" className="pt-6">
                <AnimalMedicalRecords animalId={animal.id || ""} />
              </TabsContent>

              <TabsContent value="experiments" className="pt-6">
                <AnimalExperiments animalId={animal.id || ""} />
              </TabsContent>

              <TabsContent value="genealogy" className="pt-6">
                <AnimalGenealogy animalId={animal.id || ""} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <QuickActionPanel animalId={animal.id || ""} />
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
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "quarantine":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "treatment":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "critical":
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
