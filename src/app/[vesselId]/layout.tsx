"use server"

import { DashboardHeader } from "@/src/components/dashboard/dashboard-header"
import { SidebarProvider } from "@/src/components/sidebar-provider"
import { Sidebar } from "@/src/components/sidebar"
import type { Vessel } from "../account/types"
import { apiClient } from "@/src/lib/apiClient"
import { redirect } from 'next/navigation'
import { cookies } from "next/headers"
import type React from "react"

export default async function DashboardLayout({
  children,
  params
}: {
  params: {vesselId: string},
  children: React.ReactNode
}) {
  const {vesselId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const laboratories = await apiClient.get(`/api/vessel/vessels/${userId}`);
  const laboratory = await laboratories.data.find((laboratory: Vessel) => laboratory.name ===vesselId);
  const laboratoryMembers = await apiClient.get(`/api/vessel/${userId}/${vesselId}`);

  if(!laboratory) {
    redirect('/account');
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader laboratoryMembers={laboratoryMembers.data} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
