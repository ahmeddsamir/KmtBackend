import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardAPI } from "@/lib/api";

interface LeaveDistributionItem {
  name: string;
  value: number;
  color: string;
}

export default function LeaveDistributionChart() {
  const { data: leaveData, isLoading, error } = useQuery({
    queryKey: ["/dashboard/leave-distribution"],
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getLeaveDistribution();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch leave distribution data:", error);
        return null;
      }
    }
  });
  
  // Sample data for when the API is not available or is loading
  const sampleData: LeaveDistributionItem[] = [
    { name: "Sick Leave", value: 42, color: "#1565C0" },
    { name: "Annual Leave", value: 35, color: "#4CAF50" },
    { name: "Personal Leave", value: 23, color: "#FFB74D" },
  ];
  
  const data = leaveData || sampleData;
  
  const renderLegendItems = () => {
    return data.map((entry, index) => (
      <div key={`legend-${index}`} className="flex items-center justify-between text-sm mt-2 first:mt-0">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
          <span>{entry.name}</span>
        </div>
        <span className="font-medium">{entry.value}%</span>
      </div>
    ));
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Leave Distribution</CardTitle>
        <Button variant="link" size="sm" className="text-primary p-0">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-neutral-500">Loading chart data...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-error">Failed to load leave data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4">
          {renderLegendItems()}
        </div>
      </CardContent>
    </Card>
  );
}
