import type { SetStateAction } from "react"

export enum Role {
    HEAD_OF_DEPARTMENT = "HEAD_OF_DEPARTMENT",
    SAFETY_SPECIALIST = "SAFETY_SPECIALIST",
    VESSEL_MANAGER = "VESSEL_MANAGER",
    TEAM_LEADER = "TEAM_LEADER",
    SUPPLIER = "SUPPLIER",
    DIRECTOR = "DIRECTOR",
    COUNTER = "COUNTER",
    GUEST = "GUEST",
    TSI = "TSI",
}

export enum AccessStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED",
    PENDING = "PENDING"
  }

export enum ExperimentStatus {
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
}

export enum RequestStatus {
    WAITING = "WAITING",
    ORDERED = "ORDERED",
    RECEIVED = "RECEIVED",
    ON_HOLD = "ON_HOLD",
    CANCELLED = "CANCELLED",
}

export enum Sex {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNKNOWN = "UNKNOWN"
}
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
    position: string
    description: string | null
    userRole: Role
}

export interface AnimalType {
    id: string
    name: string
    laboratoryId: string
    description: string | null
    createdAt: Date
    updatedAt: Date
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

export interface LaboratoriesViewProps {
    getInitials: (firstName: string, lastName: string) => string;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
    formatDate: (date: Date | string) => string
    filteredLaboratories: Vessel[] | [];
    handleLabClick: (labId: string) => void;
    handleCreateLab: VoidFunction;
    handleJoinLab: VoidFunction;
    userInfo: UserInfo | null;
    isLoading: boolean;
    searchTerm: string;
}

export interface PageProps {
    params: {
        userId: string;
    }
}
