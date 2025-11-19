"use server"

import DashboardContainer from "./deshboard.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function Page ({params}: PageProps) {
  const {labId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const requests = await apiClient.get(`/api/requests/${userId}/${labId}/999999/1`);
  const experiments = await apiClient.get(`/api/experiments/${userId}/${labId}`);
  const tasks = await apiClient.get(`/api/tasks/${userId}/${labId}`);
  return (
    <DashboardContainer 
      experiments={experiments.data}
      requests={requests.data}
      tasks={tasks.data}
    />
  )
}
