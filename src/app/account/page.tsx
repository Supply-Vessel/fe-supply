"use server";

import VesselsContainer from "./vessel.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from 'next/headers';

export default async function Page() {
    const cookieStore = await cookies();
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const response = await apiClient.get(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/vessel/vessels/${userId}`);
    
    return (
        <VesselsContainer
            accountData={response.data}
        />
    )
}
