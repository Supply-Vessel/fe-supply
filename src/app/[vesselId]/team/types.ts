import type { ActivityLevel, RecordType } from "../requests/types";
import type { AccessStatus, Role } from "../../account/types";

export interface VesselMembersTypes {
    id: string;
    userId: string;
    vesselId: string;
    role: Role;
    joinedAt: string;
    invitedBy: string | null;
    accessStatus: AccessStatus;
    accessStartDate: string;
    accessEndDate: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        address: string | null;
        contactPhone: string | null;
        institution: string | null;
        confirmedEmail: boolean;
        firstName: string | null;
        lastName: string | null;
        createdAt: string;
        updatedAt: string;
    };
};

export interface NewMemberTypes {
    email: string;
    role: string;
}

export interface VesselMembersResponse {
    success: boolean;
    data: VesselMembersTypes[];
    message: string;
}

export interface RequestEnums {
    activityLevel: ActivityLevel[];
    accessStatus: AccessStatus[]
    recordType: RecordType[];
    role: Role[];
}
