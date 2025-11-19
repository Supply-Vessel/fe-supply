"use server"

import RecordContainer from "./record.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";
import type { PageProps } from "./types";

export default async function RecordPage({params}: PageProps) {
    const {labId, id: animalId} = await params;
    const cookieStore = await cookies();
    const userId = await cookieStore.get('USER_ID')?.value || 'default';
    const rows = 10;
    const page = 1;
    const animal = await apiClient.get(`/api/requests/animal/${userId}/${labId}/${animalId}/${rows}/${page}`);
    return (
        <RecordContainer
            animalPagination={animal.pagination}
            animal={animal.data}
            animalId={animalId}
            userId={userId}
            labId={labId}
        />
    )
}
