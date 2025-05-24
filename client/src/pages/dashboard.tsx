import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import LeaveDistributionChart from "@/components/dashboard/LeaveDistributionChart";
import PendingApprovalsTable from "@/components/dashboard/PendingApprovalsTable";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
import { useAuth } from "@/lib/useAuth";
import { dashboardAPI } from "@/lib/api";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/dashboard/stats"],
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getStats();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return null;
      }
    }
  });
  
  // Sample stats when API is not available or loading
  const sampleStats = {
    totalEmployees: {
      value: 127,
      trend: {
        type: "up",
        value: "4.5% from last month"
      }
    },
    pendingLeaveRequests: {
      value: 8,
      trend: {
        type: "warning",
        value: "3 require immediate attention"
      }
    },
    todayAttendance: {
      value: 119,
      trend: {
        type: "neutral",
        value: "93.7% attendance rate"
      }
    },
    activeMissions: {
      value: 12,
      trend: {
        type: "neutral",
        value: "4 ending this week"
      }
    }
  };
  
  const stats = dashboardStats || sampleStats;
  
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Dashboard</h2>
          <p className="text-neutral-600 text-sm">Welcome back, {user?.name || "User"}</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees.value}
            icon="people"
            iconBgColor="bg-primary-light"
            iconColor="text-primary"
            trend={{
              type: "up",
              value: stats.totalEmployees.trend.value
            }}
          />
          
          <StatsCard
            title="Pending Leave Requests"
            value={stats.pendingLeaveRequests.value}
            icon="event_busy"
            iconBgColor="bg-warning"
            iconColor="text-warning"
            trend={{
              type: "warning",
              value: stats.pendingLeaveRequests.trend.value
            }}
          />
          
          <StatsCard
            title="Attendance Today"
            value={stats.todayAttendance.value}
            icon="fact_check"
            iconBgColor="bg-info"
            iconColor="text-info"
            trend={{
              type: "neutral",
              value: stats.todayAttendance.trend.value,
              icon: "info"
            }}
          />
          
          <StatsCard
            title="Active Missions"
            value={stats.activeMissions.value}
            icon="assignment"
            iconBgColor="bg-accent"
            iconColor="text-accent"
            trend={{
              type: "neutral",
              value: stats.activeMissions.trend.value,
              icon: "schedule"
            }}
          />
        </div>
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AttendanceChart />
          <LeaveDistributionChart />
        </div>
        
        {/* Approval Required Section */}
        <div className="mb-6">
          <PendingApprovalsTable />
        </div>
        
        {/* Recent Activity */}
        <div>
          <RecentActivityList />
        </div>
      </div>
    </DashboardLayout>
  );
}
