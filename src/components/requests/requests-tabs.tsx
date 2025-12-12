"use client"

import type { Request, RequestEnums, RequestPagination, RequestTypeModel } from "@/src/components/requests/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { RequestsList } from "@/src/components/requests/requests-list"
import { EditAnimalDialog } from "./edit-request-dialog"
import { AddAnimalDialog } from "./add-request-dialog"
import { useEffect, useState } from "react"

interface RequestsTabsProps {
  handleUpdateDataPagination: (data: { page?: number; pageSize?: number; requestTypeId: string }) => Promise<void>;
  handleFetchRequests: (typeId: string, page?: number, pageSize?: number) => Promise<void>;
  handleSaveRequest: (request: Partial<Request>) => Promise<void>;
  handleAddRequest: (request: Partial<Request>) => Promise<void>;
  paginationData: Record<string, RequestPagination>;
  requestsData: Record<string, Request[]>;
  requestTypes: RequestTypeModel[];
  requestEnums: RequestEnums;
  canInviteMembers: boolean;
  vesselId: string;
  userId: string;
}

const defaultPagination: RequestPagination = {
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 1,
  totalCount: 0,
  totalPages: 1,
  pageSize: 10
};

export function RequestsTabs(props: RequestsTabsProps) {
  const {
    handleUpdateDataPagination,
    handleFetchRequests,
    handleSaveRequest,
    handleAddRequest,
    canInviteMembers,
    paginationData,
    requestTypes,
    requestsData,
    requestEnums,
    vesselId,
    userId,
  } = props;

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [openEditRequestDialog, setOpenEditRequestDialog] = useState(false);
  const [openAddRequestDialog, setOpenAddRequestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  // Set initial active tab when request types are loaded
  useEffect(() => {
    if (requestTypes.length > 0 && !activeTab) {
      setActiveTab(requestTypes[0].id);
    }
  }, [requestTypes, activeTab]);

  // Fetch data when tab becomes active for the first time
  useEffect(() => {
    if (activeTab && !loadedTabs.has(activeTab)) {
      handleFetchRequests(activeTab);
      setLoadedTabs(prev => new Set([...prev, activeTab]));
    }
  }, [activeTab, loadedTabs, handleFetchRequests]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (requestTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">No request types created yet.</p>
        <p className="text-sm text-muted-foreground">
          Click &quot;Add Request Type&quot; button above to create your first request type.
        </p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1 justify-between">
        {requestTypes.map((type) => (
          <TabsTrigger
            key={type.id}
            value={type.id}
            className="flex items-center gap-2 flex-1 justify-center"
          >
            {type.color && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: type.color }}
              />
            )}
            {type.displayName}
          </TabsTrigger>
        ))}
      </TabsList>

      {requestTypes.map((type) => (
        <TabsContent key={type.id} value={type.id} className="mt-6">
          <RequestsList
            handleUpdateDataPagination={(data) => 
              handleUpdateDataPagination({ ...data, requestTypeId: type.id })
            }
            requestPagination={paginationData[type.id] || defaultPagination}
            setOpenEditRequestDialog={setOpenEditRequestDialog}
            setOpenAddRequestDialog={setOpenAddRequestDialog}
            setSelectedRequest={setSelectedRequest}
            requests={requestsData[type.id] || []}
            canInviteMembers={canInviteMembers}
            setPagination={() => {}}
            requestEnums={requestEnums}
            onSave={handleSaveRequest}
            onAdd={handleAddRequest}
            defaultTypeId={type.id}
            defaultType={type}
          />
        </TabsContent>
      ))}

      <AddAnimalDialog
        loadingButtonText={"Adding Request"}
        setOpen={setOpenAddRequestDialog}
        submitButtonText={"Add Request"}
        onSubmit={handleAddRequest}
        requestEnums={requestEnums}
        open={openAddRequestDialog}
        requestTypes={requestTypes}
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
        requestTypes={requestTypes}
        vesselId={vesselId}
        userId={userId}
      />
    </Tabs>
  );
}
