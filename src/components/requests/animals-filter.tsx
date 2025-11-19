import type { AnimalEnums, AnimalType, FiltersType } from "@/src/app/[labId]/requests/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Separator } from "@/src/components/ui/separator"
import { Checkbox } from "@/src/components/ui/checkbox"
import { AgeGroup, AnimalStatus, Sex } from "./types"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Filter, RotateCcw } from "lucide-react"
import { useState } from "react"

interface AnimalsFilterProps {
  handleUpdateDataPagination: (data: {page?: number, pageSize?: number, filters?: FiltersType}) => void;
  setFilters: (filters: FiltersType) => void;
  animalTypes: AnimalType[];
  animalEnums: AnimalEnums;
}

export function AnimalsFilter({ animalTypes, animalEnums, handleUpdateDataPagination, setFilters }: AnimalsFilterProps) {
  // Состояние для фильтров
  const [selectedAnimalTypes, setSelectedAnimalTypes] = useState<string[]>([])
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedSex, setSelectedSex] = useState<string>("all")

  // Функции для управления состоянием
  const handleAnimalTypeChange = (animalTypeName: string, checked: boolean) => {
    if (checked) {
      setSelectedAnimalTypes(prev => [...prev, animalTypeName])
    } else {
      setSelectedAnimalTypes(prev => prev.filter(name => name !== animalTypeName))
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, status])
    } else {
      setSelectedStatuses(prev => prev.filter(s => s !== status))
    }
  }

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    if (checked) {
      setSelectedAgeGroups(prev => [...prev, ageGroup])
    } else {
      setSelectedAgeGroups(prev => prev.filter(ag => ag !== ageGroup))
    }
  }

  const resetFilters = () => {
    setSelectedAnimalTypes([])
    setSelectedStatuses([])
    setSelectedSex("all")
    setSelectedAgeGroups([])
    setFilters({})
  }

  const applyFilters = () => {
    const filters = {
      animalTypes: selectedAnimalTypes as string[],
      statuses: selectedStatuses as AnimalStatus[],
      sex: selectedSex !== "all" ? (selectedSex as Sex) : null,
      ageGroups: selectedAgeGroups as AgeGroup[]
    }
 
    handleUpdateDataPagination({ filters: filters })
    setFilters(filters)
  }
  return (  
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset filters</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Species</h3>
          <div className="space-y-2">
            {animalTypes.map((animalType) => (
                <div className="flex items-center space-x-2" key={animalType.id}>
                  <Checkbox 
                    id={animalType.name}
                    checked={selectedAnimalTypes.includes(animalType.name || "")}
                    onCheckedChange={(checked) => handleAnimalTypeChange(animalType.name || "", Boolean(checked))}
                  />
                  <Label htmlFor={animalType.name}>{animalType.name}</Label>
                </div>
              ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="space-y-2">
            {animalEnums.status.map((status) => (
              <div className="flex items-center space-x-2" key={status}>
                <Checkbox 
                  id={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => handleStatusChange(status, Boolean(checked))}
                />
                <Label htmlFor={status}>{status}</Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Sex</h3>
          <RadioGroup value={selectedSex} onValueChange={setSelectedSex}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            {animalEnums.sex.map((sex) => (
              <div className="flex items-center space-x-2" key={sex}>
                <RadioGroupItem value={sex} id={sex} />
                <Label htmlFor={sex}>{sex}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Age</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="juvenile"
                checked={selectedAgeGroups.includes(AgeGroup.JUVENILE)}
                onCheckedChange={(checked) => handleAgeGroupChange(AgeGroup.JUVENILE, Boolean(checked))}
              />
              <Label htmlFor="juvenile">Juvenile (0-3 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="young-adult"
                checked={selectedAgeGroups.includes(AgeGroup.YOUNG_ADULT)}
                onCheckedChange={(checked) => handleAgeGroupChange(AgeGroup.YOUNG_ADULT, Boolean(checked))}
              />
              <Label htmlFor="young-adult">Young Adult (3-6 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="adult"
                checked={selectedAgeGroups.includes(AgeGroup.ADULT)}
                onCheckedChange={(checked) => handleAgeGroupChange(AgeGroup.ADULT, Boolean(checked))}
              />
              <Label htmlFor="adult">Adult (6-12 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="senior"
                checked={selectedAgeGroups.includes(AgeGroup.SENIOR)}
                onCheckedChange={(checked) => handleAgeGroupChange(AgeGroup.SENIOR, Boolean(checked))}
              />
              <Label htmlFor="senior">Senior (12+ months)</Label>
            </div>
          </div>
        </div>
        <Button onClick={applyFilters} className="w-full">
          <Filter className="mr-1 h-4 w-4" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
