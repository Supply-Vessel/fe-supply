"use client"

import type { VesselsContainerProps, Vessel, UserInfo, Organization, UserType } from "./types"
import { useState, useEffect, useCallback, useMemo } from "react"
import { apiClient } from "@/src/lib/apiClient"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import VesselsView from "./vessels.view"
import { toast } from "sonner"

interface InviteMemberForm {
    organizationId: string;
    orgRole: string;
    email: string;
}

export default function VesselsContainer({ accountData }: VesselsContainerProps) {
    const [organizations, setOrganizations] = useState<Organization[]>(accountData?.organizations || [])
    const [userType, setUserType] = useState<UserType | null>(accountData?.userType || null)
    const [vessels, setVessels] = useState<Vessel[]>(accountData?.vessels || [])
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState<InviteMemberForm>({
        email: "",
        organizationId: organizations.length === 1 ? organizations[0].id : "",
        orgRole: "MEMBER",
    });
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isInviting, setIsInviting] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const user = await AuthService.getCurrentUser();
            setUserInfo(user);
            setIsLoading(false);
        }

        fetchData()
    }, [])

    const handleInviteSubmit = async () => {
        if (!inviteForm.email || !inviteForm.organizationId) return;
        
        setIsInviting(true);
        try {
            await handleInviteMember(inviteForm);
            setIsInviteDialogOpen(false);
            setInviteForm({
                email: "",
                organizationId: organizations.length === 1 ? organizations[0].id : "",
                orgRole: "MEMBER",
            });
        } finally {
            setIsInviting(false);
        }
    };

    const handleLogout = () => {
        AuthService.logout();
    }

    // Проверяем права на создание кораблей
    const canCreateVessel = useMemo(() => {
        if (userType === 'ORGANIZATION_OWNER') return true;
        
        return organizations.some(org => 
            org.memberRole === 'ADMIN' || org.memberRole === 'MANAGER'
        );
    }, [userType, organizations]);

    // Проверяем права на приглашение пользователей
    const canInviteMembers = useMemo(() => {
        if (userType === 'ORGANIZATION_OWNER') return true;
        
        return organizations.some(org => 
            org.memberRole === 'ADMIN' || org.memberRole === 'MANAGER'
        );
    }, [userType, organizations]);

    const filteredVessels = useMemo(() => 
        vessels?.filter(
            (vessel) =>
            vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
        [vessels, searchTerm]
    );

    const formatDate = useCallback((date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }
        
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long", 
            day: "numeric",
        }).format(dateObj);
    }, []);

    const handleVesselClick = useCallback((organizationName: string, vesselName: string) => {
        router.push(`/${organizationName}/${vesselName}/dashboard`)
    }, [router]);

    const handleCreateVessel = useCallback(() => {
        router.push("/vessel-setup?tab=create")
    }, [router]);

    // Handle invite member to organization
    const handleInviteMember = useCallback(async (formData: InviteMemberForm) => {
        try {
            const user = await AuthService.getCurrentUser();
            
            const inviteData = {
                email: formData.email,
                organizationId: formData.organizationId,
                orgRole: formData.orgRole,
                invitedBy: user.userId,
                role: "SUPPLIER", // Default vessel role
            };

            const response = await apiClient.post("/api/invitation", inviteData);
            
            toast(response.success ? "Success" : "Error", {
                description: response.message || response.error
            });

            if (!response.success) {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Failed to send invitation:", error);
            throw error;
        }
    }, []);

    return (
        <VesselsView
            setIsInviteDialogOpen={setIsInviteDialogOpen}
            handleCreateVessel={handleCreateVessel}
            isInviteDialogOpen={isInviteDialogOpen}
            handleInviteMember={handleInviteMember}
            handleInviteSubmit={handleInviteSubmit}
            handleVesselClick={handleVesselClick}
            canInviteMembers={canInviteMembers}
            canCreateVessel={canCreateVessel}
            filteredVessels={filteredVessels}
            setSearchTerm={setSearchTerm}
            organizations={organizations}
            setInviteForm={setInviteForm}
            handleLogout={handleLogout}
            isInviting={isInviting}
            formatDate={formatDate}
            searchTerm={searchTerm}
            inviteForm={inviteForm}
            isLoading={isLoading}
            userInfo={userInfo}
            userType={userType}
        />
    )
}
