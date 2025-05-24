import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardAPI } from "@/lib/api";

interface ActivityItem {
  id: string;
  type: "approval" | "new_employee" | "policy_update" | "mission_completed";
  description: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

export default function RecentActivityList() {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ["/dashboard/recent-activity"],
    queryFn: async () => {
      try {
        const response = await dashboardAPI.getRecentActivity();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
        return [];
      }
    }
  });
  
  // Sample data for when the API is not available or is loading
  const sampleData: ActivityItem[] = [
    {
      id: "1",
      type: "approval",
      description: 'Leave request for <span class="font-medium">Hossam Mahmoud</span> was approved',
      time: "2 hours ago",
      icon: "check_circle",
      iconColor: "text-primary",
      iconBgColor: "bg-primary-light bg-opacity-10"
    },
    {
      id: "2",
      type: "new_employee",
      description: 'New employee <span class="font-medium">Noura Ahmed</span> was added to the system',
      time: "Yesterday at 4:30 PM",
      icon: "person_add",
      iconColor: "text-secondary",
      iconBgColor: "bg-secondary bg-opacity-10"
    },
    {
      id: "3",
      type: "policy_update",
      description: 'Overtime policy was updated by <span class="font-medium">Admin</span>',
      time: "2 days ago",
      icon: "edit",
      iconColor: "text-warning",
      iconBgColor: "bg-warning bg-opacity-10"
    },
    {
      id: "4",
      type: "mission_completed",
      description: 'Mission completed by <span class="font-medium">Engineering Team</span>',
      time: "3 days ago",
      icon: "assignment_turned_in",
      iconColor: "text-accent",
      iconBgColor: "bg-accent bg-opacity-10"
    }
  ];
  
  const data = activityData || sampleData;
  
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        <Button variant="link" size="sm" className="text-primary p-0">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-4 text-center">
              <p className="text-neutral-500">Loading recent activities...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-neutral-500">No recent activities found</p>
            </div>
          ) : (
            data.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="w-10 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${activity.iconBgColor} flex items-center justify-center`}>
                    <span className={`material-icons text-sm ${activity.iconColor}`}>{activity.icon}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p 
                    className="text-sm text-neutral-900" 
                    dangerouslySetInnerHTML={{ __html: activity.description }}
                  />
                  <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
