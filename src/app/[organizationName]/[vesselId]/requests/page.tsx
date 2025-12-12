"use server"

import RequestsContainer from "./request.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";

interface PageProps {
  params: {
    organizationName: string;
    vesselId: string;
    userId: string;
  };
}

export default async function RequestsPage({params}: PageProps) {
  const { vesselId, organizationName} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  // Fetch request types for this vessel
  const requestTypesResponse = await apiClient.get(
    `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/request-types/${vesselId}`
  );
  
  const requestEnums = await apiClient.get(
    `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/requests/enums`
  );

  const user = await apiClient.get(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/users/${organizationName}/${vesselId}/${userId}`);
  const userType = user.data?.userType;
  const userOrgRole = user.data?.orgRole;

  return (
    <RequestsContainer
      requestTypes={requestTypesResponse.data || []}
      requestEnums={requestEnums.data}
      userOrgRole={userOrgRole}
      userType={userType}
      vesselId={vesselId}
      userId={userId}
    />
  )
}
