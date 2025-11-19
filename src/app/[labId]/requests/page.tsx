"use server"

import { RequestType } from "@/src/components/requests/types";
import RequestsContainer from "./request.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function RequestsPage({params}: PageProps) {
  const {labId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const rows = 10;
  const page = 1;

  const electricalRequests = await apiClient.get(`/api/requests/${userId}/${labId}/${rows}/${page}/${RequestType.ELECTRICAL}`);
  const engineRequests = await apiClient.get(`/api/requests/${userId}/${labId}/${rows}/${page}/${RequestType.ENGINE}`);
  const deckRequests = await apiClient.get(`/api/requests/${userId}/${labId}/${rows}/${page}/${RequestType.DECK}`);
  const requestEnums = await apiClient.get(`/api/requests/enums`);

  return (
    <RequestsContainer
      electricalRequestsPagination={electricalRequests.pagination}
      engineRequestsPagination={engineRequests.pagination}
      deckRequestsPagination={deckRequests.pagination}
      electricalRequests={electricalRequests.data}
      engineRequests={engineRequests.data}
      deckRequests={deckRequests.data}
      requestEnums={requestEnums.data}
      userId={userId}
      labId={labId} 
    />
  )
}
