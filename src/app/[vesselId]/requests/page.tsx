"use server"

import { RequestType } from "@/src/components/requests/types";
import RequestsContainer from "./request.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function RequestsPage({params}: PageProps) {
  const {vesselId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const rows = 10;
  const page = 1;

  const electricalRequests = await apiClient.get(`https://shiphub-ten.vercel.app/api/requests/${userId}/${vesselId}/${rows}/${page}/${RequestType.ELECTRICAL}`);
  const engineRequests = await apiClient.get(`https://shiphub-ten.vercel.app/api/requests/${userId}/${vesselId}/${rows}/${page}/${RequestType.ENGINE}`);
  const deckRequests = await apiClient.get(`https://shiphub-ten.vercel.app/api/requests/${userId}/${vesselId}/${rows}/${page}/${RequestType.DECK}`);
  const requestEnums = await apiClient.get(`https://shiphub-ten.vercel.app/api/requests/enums`);

  return (
    <RequestsContainer
      electricalRequestsPagination={electricalRequests.pagination}
      engineRequestsPagination={engineRequests.pagination}
      deckRequestsPagination={deckRequests.pagination}
      electricalRequests={electricalRequests.data}
      engineRequests={engineRequests.data}
      deckRequests={deckRequests.data}
      requestEnums={requestEnums.data}
      vesselId={vesselId}
      userId={userId}
    />
  )
}
