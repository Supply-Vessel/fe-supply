import type { AccessStatus, Role, UserType } from "../../../account/types";
import type { ActivityLevel, RecordType } from "../requests/types";

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
        userType: UserType;
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
    orgRole: string; // Role in organization (ADMIN, MANAGER, MEMBER)
}

export type InitialMembersTypes = VesselMembersTypes;

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
