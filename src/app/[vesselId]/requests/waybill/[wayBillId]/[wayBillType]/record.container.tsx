"use client"

import { WayBillType } from "@/src/components/requests/types";
import WaybillRecordView from "./waybill.record.view";
import { useState } from "react";

export interface RecordContainerProps {
    wayBillType: WayBillType;
    wayBillId: string;
    vesselId: string;
    userId: string;
    logistics: any;
}

export default function RecordContainer({userId, wayBillId, wayBillType, logistics, vesselId}: RecordContainerProps) {
    const [logisticsData, setLogisticsData] = useState(logistics);

    return (
        <WaybillRecordView
            wayBillType={wayBillType}
            logistics={logisticsData}
            wayBillId={wayBillId}
            vesselId={vesselId}
            userId={userId}
        />
    )
}