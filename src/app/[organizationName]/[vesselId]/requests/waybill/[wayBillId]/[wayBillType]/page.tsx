"use server"

import { WayBillType } from "@/src/components/requests/types";
import RecordContainer from "./record.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";

export interface PageProps {
    params: {
        wayBillType: WayBillType;
        wayBillId: string;
        vesselId: string;
    }
}

export default async function RecordPage({params}: PageProps) {
    const {wayBillId, vesselId, wayBillType} = await params;
    const cookieStore = await cookies();
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const logistics = await apiClient.get(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/tracking/${wayBillId}/${wayBillType}`);
	
    return (
        <RecordContainer
			wayBillType={wayBillType}
			wayBillId={wayBillId}
			logistics={logistics}
			vesselId={vesselId}
			userId={userId}
        />
    )
}