"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/src/components/ui/pagination"
import { Request, RequestStatus, RequestType, PoStatus, TSIConfirm, PaymentStatus, type RequestEnums, type RequestPagination } from "./types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { LayoutGrid, LayoutList, Check, X, Plus } from "lucide-react"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Card } from "@/src/components/ui/card"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import { toast } from "sonner"

interface RequestsListProps {
  handleUpdateDataPagination: (data: {page?: number, pageSize?: number, defaultType: RequestType}) => void;
  setPagination: (pagination: RequestPagination) => void;
  setOpenEditRequestDialog: (open: boolean) => void;
  setOpenAddRequestDialog: (open: boolean) => void;
  setSelectedRequest: (request: Request) => void;
  onSave: (request: Partial<Request>) => void;
  onAdd: (request: Partial<Request>) => void;
  requestPagination: RequestPagination;
  requestEnums: RequestEnums;
  defaultType?: RequestType;
  requests: Request[];
}

interface EditState {
  [key: string]: boolean;
}

interface EditData {
  [key: string]: Partial<Request>;
}

interface ColumnVisibility {
  identifier: boolean;
  requestType: boolean;
  description: boolean;
  status: boolean;
  poStatus: boolean;
  poNumber: boolean;
  tsiConfirm: boolean;
  paymentStatus: boolean;
  companyOfOrder: boolean;
  countryOfOrder: boolean;
  wayBillNumber: boolean;
  storeLocation: boolean;
}

