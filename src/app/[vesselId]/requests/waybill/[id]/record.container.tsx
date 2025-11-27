"use client"

import { apiClient } from "@/src/lib/apiClient";
import WaybillRecordView from "./waybill.record.view";
import { useEffect, useState } from "react";

export interface RecordContainerProps {
    userId: string;
    wayBillId: string;
    logistics: any;
}

export default function RecordContainer({userId, wayBillId, logistics}: RecordContainerProps) {
    const [logisticsData, setLogisticsData] = useState(logistics);

    useEffect(() => {
        const fetchLogistics = async () => {
            const logistics = await apiClient.get(`https://tracking.searates.com/air?api_key=K-22D440E2-49B9-4673-A50E-8285C3B7D6DC&number=157-45101486`);
            setLogisticsData(logistics);
            console.log("logistics", logistics);
        };
        fetchLogistics();
    }, []);

    return (
        <WaybillRecordView
            logistics={logisticsData}
            wayBillId={wayBillId}
            userId={userId}
        />
    )
}