"use client";

import type { CreateParameterData } from "@/src/components/requests/types";
import { ActivityLevel, AnimalEnums, RecordType } from "../../../types";
import type { AnimalRecordMeasurement } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import MeasurementsView from "./measurements.view";
import type { BaseSyntheticEvent } from "react";
import { apiClient } from "@/src/lib/apiClient";
import type { NewAnimalRecord } from "./types";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface MeasurementsContainerProps {
    userId: string;
    labId: string;
    animalId: string;
    animalEnums: AnimalEnums;
    measurements: AnimalRecordMeasurement[];
}

export const formSchema = z.object({
    activityLevel: z.nativeEnum(ActivityLevel),
    recordType: z.nativeEnum(RecordType),
    temperature: z.number().optional(),
    waterIntake: z.number().optional(),
    feedIntake: z.number().optional(),
    weight: z.number().optional(),
    notes: z.string().optional(),
    recordTime: z.string(),
    recordDate: z.date(),
    measurements: z.array(z.object({
        parameterName: z.string().max(20, "Parameter name must be less than 20 characters").optional(),
        parameterValue: z.number().max(20, "Parameter value must be less than 20").optional(),
        parameterUnit: z.string().max(10, "Parameter unit must be less than 10 characters").optional(),
    })).optional(),
});

export default function MeasurementsContainer({userId, labId, animalId, animalEnums, measurements}: MeasurementsContainerProps) {
    const [additionalParameters, setAdditionalParameters] = useState<CreateParameterData[] | []>(measurements.map((measurement: AnimalRecordMeasurement) => ({
        parameterName: measurement.parameter,
        parameterValue: 0,
        parameterUnit: measurement.unit,
    })) || []);
    const [openParameterDialog, setOpenParameterDialog] = useState(false);
    const router = useRouter();
  
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recordTime: new Date().toTimeString().slice(0, 5),
            recordType: RecordType.ROUTINE_CHECK,
            activityLevel: ActivityLevel.NORMAL,
            recordDate: new Date(),
            measurements: [{
                parameterName: "",
                parameterValue: 0,
                parameterUnit: "",
            }],
            temperature: 0,
            waterIntake: 0,
            feedIntake: 0,
            weight: 0,
            notes: "",
        },
    });
  
    const handleAddAnimalRecord = useCallback(async (data: z.infer<typeof formSchema>) => {
        try {
            const newAnimalRecord: NewAnimalRecord = {
                animalId: animalId,
                recordType: data.recordType,
                date: new Date().toISOString(),
                createdById: userId as string,
                temperature: data.temperature || 0,
                weight: data.weight || 0,
                feedIntake: data.feedIntake || 0,
                waterIntake: data.waterIntake || 0,
                activityLevel: data.activityLevel || ActivityLevel.NORMAL,
                notes: data.notes || "",
                measurements: additionalParameters,
            }

            const response = await apiClient.post(`/api/animal-records`, newAnimalRecord);
            toast(response.message || response.error, {
                description: `${newAnimalRecord.animalId} - ${newAnimalRecord.recordType}`
            });
            if(response.success) {
                setAdditionalParameters((prev) => {
                    return prev.map((parameter) => ({
                        ...parameter,
                        parameterValue: 0
                    }));
                });
                form.reset()
            }
        } catch (error) {
            console.error("Error adding animal:", error)
        }  
    }, [userId, labId, animalId, additionalParameters])

    const handleAddParameter = useCallback(async (data: CreateParameterData, event?: BaseSyntheticEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        setAdditionalParameters((prev) => [...prev, data]);
    }, [])

    const handleUpdateParameter = useCallback((index: number, value: number) => {
        setAdditionalParameters((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                parameterValue: value
            };
            return updated;
        });
    }, [])

    return (
        <MeasurementsView
            setOpenParameterDialog={setOpenParameterDialog}
            handleUpdateParameter={handleUpdateParameter}
            additionalParameters={additionalParameters}
            openParameterDialog={openParameterDialog}
            handleAddParameter={handleAddParameter}
            handleSubmit={handleAddAnimalRecord}
            animalEnums={animalEnums}
            userId={userId as string}
            labId={labId as string}
            animalId={animalId}
            router={router}
            form={form}
        />
    )
}