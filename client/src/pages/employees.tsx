import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { employeesAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  type: string;
  status: "Active" | "On Leave" | "Inactive";
}

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: employees, isLoading } = useQuery({
    queryKey: ["/employees"],
    queryFn: async () => {
      try {
        const response = await employeesAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        return [];
      }
    }
  });
  
  // Sample data when API is not available or loading
  const sampleEmployees: Employee[] = [
    {
      id: "1",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@kmt.com",
      position: "Senior Engineer",
      department: "Development",
      type: "Engineer",
      status: "Active"
    },
    {
      id: "2",
      name: "Sarah Khaled",
      email: "sarah.khaled@kmt.com",
      position: "Team Leader",
      department: "Quality Assurance",
      type: "Engineer",
      status: "Active"
    },
    {
      id: "3",
      name: "Mohamed Medhat",
      email: "mohamed.medhat@kmt.com",
      position: "Worker",
      department: "Production",
      type: "Worker",
      status: "On Leave"
    },
    {
      id: "4",
      name: "Noura Ahmed",
      email: "noura.ahmed@kmt.com",
      position: "HR Specialist",
      department: "Human Resources",
      type: "Manager",
      status: "Active"
    },
    {
      id: "5",
      name: "Hossam Mahmoud",
      email: "hossam.mahmoud@kmt.com",
      position: "Junior Engineer",
      department: "Development",
      type: "Engineer",
      status: "Active"
    }
  ];
  
  const data = employees || sampleEmployees;
  
  const filteredEmployees = data.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success bg-opacity-10 text-success";
      case "On Leave":
        return "bg-warning bg-opacity-10 text-warning";
      case "Inactive":
        return "bg-neutral-400 bg-opacity-10 text-neutral-600";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };
  
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Employees</h2>
            <p className="text-neutral-600 text-sm">Manage your company's employees</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>
        
        <Card className="bg-white rounded-lg shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="text-base font-semibold">All Employees</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:-mx-0">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center">
                        Loading employees...
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <AvatarWithInitials 
                              name={employee.name} 
                              size="sm" 
                              className="bg-neutral-200 mr-2"
                            />
                            <div>
                              <div className="text-sm font-medium text-neutral-900">{employee.name}</div>
                              <div className="text-xs text-neutral-500">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-neutral-700">{employee.department}</div>
                          <div className="text-xs text-neutral-500">{employee.position}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                          {employee.type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="link" size="sm" className="text-primary">
                            View
                          </Button>
                          <Button variant="link" size="sm" className="text-primary">
                            Edit
                          </Button>
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
    </DashboardLayout>
  );
}
