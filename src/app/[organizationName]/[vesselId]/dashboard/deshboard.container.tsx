"use client"

import type { Request, DashboardContainerProps } from "./types";
import DashboardView from "./deshboard.view";
import { useMemo, useState } from "react";

const DashboardContainer = ({requests}: DashboardContainerProps) => {
    const [requestsData, setRequestsData] = useState<Request[] | []>(requests);

    const now = new Date();

    const previousMonthData = useMemo(() => {
            return {
                requests: requestsData.filter(request => {
                if (!request?.createdAt) return false;
                const createdAt = new Date(request.createdAt);
                if (isNaN(createdAt.getTime())) return false;
                
                const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                
                return createdAt >= prevMonth && createdAt <= prevMonthEnd;
            }).length,
        }
    }, [requestsData, now]);

    return (
        <DashboardView 
            previousMonthData={previousMonthData}
            requests={requestsData}
        />
    )
}

export default DashboardContainer;
