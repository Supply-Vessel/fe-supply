"use server"

import DashboardContainer from "./deshboard.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";
import type { RequestTypeModel } from "@/src/components/requests/types";

export default async function Page ({params}: PageProps) {
  const {vesselId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const requestTypes = await apiClient.get(
    `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/request-types/${vesselId}`
  );

  const requestTypesData = requestTypes.data || [];
  
  // Fetch all requests for each request type using name
  const responses = await Promise.all(requestTypesData.map(async (requestType: RequestTypeModel) => {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/requests/${userId}/${vesselId}/999999/1/${requestType.name}`
    );
    return response.data || []; // API returns { success, data, pagination }
  }));
  
  const allRequests = responses.flat();
  
  return (
    <DashboardContainer
      requests={allRequests}
    />
  )
}
