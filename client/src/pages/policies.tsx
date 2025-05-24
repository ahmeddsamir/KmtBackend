import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { policiesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Policy {
  id: string;
  name: string;
  category: "Overtime" | "Vacation" | "Deduction" | "Bonus" | "Other";
  description: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export default function Policies() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { data: policies, isLoading } = useQuery({
    queryKey: ["/policies"],
    queryFn: async () => {
      try {
        const response = await policiesAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch policies:", error);
        return [];
      }
    },
  });
  
  // Sample data when API is not available or loading
  const samplePolicies: Policy[] = [
    {
      id: "1",
      name: "Standard Overtime Rate",
      category: "Overtime",
      description: "Standard overtime rate for regular working days",
      value: "1.5x hourly rate",
      createdAt: "2023-01-15T08:30:00Z",
      updatedAt: "2023-04-22T14:20:00Z",
      createdBy: {
        id: "u1",
        name: "Mohammed Ali"
      }
    },
    {
      id: "2",
      name: "Weekend Overtime Rate",
      category: "Overtime",
      description: "Overtime rate for weekend work",
      value: "2x hourly rate",
      createdAt: "2023-01-15T08:35:00Z",
      updatedAt: "2023-04-22T14:22:00Z",
      createdBy: {
        id: "u1",
        name: "Mohammed Ali"
      }
    },
    {
      id: "3",
      name: "Annual Leave Entitlement",
      category: "Vacation",
      description: "Standard annual leave entitlement for all employees",
      value: "21 days per year",
      createdAt: "2023-01-20T09:15:00Z",
      updatedAt: "2023-01-20T09:15:00Z",
      createdBy: {
        id: "u2",
        name: "Laila Ibrahim"
      }
    },
    {
      id: "4",
      name: "Late Arrival Deduction",
      category: "Deduction",
      description: "Deduction for late arrival to work",
      value: "Hourly rate per late hour",
      createdAt: "2023-02-05T11:20:00Z",
      updatedAt: "2023-04-10T13:45:00Z",
      createdBy: {
        id: "u2",
        name: "Laila Ibrahim"
      }
    },
    {
      id: "5",
      name: "Performance Bonus",
      category: "Bonus",
      description: "Annual performance bonus calculation",
      value: "5% - 15% of annual salary",
      createdAt: "2023-02-10T14:30:00Z",
      updatedAt: "2023-02-10T14:30:00Z",
      createdBy: {
        id: "u1",
        name: "Mohammed Ali"
      }
    }
  ];
  
  const data = policies || samplePolicies;
  
  const filteredPolicies = activeTab === "all" 
    ? data 
    : data.filter(policy => policy.category.toLowerCase() === activeTab);
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => policiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/policies"] });
      toast({
        title: "Policy Deleted",
        description: "The policy has been deleted successfully",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the policy. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleDeleteClick = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedPolicy) {
      deleteMutation.mutate(selectedPolicy.id);
    }
  };
  
  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsViewDialogOpen(true);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Overtime":
        return "bg-primary bg-opacity-10 text-primary";
      case "Vacation":
        return "bg-info bg-opacity-10 text-info";
      case "Deduction":
        return "bg-error bg-opacity-10 text-error";
      case "Bonus":
        return "bg-success bg-opacity-10 text-success";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Policies</h2>
            <p className="text-neutral-600 text-sm">Manage company policies and rules</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create New Policy
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="all">All Policies</TabsTrigger>
            <TabsTrigger value="overtime">Overtime</TabsTrigger>
            <TabsTrigger value="vacation">Vacation</TabsTrigger>
            <TabsTrigger value="deduction">Deduction</TabsTrigger>
            <TabsTrigger value="bonus">Bonus</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {activeTab === "all" ? "All Policies" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Policies`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:-mx-0">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Policy Name</th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Value</th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Updated</th>
                        <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-center">
                            Loading policies...
                          </td>
                        </tr>
                      ) : filteredPolicies.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-center">
                            No policies found
                          </td>
                        </tr>
                      ) : (
                        filteredPolicies.map((policy) => (
                          <tr key={policy.id}>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-neutral-900">{policy.name}</div>
                              <div className="text-xs text-neutral-500 max-w-xs truncate">{policy.description}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(policy.category)}`}>
                                {policy.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                              {policy.value}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-neutral-700">{formatDate(policy.updatedAt)}</div>
                              <div className="text-xs text-neutral-500">By: {policy.createdBy.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary mr-2"
                                onClick={() => handleViewPolicy(policy)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary mr-2"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-error"
                                  onClick={() => handleDeleteClick(policy)}
                                >
                                  <Trash className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* View Policy Dialog */}
        {selectedPolicy && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedPolicy.name}</DialogTitle>
                <DialogDescription>
                  Policy details and information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Category</h4>
                  <p className="mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedPolicy.category)}`}>
                      {selectedPolicy.category}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Description</h4>
                  <p className="mt-1 text-sm text-neutral-700">{selectedPolicy.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Value</h4>
                  <p className="mt-1 text-sm text-neutral-700">{selectedPolicy.value}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500">Created</h4>
                    <p className="mt-1 text-sm text-neutral-700">{formatDate(selectedPolicy.createdAt)}</p>
                    <p className="text-xs text-neutral-500">By: {selectedPolicy.createdBy.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500">Last Updated</h4>
                    <p className="mt-1 text-sm text-neutral-700">{formatDate(selectedPolicy.updatedAt)}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button className="ml-2">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Policy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the policy "{selectedPolicy?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-error text-white hover:bg-error/90"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
