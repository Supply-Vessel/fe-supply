"use server"

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

  return (
    <TeamContainer
      initialMembers={vesselMembers.data}
      requestEnums={requestEnums.data}
      vesselId={vesselId}
      userId={userId}
    />
  );
}
