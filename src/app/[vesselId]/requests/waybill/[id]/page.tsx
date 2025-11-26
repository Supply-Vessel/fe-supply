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
    const logistics = await apiClient.get(`https://tracking.searates.com/air?api_key=${process.env.NEXT_PUBLIC_SEARATES_API_KEY}&number=${wayBillId as string}`);
    console.log("logistics", logistics);
    
    return (
        // <RecordContainer
        //     animalPagination={animal.pagination}
        //     animal={animal.data}
        //     userId={userId}
        // />
        <div></div>
    )
}
