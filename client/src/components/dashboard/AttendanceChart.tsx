import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dashboardAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface AttendanceDataPoint {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export default function AttendanceChart() {
  const [period, setPeriod] = useState("7days");
  
  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ["/dashboard/attendance", period],
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getAttendanceOverview(period);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        return [];
      }
    }
  });
  
  // Sample data for when the API is not available or is loading
  const sampleData: AttendanceDataPoint[] = [
    { date: "Mon", present: 110, absent: 13, late: 4 },
    { date: "Tue", present: 115, absent: 10, late: 2 },
    { date: "Wed", present: 108, absent: 15, late: 4 },
    { date: "Thu", present: 118, absent: 7, late: 2 },
    { date: "Fri", present: 116, absent: 9, late: 2 },
    { date: "Sat", present: 90, absent: 35, late: 2 },
    { date: "Sun", present: 85, absent: 40, late: 2 },
  ];
  
  const data = attendanceData || sampleData;
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Attendance Overview</CardTitle>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-neutral-500">Loading chart data...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-error">Failed to load attendance data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                <XAxis dataKey="date" stroke="#7B8794" />
                <YAxis stroke="#7B8794" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#1565C0" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="absent" stroke="#F44336" />
                <Line type="monotone" dataKey="late" stroke="#FFB74D" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
