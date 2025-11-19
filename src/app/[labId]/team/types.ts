import type { AccessStatus, AnimalStatus, Role, Sex } from "../../account/types";
import type { ActivityLevel, RecordType } from "../requests/types";

export interface InitialMembersTypes {
    id: string;
    userId: string;
    laboratoryId: string;
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

export interface LaboratoryMembersResponse {
    success: boolean;
    data: InitialMembersTypes[];
    message: string;
}

export interface AnimalEnums {
    activityLevel: ActivityLevel[];
    accessStatus: AccessStatus[]
    recordType: RecordType[];
    status: AnimalStatus[];
    role: Role[];
    sex: Sex[];
}
