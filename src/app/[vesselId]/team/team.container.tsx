"use client";

import type { RequestEnums } from "@/src/components/requests/types";
import { OrgRole, type UserType } from "@prisma/client";
import type { Organization } from "../../account/types";
import { useCallback, useMemo, useState } from "react";
import type { InitialMembersTypes } from "./types";
import { apiClient } from "@/src/lib/apiClient";
import TeamView from "./team.view";
import { toast } from "sonner";

interface TeamContainerProps{
    organizationMembers: Organization[],
    initialMembers: InitialMembersTypes[],
    requestEnums: RequestEnums,
    userType: UserType,
    vesselId: string,
    userId: string,
}

export default function TeamContainer(props: TeamContainerProps) {
    const {initialMembers, requestEnums, userId,vesselId, userType, organizationMembers} = props;
    const [organizations, setOrganizations] = useState<Organization[]>(organizationMembers || [])
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState("ALL ROLES");
    const [members, setMembers] = useState(initialMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMember, setNewMember] = useState({
        email: "",
        role: "",
        orgRole: "MEMBER",
    });

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.institution?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "ALL ROLES" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const canInviteMembers = useMemo(() => {
    if (userType === 'ORGANIZATION_OWNER') return true;
    
    return organizations.some(org => 
      org.memberRole === 'ADMIN' || org.memberRole === 'MANAGER'
  );
}, [userType, organizations]);

  // Handle add member
  const handleAddMember = useCallback(async () => {
    try {
      if ( newMember.role && newMember.email ) {
        const member = {
          email: newMember.email,
          role: newMember.role,
          orgRole: newMember.orgRole || "MEMBER",
          invitedBy: userId,
          vesselId: vesselId,
        };

        const response = await apiClient.post("/api/invitation", member);
        toast(response.success ? "Success" : "Error", {
          description: response.message || response.error
        });
        if(response.success) {
          setIsAddDialogOpen(false);
          setNewMember({
            role: "",
            email: "",
            orgRole: "MEMBER",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create Invitation:", error)
    }
  }, [newMember, userId, vesselId])

  // Handle delete member
  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = useCallback(async() => {
    if (memberToDelete) {
      const userVesselId = memberToDelete;
      try {
        const response = await apiClient.delete(`/api/vessel/${userId}/${vesselId}/${userVesselId}`);
        const resSuccess = response.success;

        toast(resSuccess ? "Success" : "Error", {
          description: response.message
        });

        if(resSuccess) {
          setMembers(members.filter((member) => member.id !== memberToDelete));
          setIsDeleteDialogOpen(false);
          setMemberToDelete(null);
        }

      } catch (error) {
        console.error("Failed to delete a Member:", error)
      }
    }
  }, [memberToDelete, userId,vesselId]);

    return (
        <TeamView
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            handleDeleteMember={handleDeleteMember}
            isDeleteDialogOpen={isDeleteDialogOpen}
            canInviteMembers={canInviteMembers}
            isAddDialogOpen={isAddDialogOpen}
            filteredMembers={filteredMembers}
            handleAddMember={handleAddMember}
            setSearchQuery={setSearchQuery}
            setRoleFilter={setRoleFilter}
            confirmDelete={confirmDelete}
            setNewMember={setNewMember}
            requestEnums={requestEnums}
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            newMember={newMember}
            members={members}
            userId={userId}
        />
    );
};