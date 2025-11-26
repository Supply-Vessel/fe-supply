import type { AnimalStatus, AnimalType, Laboratory, Sex } from "@/src/components/animals/types";

export interface Animal {
    acquisitionDate: string;
    animalType: AnimalType;
    laboratory: Laboratory;
    records: AnimalRecord[];
    status: AnimalStatus;
    animalTypeId: string;
    laboratoryId: string;
    birthDate?: string;
    identifier: string;
    genotype?: string;
    location?: string;
    strain?: string;
    origin?: string;
    name?: string;
    id?: string;
    sex?: Sex;
}

export interface AnimalRecord {
    activityLevel: string;
    animalId: string;
    createdAt: string;
    createdById: string;
    date: string;
    feedIntake: number;
    id: string;
    measurements: AnimalRecordMeasurement[];
    notes: string;
    recordType: string;
    temperature: number;
    updatedAt: string;
    waterIntake: number;
    weight: number;
}

export interface AnimalRecordMeasurement {
    createdAt: string;
    id: string;
    parameter: string;
    recordId: string;
    unit: string;
    value: number;
}