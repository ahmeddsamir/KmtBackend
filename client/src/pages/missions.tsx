import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { missionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Mission {
  id: string;
  title: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    position: string;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  startDate: string;
  endDate: string | null;
  location: string;
  transportation: string | null;
  status: "Pending" | "Approved" | "In Progress" | "Completed" | "Canceled";
}

export default function Missions() {
  const [activeTab, setActiveTab] = useState<string>("active");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: missionsData, isLoading } = useQuery({
    queryKey: ["/missions"],
    queryFn: async () => {
      try {
        const response = await missionsAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch missions:", error);
        return [];
      }
    }
  });
  
  // Sample data when API is not available or loading
  const sampleMissions: Mission[] = [
    {
      id: "1",
      title: "Client Meeting - AlTech Solutions",
      description: "Discuss the new requirements for the ERP system",
      assignedTo: {
        id: "e1",
        name: "Ahmed Hassan",
        position: "Senior Engineer"
      },
      assignedBy: {
        id: "m1",
        name: "Mohammed Ali"
      },
      startDate: "2023-06-15",
      endDate: "2023-06-15",
      location: "AlTech Headquarters, Cairo",
      transportation: "Company Car",
      status: "Approved"
    },
    {
      id: "2",
      title: "System Installation - NileTech",
      description: "Install and configure the new inventory management system",
      assignedTo: {
        id: "e2",
        name: "Sarah Khaled",
        position: "Team Leader"
      },
      assignedBy: {
        id: "m1",
        name: "Mohammed Ali"
      },
      startDate: "2023-06-20",
      endDate: "2023-06-22",
      location: "NileTech Office, Alexandria",
      transportation: null,
      status: "Pending"
    },
    {
      id: "3",
      title: "Training Session - GlobalSys",
      description: "Provide training for staff on new HR module",
      assignedTo: {
        id: "e3",
        name: "Noura Ahmed",
        position: "HR Specialist"
      },
      assignedBy: {
        id: "m2",
        name: "Laila Ibrahim"
      },
      startDate: "2023-06-25",
      endDate: "2023-06-25",
      location: "GlobalSys Office, Giza",
      transportation: "Public Transportation",
      status: "Pending"
    },
    {
      id: "4",
      title: "Emergency Support - DataFlow",
      description: "Fix critical issue with their billing system",
      assignedTo: {
        id: "e4",
        name: "Hossam Mahmoud",
        position: "Junior Engineer"
      },
      assignedBy: {
        id: "m3",
        name: "Ahmed Samir"
      },
      startDate: "2023-06-10",
      endDate: "2023-06-10",
      location: "DataFlow Office, Cairo",
      transportation: "Taxi",
      status: "Completed"
    }
  ];
  
  const data = missionsData || sampleMissions;
  
  const pendingMissions = data.filter(mission => mission.status === "Pending");
  const activeMissions = data.filter(mission => ["Approved", "In Progress"].includes(mission.status));
  const completedMissions = data.filter(mission => mission.status === "Completed");
  
  const approveMutation = useMutation({
    mutationFn: (id: string) => missionsAPI.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/missions"] });
      toast({
        title: "Approved",
        description: "The mission has been approved",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve the mission",
        variant: "destructive",
      });
    }
  });
  
  const rejectMutation = useMutation({
    mutationFn: (id: string) => missionsAPI.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/missions"] });
      toast({
        title: "Rejected",
        description: "The mission has been rejected",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject the mission",
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
      case "Approved":
        return "bg-success bg-opacity-10 text-success";
      case "Pending":
        return "bg-warning bg-opacity-10 text-warning";
      case "In Progress":
        return "bg-info bg-opacity-10 text-info";
      case "Completed":
        return "bg-primary bg-opacity-10 text-primary";
      case "Canceled":
        return "bg-error bg-opacity-10 text-error";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  const renderMissionTable = (missionData: Mission[]) => {
    return (
      <div className="overflow-x-auto -mx-4 sm:-mx-0">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Mission</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              {activeTab === "pending" && (
                <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {isLoading ? (
              <tr>
                <td colSpan={activeTab === "pending" ? 6 : 5} className="px-4 py-3 text-center">
                  Loading missions...
                </td>
              </tr>
            ) : missionData.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "pending" ? 6 : 5} className="px-4 py-3 text-center">
                  No missions found
                </td>
              </tr>
            ) : (
              missionData.map((mission) => (
                <tr key={mission.id}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-neutral-900">{mission.title}</div>
                    <div className="text-xs text-neutral-500 max-w-xs truncate">{mission.description}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <AvatarWithInitials 
                        name={mission.assignedTo.name} 
                        size="sm" 
                        className="bg-neutral-200 mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{mission.assignedTo.name}</div>
                        <div className="text-xs text-neutral-500">{mission.assignedTo.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-neutral-700">
                      {new Date(mission.startDate).toLocaleDateString()}
                      {mission.endDate && mission.endDate !== mission.startDate && (
                        <> - {new Date(mission.endDate).toLocaleDateString()}</>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">
                      By: {mission.assignedBy.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-neutral-700">{mission.location}</div>
                    <div className="text-xs text-neutral-500">{mission.transportation || "No transportation"}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(mission.status)}`}>
                      {mission.status}
                    </span>
                  </td>
                  {activeTab === "pending" && (
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-success hover:text-secondary-dark mr-3"
                        onClick={() => handleApprove(mission.id)}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-error hover:text-red-700"
                        onClick={() => handleReject(mission.id)}
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
            <h2 className="text-xl font-bold text-neutral-900">Missions</h2>
            <p className="text-neutral-600 text-sm">Manage employee missions and field work</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Mission
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Missions</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Active Missions</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMissionTable(activeMissions)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Missions Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMissionTable(pendingMissions)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Completed Missions</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMissionTable(completedMissions)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
