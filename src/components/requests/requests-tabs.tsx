"use client"

import type { Request, RequestEnums, RequestPagination } from "@/src/components/requests/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { RequestsList } from "@/src/components/requests/requests-list"
import { RequestType } from "@/src/components/requests/types"
import { EditAnimalDialog } from "./edit-request-dialog"
import { AddAnimalDialog } from "./add-request-dialog"
import { useState } from "react"

interface RequestsTabsProps {
  handleUpdateDataPagination: (data: { page?: number; pageSize?: number; defaultType: RequestType }) => Promise<void>;
  handleSaveRequest: (request: Partial<Request>) => Promise<void>;
  handleAddRequest: (request: Partial<Request>) => Promise<void>;
  setElectricPagination: (pagination: RequestPagination) => void;
  setEnginePagination: (pagination: RequestPagination) => void;
  setDeckPagination: (pagination: RequestPagination) => void;
  electricPagination: RequestPagination
  enginePagination: RequestPagination
  deckPagination: RequestPagination
  requestEnums: RequestEnums
  electricData: Request[]
  engineData: Request[]
  deckData: Request[]
  vesselId: string
  userId: string
}

export function RequestsTabs(props: RequestsTabsProps) {
  const {handleUpdateDataPagination, handleSaveRequest, handleAddRequest, setElectricPagination, setEnginePagination, setDeckPagination} = props;
  const {requestEnums, userId,vesselId, enginePagination, electricPagination, deckPagination, engineData, electricData, deckData} = props;

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [openEditRequestDialog, setOpenEditRequestDialog] = useState(false)
  const [openAddRequestDialog, setOpenAddRequestDialog] = useState(false)

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
          vesselId={vesselId}
          userId={userId}
      />
    </Tabs>
  )
}

