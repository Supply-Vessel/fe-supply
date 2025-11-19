import { Input } from "@/src/components/ui/input"
import { Search } from "lucide-react"

interface AnimalsHeaderProps {
  handleSearch: (search: string) => void
  animalSearch: string
}

export function AnimalsHeader({ handleSearch, animalSearch }: AnimalsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Requests Status</h1>
        <p className="text-gray-500">Manage and monitor your requests</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="search"
            placeholder="Search requests..."
            className="w-full pl-8 sm:w-[240px]"
            value={animalSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
