"use client";

import type { AnimalEnums, InitialMembersTypes } from "./types";
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useState } from "react";
import TeamView from "./team.view";
import { toast } from "sonner";

interface TeamContainerProps{
    initialMembers: InitialMembersTypes[],
    animalEnums: AnimalEnums,
    userId: string,
    labId: string,
}

export default function TeamContainer(props: TeamContainerProps) {
    const {initialMembers, animalEnums, userId, labId} = props;

    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState("ALL ROLES");
    const [members, setMembers] = useState(initialMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMember, setNewMember] = useState({
        email: "",
        role: "",
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

  // Handle add member
  const handleAddMember = useCallback(async () => {
    try {
      if ( newMember.role && newMember.email ) {
        const member = {
          email: newMember.email,
          role: newMember.role,
          invitedBy: userId,
          labId: labId,
        };

        const response = await apiClient.post("/api/invitation", member);
        toast(response.message || response.error, {
          description: ``
        });
        if(response.success) {
          setIsAddDialogOpen(false);
          setNewMember({
            role: "",
            email: "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create Invitation:", error)
    }
  }, [newMember, userId, labId])

  // Handle delete member
  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = useCallback(async() => {
    if (memberToDelete) {
      const userLabId = memberToDelete;
      try {
        const response = await apiClient.delete(`/api/vessel/${userId}/${labId}/${userLabId}`);
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
  }, [memberToDelete, userId, labId]);

    return (
        <TeamView
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            handleDeleteMember={handleDeleteMember}
            isDeleteDialogOpen={isDeleteDialogOpen}
            isAddDialogOpen={isAddDialogOpen}
            filteredMembers={filteredMembers}
            handleAddMember={handleAddMember}
            setSearchQuery={setSearchQuery}
            setRoleFilter={setRoleFilter}
            confirmDelete={confirmDelete}
            setNewMember={setNewMember}
            searchQuery={searchQuery}
            animalEnums={animalEnums}
            roleFilter={roleFilter}
            newMember={newMember}
            members={members}
            userId={userId}
        />
    );
};