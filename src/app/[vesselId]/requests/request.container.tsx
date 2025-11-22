"use client";

import { Request, RequestPagination, RequestEnums, RequestType } from "@/src/components/requests/types";
import { AnimalsHeader } from "@/src/components/requests/animals-header";
import { RequestsTabs } from "@/src/components/requests/requests-tabs";
import { useCallback, useState } from "react";
import { apiClient } from "@/src/lib/apiClient";
import { toast } from "sonner";

interface RequestPropsType {
    electricalRequestsPagination: RequestPagination;
    engineRequestsPagination: RequestPagination;
    deckRequestsPagination: RequestPagination;
    electricalRequests: Request[];
    requestEnums: RequestEnums;
    engineRequests: Request[];
    deckRequests: Request[];
    vesselId: string;
    userId: string;
}

const RequestsContainer = (props: RequestPropsType) => {
    const {engineRequests, electricalRequests, deckRequests, requestEnums, userId,vesselId, engineRequestsPagination, electricalRequestsPagination, deckRequestsPagination} = props;
    const [electricPagination, setElectricPagination] = useState<RequestPagination>(electricalRequestsPagination)
    const [enginePagination, setEnginePagination] = useState<RequestPagination>(engineRequestsPagination)
    const [deckPagination, setDeckPagination] = useState<RequestPagination>(deckRequestsPagination)
    const [electricData, setElectricData] = useState<Request[]>(electricalRequests)
    const [engineData, setEngineData] = useState<Request[]>(engineRequests)
    const [deckData, setDeckData] = useState<Request[]>(deckRequests)

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number, defaultType: RequestType}) => {
        try {
          switch (data.defaultType) {
            case RequestType.ENGINE:
              const engineResponse = await apiClient.get(
                `/api/requests/${userId}/${vesselId}/${data.pageSize || enginePagination.pageSize}/${data.page || enginePagination.currentPage}/${data.defaultType}`
              )
              setEnginePagination(engineResponse.pagination)
              setEngineData(engineResponse.data)
              break;
            case RequestType.ELECTRICAL:
              const electricalResponse = await apiClient.get(
                `/api/requests/${userId}/${vesselId}/${data.pageSize || electricPagination.pageSize}/${data.page || electricPagination.currentPage}/${data.defaultType}`
              )
              setElectricPagination(electricalResponse.pagination)
              setElectricData(electricalResponse.data)
              break;
            case RequestType.DECK:
              const deckResponse = await apiClient.get(
                `/api/requests/${userId}/${vesselId}/${data.pageSize || deckPagination.pageSize}/${data.page || deckPagination.currentPage}/${data.defaultType}`
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
      }, [userId, vesselId, enginePagination, electricPagination, deckPagination]);
    
      const handleSaveRequest = useCallback(async (request: Partial<Request>) => {
        try {
          const response = await apiClient.put(`/api/requests`, {
            ...request,
            userId,
            vesselId: vesselId,
          })
          toast(response.message || response.error, {
            description: `${request.identifier}`
          })
          if(response.success && response.data) {
            switch (request.requestType) {
              case RequestType.ENGINE:
                setEngineData((prev) => {
                  const index = prev.findIndex((r) => r.id === request.id)
                  if (index !== -1) {
                    const newData = [...prev]
                    newData[index] = {...response.data as Request}
                    return newData
                  } else {
                    return [response.data as Request, ...prev]
                  }
                })
                break;
              case RequestType.ELECTRICAL:
                setElectricData((prev) => {
                  const index = prev.findIndex((r) => r.id === request.id)
                  if (index !== -1) {
                    const newData = [...prev]
                    newData[index] = {...response.data as Request}
                    return newData
                  } else {
                    return [response.data as Request, ...prev]
                  }
                })
                break;
              case RequestType.DECK:
                setDeckData((prev) => {
                  const index = prev.findIndex((r) => r.id === request.id)
                  if (index !== -1) {
                    const newData = [...prev]
                    newData[index] = {...response.data as Request}
                    return newData
                  } else {
                    return [response.data as Request, ...prev]
                  }
                })
                break;
            }
          }
        } catch (error) {
          console.error("Error updating request:", error)
          toast.error("Failed to update request")
        }
      }, [userId, vesselId]);
    
      const handleAddRequest = useCallback(async (request: Partial<Request>) => {
        try {
          const response = await apiClient.post(`/api/requests`, {
            ...request,
            userId,
            vesselId: vesselId,
          })
          toast(response.message || response.error, {
            description: `${request.identifier}`
          })
          if(response.success && response.data) {
            switch (request.requestType) {
              case RequestType.ENGINE:
                setEngineData((prev) => [response.data as Request, ...prev])
                break;
              case RequestType.ELECTRICAL:
                setElectricData((prev) => [response.data as Request, ...prev])
                break;
              case RequestType.DECK:
                setDeckData((prev) => [response.data as Request, ...prev])
                break;
            }
          }
        } catch (error) {
          console.error("Error adding request:", error)
          toast.error("Failed to add request")
        }
      }, [userId, vesselId]);

    return (
        <div className="space-y-6">
            <AnimalsHeader
            />
            <RequestsTabs
                handleUpdateDataPagination={handleUpdateDataPagination}
                setElectricPagination={setElectricPagination}
                setEnginePagination={setEnginePagination}
                electricPagination={electricPagination}
                setDeckPagination={setDeckPagination}
                handleSaveRequest={handleSaveRequest}
                enginePagination={enginePagination}
                handleAddRequest={handleAddRequest}
                deckPagination={deckPagination}
                electricData={electricData}
                requestEnums={requestEnums}
                engineData={engineData}
                deckData={deckData}
                vesselId={vesselId}
                userId={userId}
            />
        </div>
    )
}

export default RequestsContainer;