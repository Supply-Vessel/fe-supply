"use client";

import { Request, RequestPagination, RequestEnums, RequestTypeModel } from "@/src/components/requests/types";
import { RequestsHeader } from "@/src/components/requests/requests-header";
import { RequestsTabs } from "@/src/components/requests/requests-tabs";
import { OrgRole, UserType } from "@prisma/client"; 
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface RequestPropsType {
    requestTypes: RequestTypeModel[];
    requestEnums: RequestEnums;
    userOrgRole: OrgRole;
    userType: UserType;
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

const RequestsContainer = (props: RequestPropsType) => {
    const { requestTypes: initialRequestTypes, requestEnums, userId, vesselId, userType, userOrgRole } = props;
    
    // Store request types
    const [requestTypes, setRequestTypes] = useState<RequestTypeModel[]>(initialRequestTypes);
    
    // Store data and pagination for each request type dynamically by typeId
    const [requestsData, setRequestsData] = useState<Record<string, Request[]>>({});
    const [paginationData, setPaginationData] = useState<Record<string, RequestPagination>>({});
    const [isLoading, setIsLoading] = useState(false);

    const canInviteMembers = useMemo(() => {
        if (userType === 'ORGANIZATION_OWNER') return true;
        
        return userOrgRole === 'ADMIN' || userOrgRole === 'MANAGER';
      }, [userType, userOrgRole]);

    // Fetch requests for a specific type
    const handleFetchRequests = useCallback(async (
        typeId: string, 
        page: number = 1, 
        pageSize: number = 10
    ) => {
        try {
            const type = requestTypes.find(t => t.id === typeId);
            if (!type) return;
            
            const response = await apiClient.get(
                `/api/requests/${userId}/${vesselId}/${pageSize}/${page}/${type.name}`
            );
            
            setRequestsData(prev => ({
                ...prev,
                [typeId]: response.data || []
            }));
            
            setPaginationData(prev => ({
                ...prev,
                [typeId]: response.pagination || defaultPagination
            }));
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }, [userId, vesselId, requestTypes]);

    // Update pagination for a specific type
    const handleUpdateDataPagination = useCallback(async (data: {
        page?: number;
        pageSize?: number;
        requestTypeId: string;
    }) => {
        const currentPagination = paginationData[data.requestTypeId] || defaultPagination;
        await handleFetchRequests(
            data.requestTypeId,
            data.page || currentPagination.currentPage,
            data.pageSize || currentPagination.pageSize
        );
    }, [handleFetchRequests, paginationData]);

    // Save/update a request
    const handleSaveRequest = useCallback(async (request: Partial<Request>) => {
        try {
            const response = await apiClient.put(`/api/requests`, {
                ...request,
                userId,
                vesselId: vesselId,
            });
            
            toast(response.message || response.error, {
                description: `${request.identifier}`
            });
            
            if (response.success && response.data && request.requestTypeId) {
                setRequestsData(prev => {
                    const typeData = prev[request.requestTypeId!] || [];
                    const index = typeData.findIndex((r) => r.id === request.id);
                    if (index !== -1) {
                        const newData = [...typeData];
                        newData[index] = { ...response.data as Request };
                        return { ...prev, [request.requestTypeId!]: newData };
                    } else {
                        return { ...prev, [request.requestTypeId!]: [response.data as Request, ...typeData] };
                    }
                });
            }
        } catch (error) {
            console.error("Error updating request:", error);
            toast.error("Failed to update request");
        }
    }, [userId, vesselId]);

    // Add a new request
    const handleAddRequest = useCallback(async (request: Partial<Request>) => {
        try {
            const response = await apiClient.post(`/api/requests`, {
                ...request,
                userId,
                vesselId: vesselId,
            });
            
            toast(response.message || response.error, {
                description: `${request.identifier}`
            });
            
            if (response.success && response.data && request.requestTypeId) {
                setRequestsData(prev => ({
                    ...prev,
                    [request.requestTypeId!]: [response.data as Request, ...(prev[request.requestTypeId!] || [])]
                }));
            }
        } catch (error) {
            console.error("Error adding request:", error);
            toast.error("Failed to add request");
        }
    }, [userId, vesselId]);

    // Create a new request type
    const handleCreateRequestType = useCallback(async (data: {
        name: string;
        displayName: string;
        description?: string;
        color?: string;
    }) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post(`/api/request-types/${vesselId}`, data);
            
            if (response.success && response.data) {
                setRequestTypes(prev => [...prev, response.data as RequestTypeModel]);
                toast.success(response.message || "Request type created successfully");
            } else {
                toast.error(response.message || "Failed to create request type");
            }
        } catch (error) {
            console.error("Error creating request type:", error);
            toast.error("Failed to create request type");
        } finally {
            setIsLoading(false);
        }
    }, [vesselId]);

    return (
        <div className="space-y-6">
            <RequestsHeader 
                onCreateType={handleCreateRequestType}
                canInviteMembers={canInviteMembers}
                isLoading={isLoading}
            />
            <RequestsTabs
                handleUpdateDataPagination={handleUpdateDataPagination}
                handleFetchRequests={handleFetchRequests}
                handleSaveRequest={handleSaveRequest}
                handleAddRequest={handleAddRequest}
                canInviteMembers={canInviteMembers}
                paginationData={paginationData}
                requestTypes={requestTypes}
                requestsData={requestsData}
                requestEnums={requestEnums}
                vesselId={vesselId}
                userId={userId}
            />
        </div>
    );
};

export default RequestsContainer;
