"use client"

import { useState } from "react"
import { Card } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { AnimalBasicInfo } from "@/src/components/animals/animal/animal-basic-info"
import { AnimalMeasurements } from "@/src/components/animals/animal/animal-measurements"
import { AnimalMedicalRecords } from "@/src/components/animals/animal/animal-medical-records"
import { AnimalExperiments } from "@/src/components/animals/animal/animal-experiments"
import { AnimalGenealogy } from "@/src/components/animals/animal/animal-genealogy"

interface AnimalTabsProps {
  id: string
  type: string;
  strain: string;
  sex: string;
  birthDate: string;
  age: string;
  weight: string;
  location: string;
}

export function AnimalTabs({ id }: AnimalTabsProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const animal = { 
    id, 
    type: "example", 
    strain: "example", 
    sex: "example", 
    birthDate: "example", 
    age: "example", 
    weight: "example", 
    location: "example" 
  };
  return (
    <Card>
      <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="genealogy">Genealogy</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <AnimalBasicInfo animal={animal} />
        </TabsContent>
        <TabsContent value="measurements">
          <AnimalMeasurements animalId={animal.id} />
        </TabsContent>
        <TabsContent value="medical-records">
          <AnimalMedicalRecords animalId={animal.id} />
        </TabsContent>
        <TabsContent value="experiments">
          <AnimalExperiments animalId={animal.id} />
        </TabsContent>
        <TabsContent value="genealogy">
          <AnimalGenealogy animalId={animal.id} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
