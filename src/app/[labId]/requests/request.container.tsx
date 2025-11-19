"use client";

import type { FiltersType, Request, RequestPagination, RequestEnums } from "@/src/components/requests/types";
import { AnimalsHeader } from "@/src/components/requests/animals-header";
import { RequestsTabs } from "@/src/components/requests/requests-tabs";
import type { AnimalPagination } from "./types";
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useState } from "react";

interface RequestPropsType {
    electricalRequestsPagination: RequestPagination;
    engineRequestsPagination: RequestPagination;
    deckRequestsPagination: RequestPagination;
    electricalRequests: Request[];
    requestEnums: RequestEnums;
    engineRequests: Request[];
    deckRequests: Request[];
    userId: string;
    labId: string;
}

const RequestsContainer = (props: RequestPropsType) => {
    const {engineRequests, electricalRequests, deckRequests, requestEnums, userId, labId, engineRequestsPagination, electricalRequestsPagination, deckRequestsPagination} = props;
    const [electricalPagination, setElectricalPagination] = useState<AnimalPagination>(electricalRequestsPagination)
    const [enginePagination, setEnginePagination] = useState<AnimalPagination>(engineRequestsPagination)
    const [electricalRequestsData, setElectricalRequestsData] = useState<Request[]>(electricalRequests)
    const [deckPagination, setDeckPagination] = useState<AnimalPagination>(deckRequestsPagination)
    const [engineRequestsData, setEngineRequestsData] = useState<Request[]>(engineRequests)
    const [deckRequestsData, setDeckRequestsData] = useState<Request[]>(deckRequests)
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
    const [animalSearch, setAnimalSearch] = useState<string>("")
    const [filters, setFilters] = useState<FiltersType>({})

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number, filters?: any}) => {
        const response = await apiClient.get(`/api/requests/${userId}/${labId}/${data.pageSize || enginePagination.pageSize}/${data.page || enginePagination.currentPage}/${JSON.stringify(data.filters) || JSON.stringify(filters)}`)
        setEnginePagination(response.pagination)
        setEngineRequestsData(response.data)
    }, [userId, labId, enginePagination, filters])

    const handleSearch = useCallback((search: string) => {
        setAnimalSearch(search)

        const filteredEngineRequests = engineRequests.filter((request: Request) => {
            return request.identifier.toLowerCase().includes(search.toLowerCase())
            || request.description?.toLowerCase().includes(search.toLowerCase())
            || request.status?.toLowerCase().includes(search.toLowerCase())
            || request.requestType?.toLowerCase().includes(search.toLowerCase())
            || request.vessel?.name?.toLowerCase().includes(search.toLowerCase())
        })

        setEngineRequestsData(filteredEngineRequests)
    }, [engineRequests])

    return (
        <div className="space-y-6">
            <AnimalsHeader
                handleSearch={handleSearch}
                animalSearch={animalSearch}
            />
            <RequestsTabs
                electricalRequestsPagination={electricalPagination}
                electricalRequests={electricalRequestsData}
                engineRequestsPagination={enginePagination}
                deckRequestsPagination={deckPagination}
                engineRequests={engineRequestsData}
                deckRequests={deckRequestsData}
                requestEnums={requestEnums}
                userId={userId}
                labId={labId}
            />
        </div>
    )
}

export default RequestsContainer;