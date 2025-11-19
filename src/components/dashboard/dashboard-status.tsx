import type { Experiment, Request, Task } from "@/src/app/[labId]/dashboard/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Beaker, MousePointer, ClipboardList, AlertTriangle } from "lucide-react"
import { useMemo } from "react"

interface DashboardStatusProps {
  experiments: Experiment[];
  requests: Request[];
  tasks: Task[];
  previousMonthData?: {
    experiments: number;
    requests: number;
    tasks: number;
  };
}

function calculatePercentageChange(current: number, previous: number): { 
  percentage: number; 
  isPositive: boolean; 
  isZero: boolean;
} {
  if (previous === 0) {
    return { 
      percentage: current > 0 ? 100 : 0, 
      isPositive: current > 0, 
      isZero: current === 0 
    };
  }
  
  const percentage = ((current - previous) / previous) * 100;
  return { 
    percentage: Math.abs(percentage), 
    isPositive: percentage >= 0, 
    isZero: percentage === 0 
  };
}

function formatPercentageText(current: number, previous: number, type: 'requests' | 'experiments' | 'tasks'): { 
  text: string; 
  className: string 
} {
  if (type === 'requests') {
    const { percentage, isPositive, isZero } = calculatePercentageChange(current, previous);
    
    if (isZero) {
      return { 
        text: "No change from last month", 
        className: "text-xs text-gray-500" 
      };
    }
    
    if (percentage > 500) {
      const diff = current - previous;
      const sign = diff > 0 ? "+" : "";
      const color = diff > 0 ? "text-green-600" : "text-red-600";
      
      return { 
        text: `${sign}${diff} new this month`, 
        className: `text-xs ${color}` 
      };
    }
    
    const sign = isPositive ? "+" : "-";
    const color = isPositive ? "text-green-600" : "text-red-600";
    
    return { 
      text: `${sign}${percentage.toFixed(1)}% from last month`, 
      className: `text-xs ${color}` 
    };
  } else if (type === 'experiments') {
    const diff = current - previous;
    
    if (diff === 0) {
      return { 
        text: "No change from last week", 
        className: "text-xs text-gray-500" 
      };
    }
    
    const sign = diff > 0 ? "+" : "";
    const color = diff > 0 ? "text-green-600" : "text-red-600";
    
    return { 
      text: `${sign}${diff} new this week`, 
      className: `text-xs ${color}` 
    };
  } else if (type === 'tasks') {
    if (current === 0) {
      return { 
        text: "No task today", 
        className: "text-xs text-gray-500" 
      };
    }
    
    return { 
      text: `${current} due today`, 
      className: "text-xs text-blue-600" 
    };
  }
  
  return { 
    text: "No data", 
    className: "text-xs text-gray-500" 
  };
}

export function DashboardStatus({requests, experiments, tasks, previousMonthData}: DashboardStatusProps) {
  const requestsChange = useMemo(() => previousMonthData ?
    formatPercentageText(requests.length, previousMonthData.requests, 'requests') : 
    { text: "No previous data", className: "text-xs text-gray-500" }, [requests, previousMonthData]);

  const experimentsChange = useMemo(() => previousMonthData ? 
    formatPercentageText(experiments.length, previousMonthData.experiments, 'experiments') : 
    { text: "No previous data", className: "text-xs text-gray-500" }, [experiments, previousMonthData]);

  const tasksChange = useMemo(() => previousMonthData ? 
    formatPercentageText(tasks.length, previousMonthData.tasks, 'tasks') : 
    { text: "No previous data", className: "text-xs text-gray-500" }, [tasks, previousMonthData]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-[315px] md:w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <MousePointer className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{requests.length}</div>
          <p className={requestsChange.className}>{requestsChange.text}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          <Beaker className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{experiments.length}</div>
          <p className={experimentsChange.className}>{experimentsChange.text}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <ClipboardList className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <p className={tasksChange.className}>{tasksChange.text}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-gray-500">Requires immediate attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
