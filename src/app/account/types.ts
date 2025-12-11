import { Role, AccessStatus, ExperimentStatus, RequestStatus, UserType, OrgRole, MemberStatus } from "@prisma/client"
import type { SetStateAction } from "react"

// Re-export Prisma enums for convenience
export { Role, AccessStatus, ExperimentStatus, RequestStatus, UserType, OrgRole, MemberStatus }

// Organization types
export interface OrganizationOwner {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
}

export interface OrganizationStats {
    membersCount: number;
    vesselsCount: number;
}

export interface OrganizationSubscription {
    id: string;
    planName: string;
    status: string;
    maxUsers: number;
    maxVessels: number | null;
    endDate: Date;
}

export interface Organization {
    id: string;
    name: string;
    description: string | null;
    type: string;
    isOwner: boolean;
    memberRole: OrgRole;
    memberStatus: MemberStatus;
    joinedAt: Date;
    owner: OrganizationOwner;
    stats: OrganizationStats;
    subscription: OrganizationSubscription | null;
}

// Vessel types
export interface Vessel {
    id: string
    createdAt: Date
    updatedAt: Date | null
    joinedAt: Date
    accessStartDate: Date
    accessEndDate: Date | null
    accessStatus: AccessStatus
    name: string
    username: string
    position: Role
    description: string | null
    userRole: Role
    organizationId: string
    organizationName: string
}

// User types
export interface UserInfo {
    userId: string
    confirmedEmail: boolean
    institution: string | null
    contactPhone: string | null
    createdAt: Date
    firstName: string | null
    lastName: string | null
    address: string | null
    email: string
    userType?: UserType
}

// API response type
export interface AccountData {
    userType: UserType;
    organizations: Organization[];
    vessels: Vessel[];
}

// Container props
export interface VesselsContainerProps {
    accountData: AccountData;
}

// Invite form data
export interface InviteMemberForm {
    email: string;
    organizationId: string;
    orgRole: string;
}

// View props
export interface VesselsViewProps {
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    handleVesselClick: (organizationName: string, vesselName: string) => void;
    handleInviteMember: (formData: InviteMemberForm) => Promise<void>;
    formatDate: (date: Date | string) => string;
    handleCreateVessel: VoidFunction;
    filteredVessels: Vessel[];
    userInfo: UserInfo | null;
    isLoading: boolean;
    searchTerm: string;
    // Organization support
    organizations: Organization[];
    userType: UserType | null;
    canCreateVessel: boolean;
    canInviteMembers: boolean;
    isInviteDialogOpen: boolean;
    setIsInviteDialogOpen: (isOpen: boolean) => void;
    inviteForm: InviteMemberForm;
    setInviteForm: (form: InviteMemberForm) => void;
    isInviting: boolean;
    handleInviteSubmit: () => void;
    handleLogout: () => void;
}

export interface PageProps {
    params: {
        userId: string;
    }
}
