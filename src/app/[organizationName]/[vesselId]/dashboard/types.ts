import type { PaymentStatus, PoStatus, TSIConfirm, RequestTypeModel } from "@/src/components/requests/types";
import type { ExperimentStatus, RequestStatus } from "../../../account/types";

export interface PageProps {
    params: {
        userId: string;
        vesselId: string;
    }
}

export interface Request {
    id: string;
    tsiConfirm?: TSIConfirm;
    identifier: string;
    poStatus: PoStatus;
    poNumber?: string;
    paymentStatus?: PaymentStatus;
    description?: string;
    status: RequestStatus;
    offerNumber?: string;
    companyOfOrder?: string;
    countryOfOrder?: string;
    requestType?: RequestTypeModel;
    requestTypeId: string;
    vesselId: string;
    createdAt: string;
    updatedAt: string;
}
export interface Experiment {
    status?: ExperimentStatus;
    laboratoryId: string;
    description: string;
    createdById: string;
    protocol?: string;
    startDate: string;
    endDate?: string;
    title: string;
}

export interface Task {
    laboratoryId: string;
    assignedToId: string;
    experimentId: string;
    description: string;
    dueDate: string;
    title: string;
    id: string;
}

export interface DashboardContainerProps {
    requests: Request[];
    previousMonthData?: {
        requests: number;
    };
}
