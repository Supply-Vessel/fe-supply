"use server"

import DashboardContainer from "./deshboard.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function Page ({params}: PageProps) {
  const {vesselId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const requests = await apiClient.get(`/api/requests/${userId}/${vesselId}/999999/1`);
  return (
    <DashboardContainer
      requests={requests.data}
    />
  )
}