export function RequestsList({requests, requestPagination, setPagination, handleUpdateDataPagination, onSave, onAdd, defaultType, requestEnums, setSelectedRequest, setOpenEditRequestDialog, setOpenAddRequestDialog}: RequestsListProps) {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const [view, setView] = useState<"table" | "grid">("table")
  const [editingRows, setEditingRows] = useState<EditState>({})
  const [editData, setEditData] = useState<EditData>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newRowData, setNewRowData] = useState<Partial<Request>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    identifier: true,
    requestType: true,
    description: true,
    status: true,
    poStatus: true,
    poNumber: true,
    tsiConfirm: true,
    paymentStatus: true,
    companyOfOrder: true,
    countryOfOrder: true,
    wayBillNumber: true,
    storeLocation: true,
  })
  const [showColumnSelect, setShowColumnSelect] = useState(false)

  const params = useParams();
  const {vesselId } = params;
  
  const currentRequests = requests
  const currentPage = requestPagination.currentPage
  const totalPages = requestPagination.totalPages
  const itemsPerPage = requestPagination.pageSize
  const totalCount = requestPagination.totalCount
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount)
  
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

  const toggleRequestSelection = (id: string) => {
    setSelectedRequests((prev) => (prev.includes(id) ? prev.filter((requestId) => requestId !== id) : [...prev, id]))
  }

  const toggleAllRequests = () => {
    setSelectedRequests((prev) => (prev.length === filteredRequests.length ? [] : filteredRequests.map((request) => request.id || "")))
  }

  const handlePageChange = (page: number) => {
    setPagination({
      ...requestPagination,
      currentPage: page
    })
    handleUpdateDataPagination({page: Number(page), defaultType: defaultType as RequestType});
    setSelectedRequests([])
  }

  const handleItemsPerPageChange = (value: string) => {
    setPagination({
      ...requestPagination,
      pageSize: Number(value),
    })
    handleUpdateDataPagination({page: 1, pageSize: Number(value), defaultType: defaultType as RequestType});
    setSelectedRequests([])
  }

  const handleEdit = (requestId: string, request: Request) => {
    setEditingRows(prev => ({ ...prev, [requestId]: true }))
    setEditData(prev => ({ ...prev, [requestId]: { ...request } }))
  }

  const handleCancelEdit = (requestId: string) => {
    setEditingRows(prev => ({ ...prev, [requestId]: false }))
    setEditData(prev => {
      const newData = { ...prev }
      delete newData[requestId]
      return newData
    })
  }

  const handleSaveEdit = (requestId: string) => {
    const dataToSave = editData[requestId]
    if (dataToSave?.identifier === "" || dataToSave?.identifier === undefined) {
      toast.error("Identifier is required")
      return
    }
    if (dataToSave) {
      onSave({ ...dataToSave, id: requestId, requestType: defaultType as RequestType })
    }
    setEditingRows(prev => ({ ...prev, [requestId]: false }))
    setEditData(prev => {
      const newData = { ...prev }
      delete newData[requestId]
      return newData
    })
  }

  const handleEditFieldChange = (requestId: string, field: keyof Request, value: any) => {
    setEditData(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value
      }
    }))
  }

  const handleAddNew = () => {
    setIsAddingNew(true)
    setNewRowData({
      identifier: "",
      description: "",
      status: RequestStatus.WAITING,
      poStatus: PoStatus.WITHOUT_PO,
      vesselId: Array.isArray(vesselId) ?vesselId[0] :vesselId || "",
      requestType: defaultType as RequestType,
    })
  }

  const handleCancelAddNew = () => {
    setIsAddingNew(false)
    setNewRowData({})
  }

  const handleSaveNew = () => {
    if (newRowData?.identifier === "" || newRowData?.identifier === undefined) {
      toast.error("Identifier is required")
      return
    }
    onAdd(newRowData)
    setIsAddingNew(false)
    setNewRowData({})
  }

  const handleNewRowFieldChange = (field: keyof Request, value: any) => {
    setNewRowData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return currentRequests
    
    const query = searchQuery.toLowerCase()
    return currentRequests.filter(request => 
      request.identifier?.toLowerCase().includes(query) ||
      request.description?.toLowerCase().includes(query) ||
      request.status?.toLowerCase().includes(query) ||
      request.poStatus?.toLowerCase().includes(query) ||
      request.poNumber?.toLowerCase().includes(query) ||
      request.tsiConfirm?.toLowerCase().includes(query) ||
      request.paymentStatus?.toLowerCase().includes(query) ||
      request.companyOfOrder?.toLowerCase().includes(query) ||
      request.countryOfOrder?.toLowerCase().includes(query) ||
      request.storeLocation?.toLowerCase().includes(query) ||
      request.wayBillNumber?.toLowerCase().includes(query)
    )
  }, [currentRequests, searchQuery])

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.WAITING:
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case RequestStatus.ORDERED:
        return "bg-pink-100 text-pink-800 hover:bg-pink-100"
      case RequestStatus.RECEIVED:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case RequestStatus.ON_HOLD:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case RequestStatus.CANCELLED:
        return "bg-red-100 text-red-800 hover:bg-red-100" // red-500
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getRowColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.WAITING:
        return "bg-green-100/40 text-green-800 hover:bg-green-100"
      case RequestStatus.ORDERED:
        return "bg-pink-100/40 text-pink-800 hover:bg-pink-100"
      case RequestStatus.RECEIVED:
        return "bg-yellow-100/40 text-yellow-800 hover:bg-yellow-100"
      case RequestStatus.ON_HOLD:
        return "bg-orange-100/40 text-orange-800 hover:bg-orange-100"
      case RequestStatus.CANCELLED:
        return "bg-red-100/40 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100/40 text-gray-800 hover:bg-gray-100"
    }
  }

  const getRequestTypeColor = (type?: RequestType) => {
    switch (type) {
      case RequestType.ENGINE:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case RequestType.ELECTRICAL:
        return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100"
      case RequestType.DECK:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPoStatusColor = (poStatus: PoStatus) => {
    switch (poStatus) {
      case PoStatus.WITHOUT_PO:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case PoStatus.PO_DONE:
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getTSIConfirmColor = (tsiConfirm?: TSIConfirm) => {
    switch (tsiConfirm) {
      case TSIConfirm.CONFIRMED:
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case TSIConfirm.CONFIRMED_WITH_NOTES:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case TSIConfirm.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case TSIConfirm.NOT_CONFIRMED:
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPaymentStatusColor = (paymentStatus?: PaymentStatus) => {
    switch (paymentStatus) {
      case PaymentStatus.PREPAYMENT_PAID:
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case PaymentStatus.CREDIT_PAID:
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case PaymentStatus.PREPAYMENT_NOT_PAID:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case PaymentStatus.CREDIT_NOT_PAID:
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const renderEditableCell = (request: Request, field: keyof Request, isEditing: boolean) => {
    const requestId = request.id || ""
    const currentValue = isEditing ? (editData[requestId]?.[field] ?? request[field]) : request[field]

    if (!isEditing) {
      if (field === "status") {
        return (
          <Badge variant="outline" className={getStatusColor(currentValue as RequestStatus)}>
            {currentValue as string}
          </Badge>
        )
      }
      if (field === "poStatus") {
        return (
          <Badge variant="outline" className={getPoStatusColor(currentValue as PoStatus)}>
            {currentValue as string}
          </Badge>
        )
      }
      if (field === "tsiConfirm") {
        return currentValue ? (
          <Badge variant="outline" className={getTSIConfirmColor(currentValue as TSIConfirm)}>
            {currentValue as string}
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">Not set</span>
        )
      }
      if (field === "paymentStatus") {
        return currentValue ? (
          <Badge variant="outline" className={getPaymentStatusColor(currentValue as PaymentStatus)}>
            {currentValue as string}
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">Not set</span>
        )
      }
      return currentValue as string
    }

    // Editable fields
    if (field === "status") {
      return (
        <Select
          value={currentValue as string || RequestStatus.WAITING}
          onValueChange={(value) => handleEditFieldChange(requestId, field, value)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.requestStatus.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field === "poStatus") {
      return (
        <Select
          value={currentValue as string || PoStatus.WITHOUT_PO}
          onValueChange={(value) => handleEditFieldChange(requestId, field, value)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.poStatus.map((poStatus) => (
              <SelectItem key={poStatus} value={poStatus}>{poStatus}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field === "tsiConfirm") {
      return (
        <Select
          value={currentValue as string || TSIConfirm.NOT_CONFIRMED}
          onValueChange={(value) => handleEditFieldChange(requestId, field, value || undefined)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.tsiConfirm.map((tsiConfirm) => (
              <SelectItem key={tsiConfirm} value={tsiConfirm}>{tsiConfirm}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field === "paymentStatus") {
      return (
        <Select
          value={currentValue as string || PaymentStatus.CREDIT_NOT_PAID}
          onValueChange={(value) => handleEditFieldChange(requestId, field, value || undefined)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.paymentStatus.map((paymentStatus) => (
              <SelectItem key={paymentStatus} value={paymentStatus}>{paymentStatus}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        type="text"
        value={currentValue as string || ""}
        onChange={(e) => handleEditFieldChange(requestId, field, e.target.value)}
        className="h-8"
      />
    )
  }

  const renderNewRowCell = (field: keyof Request) => {
    const currentValue = newRowData[field]

    if (field === "status") {
      return (
        <Select
          value={currentValue as string || RequestStatus.WAITING}
          onValueChange={(value) => handleNewRowFieldChange(field, value)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.requestStatus.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field === "poStatus") {
      return (
        <Select
          value={currentValue as string || PoStatus.WITHOUT_PO}
          onValueChange={(value) => handleNewRowFieldChange(field, value)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.poStatus.map((poStatus) => (
              <SelectItem key={poStatus} value={poStatus}>{poStatus}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field === "tsiConfirm") {
      return (
        <Select
          value={currentValue as string || TSIConfirm.NOT_CONFIRMED}
          onValueChange={(value) => handleNewRowFieldChange(field, value || undefined)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.tsiConfirm.map((tsiConfirm) => (
              <SelectItem key={tsiConfirm} value={tsiConfirm}>{tsiConfirm}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field === "paymentStatus") {
      return (
        <Select
          value={currentValue as string || PaymentStatus.CREDIT_NOT_PAID}
          onValueChange={(value) => handleNewRowFieldChange(field, value || undefined)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            {requestEnums.paymentStatus.map((paymentStatus) => (
              <SelectItem key={paymentStatus} value={paymentStatus}>{paymentStatus}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        type="text"
        value={currentValue as string || ""}
        onChange={(e) => handleNewRowFieldChange(field, e.target.value)}
        className="h-8"
        placeholder={`Enter ${field}...`}
        required={field === "identifier"}
      />
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0} onCheckedChange={toggleAllRequests} />
          <span className="text-sm text-gray-500">{selectedRequests.length} selected</span>
          <Badge variant="outline" className={getRequestTypeColor(defaultType)}>
            {defaultType || "N/A"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={view === "table" ? handleAddNew : () => {setOpenAddRequestDialog(true)}}
            disabled={isAddingNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Request
          </Button>
          
          <Popover open={showColumnSelect} onOpenChange={setShowColumnSelect}>
            <PopoverTrigger asChild>
              <Button disabled={view === "grid"} variant="outline" size="sm">
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm mb-3">Toggle columns</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-identifier"
                      checked={columnVisibility.identifier}
                      onCheckedChange={() => toggleColumnVisibility("identifier")}
                    />
                    <label htmlFor="col-identifier" className="text-sm cursor-pointer">Identifier</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-requestType"
                      checked={columnVisibility.requestType}
                      onCheckedChange={() => toggleColumnVisibility("requestType")}
                    />
                    <label htmlFor="col-requestType" className="text-sm cursor-pointer">Request Type</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-description"
                      checked={columnVisibility.description}
                      onCheckedChange={() => toggleColumnVisibility("description")}
                    />
                    <label htmlFor="col-description" className="text-sm cursor-pointer">Description</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-status"
                      checked={columnVisibility.status}
                      onCheckedChange={() => toggleColumnVisibility("status")}
                    />
                    <label htmlFor="col-status" className="text-sm cursor-pointer">Status</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-poStatus"
                      checked={columnVisibility.poStatus}
                      onCheckedChange={() => toggleColumnVisibility("poStatus")}
                    />
                    <label htmlFor="col-poStatus" className="text-sm cursor-pointer">PO Status</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-poNumber"
                      checked={columnVisibility.poNumber}
                      onCheckedChange={() => toggleColumnVisibility("poNumber")}
                    />
                    <label htmlFor="col-poNumber" className="text-sm cursor-pointer">PO Number</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-tsiConfirm"
                      checked={columnVisibility.tsiConfirm}
                      onCheckedChange={() => toggleColumnVisibility("tsiConfirm")}
                    />
                    <label htmlFor="col-tsiConfirm" className="text-sm cursor-pointer">TSI Confirm</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-paymentStatus"
                      checked={columnVisibility.paymentStatus}
                      onCheckedChange={() => toggleColumnVisibility("paymentStatus")}
                    />
                    <label htmlFor="col-paymentStatus" className="text-sm cursor-pointer">Payment Status</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-companyOfOrder"
                      checked={columnVisibility.companyOfOrder}
                      onCheckedChange={() => toggleColumnVisibility("companyOfOrder")}
                    />
                    <label htmlFor="col-companyOfOrder" className="text-sm cursor-pointer">Company</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-countryOfOrder"
                      checked={columnVisibility.countryOfOrder}
                      onCheckedChange={() => toggleColumnVisibility("countryOfOrder")}
                    />
                    <label htmlFor="col-countryOfOrder" className="text-sm cursor-pointer">Country</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-storeLocation"
                      checked={columnVisibility.storeLocation}
                      onCheckedChange={() => toggleColumnVisibility("storeLocation")}
                    />
                    <label htmlFor="col-storeLocation" className="text-sm cursor-pointer">Store Loc.</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="col-wayBillNumber"
                      checked={columnVisibility.wayBillNumber}
                      onCheckedChange={() => toggleColumnVisibility("wayBillNumber")}
                    />
                    <label htmlFor="col-wayBillNumber" className="text-sm cursor-pointer">Way Bill No.</label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("table")}
            className={view === "table" ? "bg-gray-100" : ""}
          >
            <LayoutList className="h-4 w-4" />
            <span className="sr-only">Table view</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-gray-100" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
      </div>
      
      {view === "table" ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                {columnVisibility.identifier && <TableHead>Identifier</TableHead>}
                {columnVisibility.poStatus && <TableHead>PO Status</TableHead>}
                {columnVisibility.poNumber && <TableHead>PO Number</TableHead>}
                {columnVisibility.paymentStatus && <TableHead>Payment Status</TableHead>}
                {columnVisibility.description && <TableHead>Description</TableHead>}
                {columnVisibility.status && <TableHead>Status</TableHead>}
                {columnVisibility.tsiConfirm && <TableHead>TSI Confirm</TableHead>}
                {columnVisibility.companyOfOrder && <TableHead>Company</TableHead>}
                {columnVisibility.countryOfOrder && <TableHead>Country</TableHead>}
                {columnVisibility.storeLocation && <TableHead>Store Loc.</TableHead>}
                {columnVisibility.wayBillNumber && <TableHead>Way Bill No.</TableHead>}
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAddingNew && (
                <TableRow  className="bg-blue-50">
                  <TableCell>
                    <Checkbox disabled />
                  </TableCell>
                  {columnVisibility.identifier && <TableCell>{renderNewRowCell("identifier")}</TableCell>}
                  {columnVisibility.poStatus && <TableCell>{renderNewRowCell("poStatus")}</TableCell>}
                  {columnVisibility.poNumber && <TableCell>{renderNewRowCell("poNumber")}</TableCell>}
                  {columnVisibility.paymentStatus && <TableCell>{renderNewRowCell("paymentStatus")}</TableCell>}
                  {columnVisibility.description && <TableCell>{renderNewRowCell("description")}</TableCell>}
                  {columnVisibility.status && <TableCell>{renderNewRowCell("status")}</TableCell>}
                  {columnVisibility.tsiConfirm && <TableCell>{renderNewRowCell("tsiConfirm")}</TableCell>}
                  {columnVisibility.companyOfOrder && <TableCell>{renderNewRowCell("companyOfOrder")}</TableCell>}
                  {columnVisibility.countryOfOrder && <TableCell>{renderNewRowCell("countryOfOrder")}</TableCell>}
                  {columnVisibility.storeLocation && <TableCell>{renderNewRowCell("storeLocation")}</TableCell>}
                  {columnVisibility.wayBillNumber && <TableCell>{renderNewRowCell("wayBillNumber")}</TableCell>}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={handleSaveNew}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={handleCancelAddNew}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              
              {filteredRequests.map((request) => {
                const isEditing = editingRows[request.id || ""]
                return (
                  <TableRow
                    onDoubleClick={() => !isEditing && handleEdit(request.id || "", request)}
                    className={"cursor-pointer " + (isEditing ? "bg-yellow-50" : getRowColor(request.status))}
                    key={request.id}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRequests.includes(request.id || "")}
                        onCheckedChange={() => toggleRequestSelection(request.id || "")}
                        disabled={isEditing}
                      />
                    </TableCell>
                    {columnVisibility.identifier && (
                      <TableCell className="font-medium">
                        {renderEditableCell(request, "identifier", isEditing)}
                      </TableCell>
                    )}
                    {columnVisibility.poStatus && <TableCell>{renderEditableCell(request, "poStatus", isEditing)}</TableCell>}
                    {columnVisibility.poNumber && <TableCell>{renderEditableCell(request, "poNumber", isEditing)}</TableCell>}
                    {columnVisibility.paymentStatus && <TableCell>{renderEditableCell(request, "paymentStatus", isEditing)}</TableCell>}
                    {columnVisibility.description && <TableCell>{renderEditableCell(request, "description", isEditing)}</TableCell>}
                    {columnVisibility.status && <TableCell>{renderEditableCell(request, "status", isEditing)}</TableCell>}
                    {columnVisibility.tsiConfirm && <TableCell>{renderEditableCell(request, "tsiConfirm", isEditing)}</TableCell>}
                    {columnVisibility.companyOfOrder && <TableCell>{renderEditableCell(request, "companyOfOrder", isEditing)}</TableCell>}
                    {columnVisibility.countryOfOrder && <TableCell>{renderEditableCell(request, "countryOfOrder", isEditing)}</TableCell>}
                    {columnVisibility.storeLocation && <TableCell>{renderEditableCell(request, "storeLocation", isEditing)}</TableCell>}
                    {columnVisibility.wayBillNumber && <TableCell>{renderEditableCell(request, "wayBillNumber", isEditing)}</TableCell>}
                    <TableCell>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600"
                            onClick={() => handleSaveEdit(request.id || "")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleCancelEdit(request.id || "")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(request.id || "", request)}
                          className="h-8"
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
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
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
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
                          if (requestPagination.hasPreviousPage) handlePageChange(currentPage - 1)
                        }}
                        className={!requestPagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
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
                          if (requestPagination.hasNextPage) handlePageChange(currentPage + 1)
                        }}
                        className={!requestPagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="relative flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between border-b border-gray-100 p-4 pb-3">
                  <Badge variant="outline" className={getRequestTypeColor(defaultType)}>
                    {defaultType || "N/A"}
                  </Badge>
                  <Checkbox
                    checked={selectedRequests.includes(request.id || "")}
                    onCheckedChange={() => toggleRequestSelection(request.id || "")}
                  />
                </div>

                <div className="flex-1 p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {request.identifier}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {request.description || "No description"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Status:</span>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">PO Status:</span>
                      <Badge variant="outline" className={getPoStatusColor(request.poStatus)}>
                        {request.poStatus}
                      </Badge>
                    </div>

                    {request.tsiConfirm && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">TSI Confirm:</span>
                        <Badge variant="outline" className={getTSIConfirmColor(request.tsiConfirm)}>
                          {request.tsiConfirm}
                        </Badge>
                      </div>
                    )}

                    {request.paymentStatus && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Payment Status:</span>
                        <Badge variant="outline" className={getPaymentStatusColor(request.paymentStatus)}>
                          {request.paymentStatus}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {(request.poNumber || request.companyOfOrder || request.storeLocation || request.wayBillNumber) && (
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      {request.poNumber && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-gray-500 flex-shrink-0">PO Number:</span>
                          <span className="text-xs text-gray-700 text-right break-all">{request.poNumber}</span>
                        </div>
                      )}
                      {request.companyOfOrder && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-gray-500 flex-shrink-0">Company:</span>
                          <span className="text-xs text-gray-700 text-right break-all">{request.companyOfOrder}</span>
                        </div>
                      )}
                      {request.storeLocation && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-gray-500 flex-shrink-0">Store Location:</span>
                          <span className="text-xs text-gray-700 text-right break-all">{request.storeLocation}</span>
                        </div>
                      )}
                      {request.wayBillNumber && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-gray-500 flex-shrink-0">Way Bill No.:</span>
                          <span className="text-xs text-gray-700 text-right break-all">{request.wayBillNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-100 p-3">
                  <Button
                    onClick={() => {
                      setSelectedRequest(request),
                      setOpenEditRequestDialog(true)
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-4 px-4 py-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {endIndex} of {totalCount} entries
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Items per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
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
                          if (requestPagination.hasPreviousPage) handlePageChange(currentPage - 1)
                        }}
                        className={!requestPagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
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
                          if (requestPagination.hasNextPage) handlePageChange(currentPage + 1)
                        }}
                        className={!requestPagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
