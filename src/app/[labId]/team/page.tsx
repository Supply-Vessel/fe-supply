"use server"

import { apiClient } from "@/src/lib/apiClient";
import TeamContainer from "./team.container";
import { cookies } from "next/headers";
interface TeamPageTypes {
  params: {
    labId: string
  }
}

export default async function TeamPage({params}: TeamPageTypes) {
  const { labId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const animalEnums = await apiClient.get(`/api/requests/enums`);
  const laboratoryMembers = await apiClient.get(`/api/vessel/${userId}/${labId}`);

  return (
    <TeamContainer
      initialMembers={laboratoryMembers.data}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  );
}
