import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    type: "up" | "down" | "neutral" | "warning";
    value: string;
    icon?: string;
  };
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
}: StatsCardProps) {
  const getTrendColor = (type: "up" | "down" | "neutral" | "warning") => {
    switch (type) {
      case "up":
        return "text-success";
      case "down":
        return "text-error";
      case "warning":
        return "text-warning";
      default:
        return "text-info";
    }
  };
  
  const getTrendIcon = (type: "up" | "down" | "neutral" | "warning") => {
    if (trend?.icon) {
      return trend.icon;
    }
    
    switch (type) {
      case "up":
        return "arrow_upward";
      case "down":
        return "arrow_downward";
      case "warning":
        return "priority_high";
      default:
        return "info";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${iconBgColor} bg-opacity-10 flex items-center justify-center mr-4`}>
          <span className={`material-icons ${iconColor}`}>{icon}</span>
        </div>
        <div>
          <div className="text-sm font-medium text-neutral-500">{title}</div>
          <div className="text-xl font-bold text-neutral-900">{value}</div>
        </div>
      </div>
      {trend && (
        <div className={`mt-2 text-xs ${getTrendColor(trend.type)} flex items-center`}>
          <span className="material-icons text-sm mr-1">{getTrendIcon(trend.type)}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
