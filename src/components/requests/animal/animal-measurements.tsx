"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/src/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import type { Animal, AnimalRecordMeasurement } from "@/src/app/[labId]/requests/[id]/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { AnimalPagination } from "@/src/app/[labId]/requests/types"
import { TemperatureChart } from "@/src/components/animals/temperature-chart"
import { WeightChart } from "@/src/components/animals/weight-chart"
import { ChevronDown, Download, Filter, Plus, Check } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

interface AnimalMeasurementsProps {
  handleUpdateDataPagination: (data: {page?: number, pageSize?: number}) => void;
  pagination: AnimalPagination;
  animalId: string;
  animal: Animal;
  userId: string;
  labId: string;
}
export function AnimalMeasurements({ animal, animalId, userId, labId, handleUpdateDataPagination, pagination }: AnimalMeasurementsProps) {
  const [view, setView] = useState<"charts" | "table">("charts")
  const records = animal?.records?.map((record) => ({...record})) || [];
  const currentPage = pagination.currentPage
  const totalPages = pagination.totalPages
  const itemsPerPage = pagination.pageSize
  const totalCount = pagination.totalCount

  const uniqueMeasurements = records.map((record) => record.measurements).flat()
  .reduce((acc: AnimalRecordMeasurement[], current: AnimalRecordMeasurement) => {
    const x = acc.find(item => item.parameter === current.parameter);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  const baseColumns = useMemo(() => ([
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "weight", label: "Weight (g)" },
    { key: "temperature", label: "Temperature (°C)" },
    { key: "feedIntake", label: "Feed Intake (g)" },
    { key: "waterIntake", label: "Water Intake (ml)" },
    { key: "activityLevel", label: "Activity Level" },
    { key: "notes", label: "Notes" },
    // { key: "actions", label: "Actions" },
  ]), []);

  const measurementColumns = useMemo(
    () => uniqueMeasurements.map((m) => ({ key: `measure_${m.parameter}`, label: `${m.parameter} (${m.unit})`, parameter: m.parameter })),
    [uniqueMeasurements]
  );

  const defaultVisibility = useMemo(() => {
    const map: Record<string, boolean> = {
      date: true,
      type: true,
      weight: true,
      temperature: true,
      feedIntake: false,
      waterIntake: false,
      activityLevel: false,
      notes: true,
      // actions: true,
    };
    measurementColumns.forEach((c) => {
      map[c.key] = true;
    });
    return map;
  }, [measurementColumns]);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(defaultVisibility);

  useEffect(() => {
    // Ensure newly appeared measurement columns are added to visibility map
    setVisibleColumns((prev) => {
      const next = { ...prev };
      let changed = false;
      measurementColumns.forEach((c) => {
        if (next[c.key] === undefined) {
          next[c.key] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [measurementColumns]);

  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }, [currentPage, totalPages])
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount)

  const handlePageChange = (page: number) => {
    handleUpdateDataPagination({page: Number(page)});
  }

  const handleItemsPerPageChange = (value: string) => {
    handleUpdateDataPagination({pageSize: Number(value)});
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant={view === "charts" ? "default" : "outline"} size="sm" onClick={() => setView("charts")}>
            Charts
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            Table
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Columns
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {baseColumns.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  onSelect={(e) => {
                    e.preventDefault()
                    setVisibleColumns((prev) => ({ ...prev, [col.key]: !prev[col.key] }))
                  }}
                >
                  {col.label}
                  {visibleColumns[col.key] && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              {measurementColumns.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {measurementColumns.map((col) => (
                    <DropdownMenuItem
                      key={col.key}
                      onSelect={(e) => {
                        e.preventDefault()
                        setVisibleColumns((prev) => ({ ...prev, [col.key]: !prev[col.key] }))
                      }}
                    >
                      {col.label}
                      {visibleColumns[col.key] && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href={`/${labId}/animals/${animalId}/measurements/new`} className="w-full sm:w-auto">
            <Button size="sm" className="flex items-center gap-2 w-full">
              <Plus className="h-4 w-4" />
              New Measurement
            </Button>
          </Link>
        </div>
      </div>

      {view === "charts" ? (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Trend (g)</CardTitle>
            </CardHeader>
            <CardContent>
              <WeightChart records={records} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temperature Trend (°C)</CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureChart records={records} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Measurement History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.date && <TableHead>Date</TableHead>}
                  {visibleColumns.type && <TableHead>Type</TableHead>}
                  {visibleColumns.weight && <TableHead>Weight (g)</TableHead>}
                  {visibleColumns.temperature && <TableHead>Temperature (°C)</TableHead>}
                  {visibleColumns.feedIntake && <TableHead>Feed Intake (g)</TableHead>}
                  {visibleColumns.waterIntake && <TableHead>Water Intake (ml)</TableHead>}
                  {uniqueMeasurements.map((measurement) => (
                    visibleColumns[`measure_${measurement.parameter}`] ? (
                      <TableHead key={measurement.id}>{measurement.parameter} ({measurement.unit})</TableHead>
                    ) : null
                  ))}
                  {visibleColumns.activityLevel && <TableHead>Activity Level</TableHead>}
                  {visibleColumns.notes && <TableHead>Notes</TableHead>}
                  {/* {visibleColumns.actions && <TableHead className="text-right">Actions</TableHead>} */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    {visibleColumns.date && (
                      <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                    )}
                    {visibleColumns.type && <TableCell>{record.recordType || "-"}</TableCell>}
                    {visibleColumns.weight && <TableCell>{record.weight || "-"}</TableCell>}
                    {visibleColumns.temperature && <TableCell>{record.temperature || "-"}</TableCell>}
                    {visibleColumns.feedIntake && <TableCell>{record.feedIntake || "-"}</TableCell>}
                    {visibleColumns.waterIntake && <TableCell>{record.waterIntake || "-"}</TableCell>}
                    {uniqueMeasurements.map((measurement) => (
                      visibleColumns[`measure_${measurement.parameter}`] ? (
                        <TableCell key={measurement.id}>
                          {record.measurements.find((m) => m.parameter === measurement.parameter)?.value || "-"}
                        </TableCell>
                      ) : null
                    ))}
                    {visibleColumns.activityLevel && <TableCell>{record.activityLevel || "-"}</TableCell>}
                    {visibleColumns.notes && (
                      <TableCell className="max-w-[200px] truncate">{record.notes || "-"}</TableCell>
                    )}
                    {/* {visibleColumns.actions && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-4 px-4 py-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {endIndex} of {totalCount} entries
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center sm:justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (pagination.hasPreviousPage) handlePageChange(currentPage - 1)
                          }}
                          className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {pageNumbers[0] > 1 && (
                        <>
                          <PaginationItem>
                            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1) }}>
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {pageNumbers[0] > 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )}

                      {pageNumbers.map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); handlePageChange(page) }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages) }}>
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            if (pagination.hasNextPage) handlePageChange(currentPage + 1)
                          }}
                          className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
