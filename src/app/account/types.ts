import { Role, AccessStatus, ExperimentStatus, RequestStatus } from "@prisma/client"
import type { SetStateAction } from "react"

// Re-export Prisma enums for convenience
export { Role, AccessStatus, ExperimentStatus, RequestStatus }

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
}

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
}

export interface VesselsContainerProps {
    userVessels: Vessel[];
}

export interface VesselsViewProps {
    getInitials: (firstName: string, lastName: string) => string;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    formatDate: (date: Date | string) => string
    filteredVessels: Vessel[] | [];
    handleVesselClick: (vesselId: string) => void;
    handleCreateVessel: VoidFunction;
    handleJoinVessel: VoidFunction;
    userInfo: UserInfo | null;
    isLoading: boolean;
    searchTerm: string;
}

export interface PageProps {
    params: {
        userId: string;
    }
}
