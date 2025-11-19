"use client"

import type { Request, RequestEnums, RequestPagination } from "@/src/components/requests/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import type { AnimalPagination } from "@/src/app/[labId]/requests/types"
import { RequestsList } from "@/src/components/requests/requests-list"
import { RequestType } from "@/src/components/requests/types"
import { EditAnimalDialog } from "./edit-animal-dialog"
import { AddAnimalDialog } from "./add-animal-dialog"
import { apiClient } from "@/src/lib/apiClient"
import { useState, useCallback } from "react"
import { toast } from "sonner"

interface RequestsTabsProps {
  electricalRequestsPagination: RequestPagination
  engineRequestsPagination: RequestPagination
  deckRequestsPagination: RequestPagination
  electricalRequests: Request[]
  requestEnums: RequestEnums
  engineRequests: Request[]
  deckRequests: Request[]
  userId: string
  labId: string
}

export function RequestsTabs(props: RequestsTabsProps) {
  // Состояние для каждой вкладки
  const {engineRequests, electricalRequests, deckRequests, requestEnums, userId, labId, engineRequestsPagination, electricalRequestsPagination, deckRequestsPagination} = props;
  const [electricPagination, setElectricPagination] = useState<AnimalPagination>(electricalRequestsPagination)
  const [enginePagination, setEnginePagination] = useState<AnimalPagination>(engineRequestsPagination)
  const [deckPagination, setDeckPagination] = useState<AnimalPagination>(deckRequestsPagination)
  const [electricData, setElectricData] = useState<Request[]>(electricalRequests)
  const [engineData, setEngineData] = useState<Request[]>(engineRequests)
  const [deckData, setDeckData] = useState<Request[]>(deckRequests)

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [openEditRequestDialog, setOpenEditRequestDialog] = useState(false)
  const [openAddRequestDialog, setOpenAddRequestDialog] = useState(false)


  // Функции для обновления данных каждой вкладки
  const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number, defaultType: RequestType}) => {
    try {
      switch (data.defaultType) {
        case RequestType.ENGINE:
          const engineResponse = await apiClient.get(
            `/api/requests/${userId}/${labId}/${data.pageSize || enginePagination.pageSize}/${data.page || enginePagination.currentPage}/${data.defaultType}`
          )
          setEnginePagination(engineResponse.pagination)
          setEngineData(engineResponse.data)
          break;
        case RequestType.ELECTRICAL:
          const electricalResponse = await apiClient.get(
            `/api/requests/${userId}/${labId}/${data.pageSize || electricPagination.pageSize}/${data.page || electricPagination.currentPage}/${data.defaultType}`
          )
          setElectricPagination(electricalResponse.pagination)
          setElectricData(electricalResponse.data)
          break;
        case RequestType.DECK:
          const deckResponse = await apiClient.get(
            `/api/requests/${userId}/${labId}/${data.pageSize || deckPagination.pageSize}/${data.page || deckPagination.currentPage}/${data.defaultType}`
          )
          setDeckPagination(deckResponse.pagination)
          setDeckData(deckResponse.data)
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [userId, labId, enginePagination, electricPagination, deckPagination]);

  // Функции сохранения и добавления для Engine
  const handleSaveRequest = async (request: Partial<Request>) => {
    try {
      const response = await apiClient.put(`/api/requests`, {
        ...request,
        userId,
        vesselId: labId,
      })
      toast(response.message || response.error, {
        description: `${request.identifier}`
      })
      if(response.success && response.data) {
        let updatedRequests: Request[] = []
        switch (request.requestType) {
          case RequestType.ENGINE:
            updatedRequests = engineData.filter((r) => r.id !== request.id)
            setEngineData([...updatedRequests, response.data as Request])
            break;
          case RequestType.ELECTRICAL:
            updatedRequests = electricData.filter((r) => r.id !== request.id)
            setElectricData([...updatedRequests, response.data as Request])
            break;
          case RequestType.DECK:
            updatedRequests = deckData.filter((r) => r.id !== request.id)
            setDeckData([...updatedRequests, response.data as Request])
            break;
        }
      }
    } catch (error) {
      console.error("Error updating engine request:", error)
      toast.error("Failed to update request")
    }
  };

  const handleAddRequest = async (request: Partial<Request>) => {
    try {
      const response = await apiClient.post(`/api/requests`, {
        ...request,
        userId,
        vesselId: labId,
      })
      toast(response.message || response.error, {
        description: `${request.identifier}`
      })
      if(response.success && response.data) {
        switch (request.requestType) {
          case RequestType.ENGINE:
            setEngineData((prev) => [...prev, response.data as Request])
            break;
          case RequestType.ELECTRICAL:
            setElectricData((prev) => [...prev, response.data as Request])
            break;
          case RequestType.DECK:
            setDeckData((prev) => [...prev, response.data as Request])
            break;
        }
      }
    } catch (error) {
      console.error("Error adding engine request:", error)
      toast.error("Failed to add request")
    }
  }

  return (
    <Tabs defaultValue="engine" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="engine">Engine</TabsTrigger>
        <TabsTrigger value="electric">Electrical</TabsTrigger>
        <TabsTrigger value="deck">Deck</TabsTrigger>
      </TabsList>

      <TabsContent value="engine" className="mt-6">
        <RequestsList
          handleUpdateDataPagination={handleUpdateDataPagination}
          setOpenEditRequestDialog={setOpenEditRequestDialog}
          setOpenAddRequestDialog={setOpenAddRequestDialog}
          setSelectedRequest={setSelectedRequest}
          setPagination={setEnginePagination}
          requestPagination={enginePagination}
          defaultType={RequestType.ENGINE}
          requestEnums={requestEnums}
          onSave={handleSaveRequest}
          onAdd={handleAddRequest}
          requests={engineData}
        />
      </TabsContent>

      <TabsContent value="electric" className="mt-6">
        <RequestsList
          handleUpdateDataPagination={handleUpdateDataPagination}
          setOpenEditRequestDialog={setOpenEditRequestDialog}
          setOpenAddRequestDialog={setOpenAddRequestDialog}
          setSelectedRequest={setSelectedRequest}
          setPagination={setElectricPagination}
          requestPagination={electricPagination}
          defaultType={RequestType.ELECTRICAL}
          requestEnums={requestEnums}
          onSave={handleSaveRequest}
          onAdd={handleAddRequest}
          requests={electricData}
        />
      </TabsContent>

      <TabsContent value="deck" className="mt-6">
        <RequestsList
          handleUpdateDataPagination={handleUpdateDataPagination}
          setOpenEditRequestDialog={setOpenEditRequestDialog}
          setOpenAddRequestDialog={setOpenAddRequestDialog}
          setSelectedRequest={setSelectedRequest}
          setPagination={setDeckPagination}
          requestPagination={deckPagination}
          defaultType={RequestType.DECK}
          requestEnums={requestEnums}
          onSave={handleSaveRequest}
          onAdd={handleAddRequest}
          requests={deckData}
        />
      </TabsContent>

      <AddAnimalDialog
          loadingButtonText={"Adding Request"}
          setOpen={setOpenAddRequestDialog}
          submitButtonText={"Add Request"}
          onSubmit={handleAddRequest}
          requestEnums={requestEnums}
          open={openAddRequestDialog}
          userId={userId}
      />

      <EditAnimalDialog
          loadingButtonText={"Editing Request"}
          setOpen={setOpenEditRequestDialog}
          selectedRequest={selectedRequest}
          submitButtonText={"Edit Request"}
          onSubmit={handleSaveRequest}
          open={openEditRequestDialog}
          requestEnums={requestEnums}
          userId={userId}
          labId={labId}
      />
    </Tabs>
  )
}

