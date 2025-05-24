import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface LeaveRequest {
  id: string;
  employee: {
    id: string;
    name: string;
    position: string;
  };
  type: "Annual" | "Sick" | "Personal" | "Other";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ["/leave"],
    queryFn: async () => {
      try {
        const response = await leaveAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
        return [];
      }
    }
  });
  
  // Sample data when API is not available or loading
  const sampleLeaveRequests: LeaveRequest[] = [
    {
      id: "1",
      employee: {
        id: "e1",
        name: "Ahmed Hassan",
        position: "Senior Engineer"
      },
      type: "Annual",
      startDate: "2023-06-10",
      endDate: "2023-06-15",
      days: 5,
      reason: "Family vacation",
      status: "Pending",
      appliedOn: "2023-06-02"
    },
    {
      id: "2",
      employee: {
        id: "e2",
        name: "Sarah Khaled",
        position: "Team Leader"
      },
      type: "Sick",
      startDate: "2023-06-08",
      endDate: "2023-06-09",
      days: 2,
      reason: "Not feeling well, doctor's appointment attached",
      status: "Approved",
      appliedOn: "2023-06-07"
    },
    {
      id: "3",
      employee: {
        id: "e3",
        name: "Mohamed Medhat",
        position: "Worker"
      },
      type: "Personal",
      startDate: "2023-06-20",
      endDate: "2023-06-21",
      days: 2,
      reason: "Family emergency",
      status: "Pending",
      appliedOn: "2023-06-15"
    }
  ];
  
  const data = leaveRequests || sampleLeaveRequests;
  
  const pendingRequests = data.filter(req => req.status === "Pending");
  const approvedRequests = data.filter(req => req.status === "Approved");
  const rejectedRequests = data.filter(req => req.status === "Rejected");
  
  const approveMutation = useMutation({
    mutationFn: (id: string) => leaveAPI.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/leave"] });
      toast({
        title: "Approved",
        description: "The leave request has been approved",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve the leave request",
        variant: "destructive",
      });
    }
  });
  
  const rejectMutation = useMutation({
    mutationFn: (id: string) => leaveAPI.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/leave"] });
      toast({
        title: "Rejected",
        description: "The leave request has been rejected",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject the leave request",
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
  
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "Annual":
        return "bg-primary bg-opacity-10 text-primary";
      case "Sick":
        return "bg-error bg-opacity-10 text-error";
      case "Personal":
        return "bg-warning bg-opacity-10 text-warning";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success bg-opacity-10 text-success";
      case "Rejected":
        return "bg-error bg-opacity-10 text-error";
      case "Pending":
        return "bg-warning bg-opacity-10 text-warning";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  const renderLeaveTable = (leaveData: LeaveRequest[]) => {
    return (
      <div className="overflow-x-auto -mx-4 sm:-mx-0">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Leave Type</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Duration</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Reason</th>
              {activeTab === "pending" && (
                <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {isLoading ? (
              <tr>
                <td colSpan={activeTab === "pending" ? 6 : 5} className="px-4 py-3 text-center">
                  Loading leave requests...
                </td>
              </tr>
            ) : leaveData.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "pending" ? 6 : 5} className="px-4 py-3 text-center">
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaveData.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <AvatarWithInitials 
                        name={leave.employee.name} 
                        size="sm" 
                        className="bg-neutral-200 mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{leave.employee.name}</div>
                        <div className="text-xs text-neutral-500">{leave.employee.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getLeaveTypeColor(leave.type)}`}>
                      {leave.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-neutral-700">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-neutral-500">{leave.days} days</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-neutral-700 max-w-xs truncate">{leave.reason}</div>
                  </td>
                  {activeTab === "pending" && (
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-success hover:text-secondary-dark mr-3"
                        onClick={() => handleApprove(leave.id)}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-error hover:text-red-700"
                        onClick={() => handleReject(leave.id)}
                        disabled={rejectMutation.isPending}
                      >
                        Reject
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Leave Management</h2>
            <p className="text-neutral-600 text-sm">Manage employee leave requests</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Leave Request
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Pending Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {renderLeaveTable(pendingRequests)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Approved Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {renderLeaveTable(approvedRequests)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Rejected Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {renderLeaveTable(rejectedRequests)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
