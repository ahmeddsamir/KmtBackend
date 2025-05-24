import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface DepartmentData {
  name: string;
  employees: number;
  color: string;
}

interface SalaryData {
  department: string;
  min: number;
  average: number;
  max: number;
}

interface AttendanceData {
  month: string;
  onTime: number;
  late: number;
  absent: number;
}

interface LeaveData {
  month: string;
  annual: number;
  sick: number;
  personal: number;
  other: number;
}

interface OvertimeData {
  month: string;
  engineering: number;
  production: number;
  hr: number;
  sales: number;
  other: number;
}

export default function Reports() {
  const [timePeriod, setTimePeriod] = useState("quarter");
  const [activeTab, setActiveTab] = useState("headcount");
  
  // This would typically fetch from the backend
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["/reports", timePeriod],
    queryFn: async () => {
      try {
        // In a real implementation, this would be an API call with the period parameter
        // For now, we'll return the sample data
        return {
          departmentData: sampleDepartmentData,
          salaryData: sampleSalaryData,
          attendanceData: sampleAttendanceData,
          leaveData: sampleLeaveData,
          overtimeData: sampleOvertimeData,
        };
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        return null;
      }
    },
  });
  
  // Sample data
  const sampleDepartmentData: DepartmentData[] = [
    { name: "Engineering", employees: 45, color: "#1565C0" },
    { name: "Production", employees: 35, color: "#4CAF50" },
    { name: "HR", employees: 10, color: "#F44336" },
    { name: "Sales", employees: 20, color: "#FFB74D" },
    { name: "Finance", employees: 8, color: "#9C27B0" },
    { name: "IT", employees: 9, color: "#00BCD4" },
  ];
  
  const sampleSalaryData: SalaryData[] = [
    { department: "Engineering", min: 4000, average: 6500, max: 12000 },
    { department: "Production", min: 2000, average: 3500, max: 7000 },
    { department: "HR", min: 3000, average: 5000, max: 9000 },
    { department: "Sales", min: 3500, average: 5500, max: 10000 },
    { department: "Finance", min: 4500, average: 7000, max: 13000 },
    { department: "IT", min: 4200, average: 6800, max: 12500 },
  ];
  
  const sampleAttendanceData: AttendanceData[] = [
    { month: "Jan", onTime: 90, late: 8, absent: 2 },
    { month: "Feb", onTime: 88, late: 10, absent: 2 },
    { month: "Mar", onTime: 92, late: 6, absent: 2 },
    { month: "Apr", onTime: 87, late: 8, absent: 5 },
    { month: "May", onTime: 85, late: 10, absent: 5 },
    { month: "Jun", onTime: 89, late: 9, absent: 2 },
  ];
  
  const sampleLeaveData: LeaveData[] = [
    { month: "Jan", annual: 12, sick: 8, personal: 5, other: 2 },
    { month: "Feb", annual: 15, sick: 10, personal: 3, other: 1 },
    { month: "Mar", annual: 10, sick: 12, personal: 6, other: 2 },
    { month: "Apr", annual: 8, sick: 15, personal: 4, other: 3 },
    { month: "May", annual: 20, sick: 7, personal: 5, other: 1 },
    { month: "Jun", annual: 25, sick: 6, personal: 7, other: 2 },
  ];
  
  const sampleOvertimeData: OvertimeData[] = [
    { month: "Jan", engineering: 120, production: 200, hr: 20, sales: 45, other: 30 },
    { month: "Feb", engineering: 130, production: 180, hr: 25, sales: 50, other: 35 },
    { month: "Mar", engineering: 140, production: 210, hr: 30, sales: 40, other: 25 },
    { month: "Apr", engineering: 125, production: 195, hr: 15, sales: 55, other: 40 },
    { month: "May", engineering: 135, production: 205, hr: 20, sales: 60, other: 30 },
    { month: "Jun", engineering: 150, production: 220, hr: 25, sales: 50, other: 35 },
  ];
  
  const data = reportData || {
    departmentData: sampleDepartmentData,
    salaryData: sampleSalaryData,
    attendanceData: sampleAttendanceData,
    leaveData: sampleLeaveData,
    overtimeData: sampleOvertimeData,
  };
  
  const handlePeriodChange = (value: string) => {
    setTimePeriod(value);
  };
  
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Reports & Analytics</h2>
            <p className="text-neutral-600 text-sm">Comprehensive HR analytics and reporting</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Select value={timePeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="headcount">Headcount</TabsTrigger>
            <TabsTrigger value="salary">Salary Analysis</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Trends</TabsTrigger>
            <TabsTrigger value="leave">Leave Analysis</TabsTrigger>
            <TabsTrigger value="overtime">Overtime</TabsTrigger>
          </TabsList>
          
          {/* Headcount Analysis */}
          <TabsContent value="headcount">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Employees by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-neutral-500">Loading chart data...</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.departmentData}
                            dataKey="employees"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label={(entry) => `${entry.name}: ${entry.employees}`}
                            labelLine={false}
                          >
                            {data.departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Headcount Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-neutral-500">Loading chart data...</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.departmentData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="employees" name="Employees" fill="#1565C0" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Salary Analysis */}
          <TabsContent value="salary">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Salary Range by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-neutral-500">Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.salaryData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="department" type="category" width={100} />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, ""]}
                          labelFormatter={(label) => `Department: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="min" name="Minimum Salary" fill="#FFB74D" />
                        <Bar dataKey="average" name="Average Salary" fill="#1565C0" />
                        <Bar dataKey="max" name="Maximum Salary" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attendance Trends */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-neutral-500">Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.attendanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="onTime" name="On Time" stroke="#4CAF50" strokeWidth={2} />
                        <Line type="monotone" dataKey="late" name="Late" stroke="#FFB74D" strokeWidth={2} />
                        <Line type="monotone" dataKey="absent" name="Absent" stroke="#F44336" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Leave Analysis */}
          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Leave Distribution by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-neutral-500">Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.leaveData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="annual" name="Annual Leave" stackId="a" fill="#1565C0" />
                        <Bar dataKey="sick" name="Sick Leave" stackId="a" fill="#F44336" />
                        <Bar dataKey="personal" name="Personal Leave" stackId="a" fill="#FFB74D" />
                        <Bar dataKey="other" name="Other Leave" stackId="a" fill="#9C27B0" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Overtime Analysis */}
          <TabsContent value="overtime">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Overtime Hours by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-neutral-500">Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.overtimeData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="engineering" name="Engineering" stroke="#1565C0" strokeWidth={2} />
                        <Line type="monotone" dataKey="production" name="Production" stroke="#4CAF50" strokeWidth={2} />
                        <Line type="monotone" dataKey="hr" name="HR" stroke="#F44336" strokeWidth={2} />
                        <Line type="monotone" dataKey="sales" name="Sales" stroke="#FFB74D" strokeWidth={2} />
                        <Line type="monotone" dataKey="other" name="Other" stroke="#9C27B0" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
