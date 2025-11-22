import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { MapPin, Thermometer, Weight } from "lucide-react"
import type React from "react"
import type { Animal } from "@/src/app/[vesselId]/requests/[id]/types"

export function AnimalBasicInfo({ animal }: { animal: Animal }) {
  const birthDate = new Date(animal.birthDate || "");
  const today = new Date();
  let age = "-";
  if (birthDate) {
    const years = differenceInYears(today, birthDate);
    const months = differenceInMonths(today, birthDate) % 12;
    const days = differenceInDays(today, birthDate) % 30;
    if (years > 0) {
      age = `${years} Years, ${months} Months, ${days} Days`;
    } else if (months > 0) {
      age = `${months} Months, ${days} Days`;
    } else {
      age = `${days} ${days <= 1 ? "Day" : "Days"}`;
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Type" value={animal.animalType.name} />
            <InfoItem label="Strain" value={animal.strain || "-"} />
            <InfoItem label="Sex" value={animal.sex || "-"} />
            <InfoItem label="Birth Date" value={new Date(animal.birthDate || "").toLocaleDateString() || "-"} />
            <InfoItem label="Age" value={age} />
            <InfoItem label="Status" value={animal.status || "-"} />
            <InfoItem label="Location" value={animal.location || ""} icon={MapPin} className="md:col-span-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Physical Characteristics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Activity level" value={animal.records?.[0]?.activityLevel || "-"} />
            <InfoItem label="Weight" value={animal.records?.[0]?.weight ? animal.records?.[0]?.weight.toString() + "g" : "-"} icon={Weight} />
            <InfoItem label="Temperature" value={animal.records?.[0]?.temperature ? animal.records?.[0]?.temperature.toString() + "°C" : "-"} icon={Thermometer} />
            <InfoItem label="Notes" value={animal.records?.[0]?.notes || "-"} className="md:col-span-3" />
            <InfoItem label="Record Type" value={animal.records?.[0]?.recordType || "-"} className="md:col-span-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Husbandry Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Diet" value="Standard Lab Diet" />
            <InfoItem label="Feeding Schedule" value="Twice daily" />
            <InfoItem label="Housing Type" value="Individual cage" />
            <InfoItem label="Environmental Enrichment" value="Running wheel, nesting material" />
            <InfoItem label="Light Cycle" value="12h light/12h dark" />
            <InfoItem label="Temperature Range" value="20-22°C" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
  icon?: React.ElementType
  className?: string
}

function InfoItem({ label, value, icon: Icon, className }: InfoItemProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
