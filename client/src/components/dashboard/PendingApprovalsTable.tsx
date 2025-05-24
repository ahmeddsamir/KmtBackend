import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { dashboardAPI, leaveAPI, missionsAPI, attendanceAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ApprovalItem {
  id: string;
  employee: {
    id: string;
    name: string;
    position: string;
  };
  type: "Leave Request" | "Mission Assignment" | "Attendance Correction";
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

type FilterType = "All" | "Leave" | "Missions" | "Attendance";

export default function PendingApprovalsTable() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: approvalsData, isLoading } = useQuery({
    queryKey: ["/dashboard/pending-approvals"],
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getPendingApprovals();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch pending approvals:", error);
        return [];
      }
    }
  });
  
  // Sample data when API is not available or loading
  const sampleData: ApprovalItem[] = [
    {
      id: "1",
      employee: {
        id: "e1",
        name: "Ahmed Hassan",
        position: "Engineer"
      },
      type: "Leave Request",
      date: "June 10 - June 15, 2023",
      status: "Pending"
    },
    {
      id: "2",
      employee: {
        id: "e2",
        name: "Sarah Khaled",
        position: "Team Leader"
      },
      type: "Mission Assignment",
      date: "June 20, 2023",
      status: "Pending"
    },
    {
      id: "3",
      employee: {
        id: "e3",
        name: "Mohamed Medhat",
        position: "Worker"
      },
      type: "Attendance Correction",
      date: "June 8, 2023",
      status: "Pending"
    }
  ];
  
  const data = approvalsData || sampleData;
  
  const filteredData = activeFilter === "All" 
    ? data 
    : data.filter(item => {
        if (activeFilter === "Leave") return item.type === "Leave Request";
        if (activeFilter === "Missions") return item.type === "Mission Assignment";
        if (activeFilter === "Attendance") return item.type === "Attendance Correction";
        return true;
      });
  
  const approveMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      if (type === "Leave Request") {
        return await leaveAPI.approve(id);
      } else if (type === "Mission Assignment") {
        return await missionsAPI.approve(id);
      } else if (type === "Attendance Correction") {
        return await attendanceAPI.approve(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/dashboard/pending-approvals"] });
      toast({
        title: "Approved",
        description: "The request has been approved successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const rejectMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      if (type === "Leave Request") {
        return await leaveAPI.reject(id);
      } else if (type === "Mission Assignment") {
        return await missionsAPI.reject(id);
      } else if (type === "Attendance Correction") {
        return await attendanceAPI.reject(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/dashboard/pending-approvals"] });
      toast({
        title: "Rejected",
        description: "The request has been rejected",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleApprove = (id: string, type: string) => {
    approveMutation.mutate({ id, type });
  };
  
  const handleReject = (id: string, type: string) => {
    rejectMutation.mutate({ id, type });
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === "All" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveFilter("All")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "Leave" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveFilter("Leave")}
          >
            Leave
          </Button>
          <Button 
            variant={activeFilter === "Missions" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveFilter("Missions")}
          >
            Missions
          </Button>
          <Button 
            variant={activeFilter === "Attendance" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveFilter("Attendance")}
          >
            Attendance
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center">
                    Loading pending approvals...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center">
                    No pending approvals found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <AvatarWithInitials 
                          name={item.employee.name} 
                          size="sm" 
                          className="bg-neutral-200 mr-2"
                        />
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{item.employee.name}</div>
                          <div className="text-xs text-neutral-500">{item.employee.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{item.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{item.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-warning bg-opacity-10 text-warning">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-success hover:text-secondary-dark mr-3"
                        onClick={() => handleApprove(item.id, item.type)}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-error hover:text-red-700"
                        onClick={() => handleReject(item.id, item.type)}
                        disabled={rejectMutation.isPending}
                      >
                        Decline
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary hover:text-primary-light text-sm font-medium">
              View All Pending Approvals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
