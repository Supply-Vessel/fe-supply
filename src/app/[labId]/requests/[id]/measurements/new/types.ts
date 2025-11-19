import type { ActivityLevel, AnimalEnums, RecordType } from "../../../types";
import type { CreateParameterData } from "@/src/components/requests/types";
import type { formSchema } from "./measurements.container";
import type { UseFormReturn } from "react-hook-form";
import type { useRouter } from "next/navigation";
import type { z } from "zod";

export interface PageProps {
    params: {
        labId: string;
        id: string
    }
}

export interface MeasurementsViewProps {
    handleSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    handleAddParameter: (data: CreateParameterData) => Promise<void>;
    handleUpdateParameter: (index: number, value: number) => void;
    form: UseFormReturn<z.infer<typeof formSchema>>;
    setOpenParameterDialog: (open: boolean) => void;
    additionalParameters: CreateParameterData[];
    router: ReturnType<typeof useRouter>;
    openParameterDialog: boolean;
    animalEnums: AnimalEnums;
    animalId: string;
    userId: string;
    labId: string;
}

export interface NewAnimalRecord {
    measurements?: CreateParameterData[];
    activityLevel: ActivityLevel;
    recordType: RecordType;
    createdById: string;
    temperature: number;
    waterIntake: number;
    feedIntake: number;
    animalId: string;
    weight: number;
    notes: string;
    date: string;
}