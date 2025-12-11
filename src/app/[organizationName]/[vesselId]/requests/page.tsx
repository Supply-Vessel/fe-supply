"use server"

import RequestsContainer from "./request.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function RequestsPage({params}: PageProps) {
  const {vesselId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  // Fetch request types for this vessel
  const requestTypesResponse = await apiClient.get(
    `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/request-types/${vesselId}`
  );
  
  const requestEnums = await apiClient.get(
    `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/requests/enums`
  );

  return (
    <RequestsContainer
      requestTypes={requestTypesResponse.data || []}
      requestEnums={requestEnums.data}
      vesselId={vesselId}
      userId={userId}
    />
  )
}
