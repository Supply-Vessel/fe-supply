import type { AnimalRecord, AnimalRecordMeasurement } from "../../types";
import MeasurementsContainer from "./measurements.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function Page({ params }: PageProps) {
  const { labId, id: animalId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const rows = 100;
  const page = 1;
  const animal = await apiClient.get(`/api/requests/animal/${userId}/${labId}/${animalId}/${rows}/${page}`);
  const animalEnums = await apiClient.get(`/api/requests/enums`);
  const measurements = animal.data.records.map((record: AnimalRecord) => record.measurements);

  const uniqueMeasurements = measurements.flat().reduce((acc: AnimalRecordMeasurement[], current: AnimalRecordMeasurement) => {
    const x = acc.find(item => item.parameter === current.parameter);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <MeasurementsContainer
      measurements={uniqueMeasurements}
      animalEnums={animalEnums.data}
      animalId={animalId}
      userId={userId}
      labId={labId}
    />
  )
}
