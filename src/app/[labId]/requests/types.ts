import type {
  Request,
  RequestPagination,
  RequestFilters,
  RequestEnums,
  RequestType,
  RequestTypeModel,
  Vessel,
  CreateRequestData,
  UpdateRequestData,
} from "@/src/components/requests/types";

export interface PageProps {
  params: {
    userId: string;
    labId: string;
  };
}

export interface RequestsPageData {
  requestPagination: RequestPagination;
  requestTypes: RequestTypeModel[];
  requestEnums: RequestEnums;
  requests: Request[];
  userId: string;
  labId: string;
  vessel?: Vessel;
}

export interface NewRequestType {
  name: string;
  description?: string;
}

export interface NewRequest extends CreateRequestData {
  id?: string;
  userId: string;
  newRequestType?: NewRequestType;
}

// Re-export common types for convenience
export type {
  Request,
  RequestPagination,
  RequestFilters,
  RequestEnums,
  RequestType,
  RequestTypeModel,
  Vessel,
  CreateRequestData,
  UpdateRequestData,
};

export type AnimalPagination = RequestPagination;
