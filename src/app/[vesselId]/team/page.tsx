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
  const requestEnums = await apiClient.get(`https://shiphub-ten.vercel.app/api/requests/enums`);
  const laboratoryMembers = await apiClient.get(`https://shiphub-ten.vercel.app/api/vessel/${userId}/${vesselId}`);

  return (
    <TeamContainer
      initialMembers={laboratoryMembers.data}
      requestEnums={requestEnums.data}
      vesselId={vesselId}
      userId={userId}
    />
  );
}
