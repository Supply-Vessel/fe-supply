"use client"

import WaybillRecordView from "./waybill.record.view";
import { useState } from "react";

export interface RecordContainerProps {
    userId: string;
    wayBillId: string;
    logistics: any;
}

export default function RecordContainer({userId, wayBillId, logistics}: RecordContainerProps) {
    const [logisticsData, setLogisticsData] = useState(logistics);

    return (
        <WaybillRecordView
            logistics={logisticsData}
            wayBillId={wayBillId}
            userId={userId}
        />
    )
}