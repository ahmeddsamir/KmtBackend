import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  employee: {
    id: string;
    name: string;
    position: string;
  };
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: "Present" | "Absent" | "Late" | "Early Departure" | "Pending Approval";
  notes?: string;
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<string>("daily");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["/attendance", formattedDate],
    queryFn: async () => {
      try {
        const response = await attendanceAPI.getByDate(formattedDate);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        return [];
      }
    },
    enabled: !!selectedDate
  });
  
  // Sample data when API is not available or loading
  const sampleAttendance: AttendanceRecord[] = [
    {
      id: "1",
      employee: {
        id: "e1",
        name: "Ahmed Hassan",
        position: "Senior Engineer"
      },
      date: formattedDate,
      checkIn: "08:55:30",
      checkOut: "17:02:15",
      status: "Present"
    },
    {
      id: "2",
      employee: {
        id: "e2",
        name: "Sarah Khaled",
        position: "Team Leader"
      },
      date: formattedDate,
      checkIn: "09:10:22",
      checkOut: "17:30:05",
      status: "Late"
    },
    {
      id: "3",
      employee: {
        id: "e3",
        name: "Mohamed Medhat",
        position: "Worker"
      },
      date: formattedDate,
      checkIn: "07:58:11",
      checkOut: "16:45:00",
      status: "Present"
    },
    {
      id: "4",
      employee: {
        id: "e4",
        name: "Noura Ahmed",
        position: "HR Specialist"
      },
      date: formattedDate,
      checkIn: "08:30:00",
      checkOut: "15:20:10",
      status: "Early Departure"
    },
    {
      id: "5",
      employee: {
        id: "e5",
        name: "Hossam Mahmoud",
        position: "Junior Engineer"
      },
      date: formattedDate,
      checkIn: "08:43:25",
      checkOut: null,
      status: "Pending Approval",
      notes: "Forgot to check out"
    }
  ];
  
  const data = attendanceData || sampleAttendance;
  
  const approveMutation = useMutation({
    mutationFn: (id: string) => attendanceAPI.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/attendance"] });
      toast({
        title: "Approved",
        description: "The attendance record has been approved",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve the attendance record",
        variant: "destructive",
      });
    }
  });
  
  const rejectMutation = useMutation({
    mutationFn: (id: string) => attendanceAPI.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/attendance"] });
      toast({
        title: "Rejected",
        description: "The attendance record has been rejected",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject the attendance record",
        variant: "destructive",
      });
    }
  });
  
  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };
  
  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-success bg-opacity-10 text-success";
      case "Absent":
        return "bg-error bg-opacity-10 text-error";
      case "Late":
        return "bg-warning bg-opacity-10 text-warning";
      case "Early Departure":
        return "bg-accent bg-opacity-10 text-accent";
      case "Pending Approval":
        return "bg-info bg-opacity-10 text-info";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Attendance Management</h2>
          <p className="text-neutral-600 text-sm">Track and manage employee attendance</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="border rounded-md p-2"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      Attendance for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                            <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Check In</th>
                            <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Check Out</th>
                            <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {isLoading ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-3 text-center">
                                Loading attendance records...
                              </td>
                            </tr>
                          ) : data.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-3 text-center">
                                No attendance records found for this date
                              </td>
                            </tr>
                          ) : (
                            data.map((record) => (
                              <tr key={record.id}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <AvatarWithInitials 
                                      name={record.employee.name} 
                                      size="sm" 
                                      className="bg-neutral-200 mr-2"
                                    />
                                    <div>
                                      <div className="text-sm font-medium text-neutral-900">{record.employee.name}</div>
                                      <div className="text-xs text-neutral-500">{record.employee.position}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                                  {record.checkIn}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                                  {record.checkOut || "Not checked out"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex flex-col space-y-1">
                                    <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusColor(record.status)}`}>
                                      {record.status}
                                    </span>
                                    {record.notes && (
                                      <span className="text-xs text-neutral-500">{record.notes}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                  {record.status === "Pending Approval" ? (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-success hover:text-secondary-dark mr-3"
                                        onClick={() => handleApprove(record.id)}
                                        disabled={approveMutation.isPending}
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-error hover:text-red-700"
                                        onClick={() => handleReject(record.id)}
                                        disabled={rejectMutation.isPending}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <Button variant="link" size="sm" className="text-primary">
                                      Details
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Monthly Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-neutral-500">Monthly attendance view will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Pending Attendance Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500 mb-4">Review and approve attendance records requiring attention</p>
                <div className="overflow-x-auto -mx-4 sm:-mx-0">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Issue</th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Notes</th>
                        <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {/* This would use a separate query for pending approvals */}
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <AvatarWithInitials 
                              name="Hossam Mahmoud" 
                              size="sm" 
                              className="bg-neutral-200 mr-2"
                            />
                            <div>
                              <div className="text-sm font-medium text-neutral-900">Hossam Mahmoud</div>
                              <div className="text-xs text-neutral-500">Junior Engineer</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                          June 8, 2023
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                          Missing Check-out
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-700">
                          Forgot to check out at the end of the day
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-success hover:text-secondary-dark mr-3"
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-error hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                      {/* Add more pending approvals here */}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
