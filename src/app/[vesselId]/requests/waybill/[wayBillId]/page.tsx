"use server"

import RecordContainer from "./record.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";

export interface PageProps {
    params: {
        wayBillId: string;
    }
}

export default async function RecordPage({params}: PageProps) {
    const {wayBillId} = await params;
    const cookieStore = await cookies();
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const logistics = await apiClient.get(`/api/tracking/${wayBillId}`);
	
    return (
        <RecordContainer
            wayBillId={wayBillId}
            logistics={logistics}
            userId={userId}
        />
    )
}