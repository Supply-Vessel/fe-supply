"use server"

import type { VesselMembersTypes } from "./types";
import { apiClient } from "@/src/lib/apiClient";
import TeamContainer from "./team.container";
import { cookies } from "next/headers";
interface TeamPageTypes {
  params: {
   vesselId: string
  }
}

export default async function TeamPage({params}: TeamPageTypes) {
  const {vesselId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const requestEnums = await apiClient.get(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/requests/enums`);
  const vesselMembers = await apiClient.get(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/vessel/${userId}/${vesselId}`);
  const organizationMembers = await apiClient.get(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/vessel/vessels/${userId}`);
  const userType = vesselMembers.data.find((member: VesselMembersTypes) => member.userId === userId);

  return (
    <TeamContainer
      organizationMembers={organizationMembers.data.organizations}
      initialMembers={vesselMembers.data}
      requestEnums={requestEnums.data}
      userType={userType?.userType}
      vesselId={vesselId}
      userId={userId}
    />
  );
}
