// UserType enum for frontend use (mirrors Prisma enum)
export enum UserType {
    ORGANIZATION_OWNER = "ORGANIZATION_OWNER",
    REGULAR = "REGULAR",
}

// Form data types
export interface OwnerFormData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    institution: string;
    contactPhone: string;
    password: string;
    confirmPassword: string;
    organizationName: string;
    agreeToTerms: boolean;
}

export interface RegularFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    invitationCode: string;
    agreeToTerms: boolean;
}

// API submit data types
export interface OwnerSubmitData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    institution: string;
    contactPhone: string;
    password: string;
    organizationName: string;
    userType: UserType.ORGANIZATION_OWNER;
}

export interface RegularSubmitData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    invitationCode: string;
    userType: UserType.REGULAR;
}

// API response types
export interface UserResponse {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    institution?: string | null;
    address?: string | null;
    contactPhone?: string | null;
    confirmedEmail: boolean;
    userType: string;
    createdAt: Date;
    organization?: {
        id: string;
        name: string;
    } | null;
}
