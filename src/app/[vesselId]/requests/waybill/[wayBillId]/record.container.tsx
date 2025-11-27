"use client"

import WaybillRecordView from "./waybill.record.view";
import { useState } from "react";

export interface RecordContainerProps {
    userId: string;
    wayBillId: string;
    logistics: any;
    vesselId: string;
}

export default function RecordContainer({userId, wayBillId, logistics, vesselId}: RecordContainerProps) {
    const [logisticsData, setLogisticsData] = useState(logistics);

    return (
        <WaybillRecordView
            logistics={logisticsData}
            wayBillId={wayBillId}
            vesselId={vesselId}
            userId={userId}
        />
    )
}