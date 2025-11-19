"use client"

import type { Request, DashboardContainerProps, Experiment, Task } from "./types";
import DashboardView from "./deshboard.view";
import { useMemo, useState } from "react";

const DashboardContainer = ({requests, experiments, tasks}: DashboardContainerProps) => {
    const [experimentsData, setExperimentsData] = useState<Experiment[] | []>(experiments);
    const [requestsData, setRequestsData] = useState<Request[] | []>(requests);
    const [tasksData, setTasksData] = useState<Task[] | []>(tasks);

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
            
            experiments: experimentsData.filter(experiment => {
                if (!experiment?.startDate) return false;
                const startDate = new Date(experiment.startDate);
                if (isNaN(startDate.getTime())) return false;
                
                const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                const prevWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                
                return startDate >= prevWeekStart && startDate <= prevWeekEnd;
            })?.length || 0,
            
            tasks: tasksData.filter(task => {
                if (!task?.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                if (isNaN(dueDate.getTime())) return false;
                
                const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                
                return dueDate.toDateString() === yesterday.toDateString();
            }).length || 0,
        }
    }, [requestsData, experimentsData, tasksData, now]);

    return (
        <DashboardView 
            previousMonthData={previousMonthData}
            experiments={experimentsData}
            requests={requestsData}
            tasks={tasksData}
        />
    )
}

export default DashboardContainer;
