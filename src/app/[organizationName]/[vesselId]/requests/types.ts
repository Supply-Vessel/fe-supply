import type {
  Request,
  RequestPagination,
  RequestFilters,
  RequestEnums,
  RequestTypeModel,
  Vessel,
  CreateRequestData,
  UpdateRequestData,
} from "@/src/components/requests/types";
import { ActivityLevel, RecordType } from "@prisma/client";

export interface RequestsPageData {
  requestPagination: RequestPagination;
  requestTypes: RequestTypeModel[];
  requestEnums: RequestEnums;
  requests: Request[];
  vesselId: string;
  vessel?: Vessel;
  userId: string;
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
  RequestTypeModel,
  Vessel,
  CreateRequestData,
  UpdateRequestData,
};

export { ActivityLevel, RecordType };
