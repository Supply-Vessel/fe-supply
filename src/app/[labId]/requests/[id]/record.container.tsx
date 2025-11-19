"use client"

import AnimalDetailPage from "./animal.record.view";
import type { AnimalPagination } from "../types";
import { apiClient } from "@/src/lib/apiClient";
import { useCallback, useState } from "react";
import type { Animal } from "./types";

export interface RecordContainerProps {
    userId: string;
    labId: string;
    animalId: string;
    animal: Animal;
    animalPagination: AnimalPagination;
}

export default function RecordContainer({userId, labId, animalId, animal, animalPagination}: RecordContainerProps) {
    const [pagination, setPagination] = useState<AnimalPagination>(animalPagination);
    const [animalData, setAnimalData] = useState(animal);

    const handleUpdateDataPagination = useCallback(async (data: {page?: number, pageSize?: number}) => {
        const response = await apiClient.get(`/api/requests/animal/${userId}/${labId}/${animalId}/${data.pageSize || pagination.pageSize}/${data.page || pagination.currentPage}`)
        setPagination(response.pagination)
        setAnimalData(response.data)
    }, [userId, labId, pagination])

    return (
        <AnimalDetailPage
            handleUpdateDataPagination={handleUpdateDataPagination}
            pagination={pagination}
            animalId={animalId}
            animal={animalData}
            userId={userId}
            labId={labId}
        />
    )
}