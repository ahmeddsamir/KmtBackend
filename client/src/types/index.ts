// User related types
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: "General Manager" | "HR Manager" | "Team Leader" | "Employee";
  department?: string;
  position?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Employee related types
export type EmployeeType = "Engineer" | "Manager" | "Team Leader" | "Worker";
export type EmploymentStatus = "Active" | "On Leave" | "Inactive" | "Terminated";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  type: EmployeeType;
  status: EmploymentStatus;
  salary?: number;
  joiningDate: string;
  manager?: {
    id: string;
    name: string;
  };
  teamLeader?: {
    id: string;
    name: string;
  };
  remainingVacationDays?: number;
}

// Attendance related types
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Early Departure" | "Pending Approval";

export interface AttendanceRecord {
  id: string;
  employee: {
    id: string;
    name: string;
    position: string;
  };
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: AttendanceStatus;
  notes?: string;
  approvedBy?: {
    id: string;
    name: string;
  };
  approvedAt?: string;
}

// Leave related types
export type LeaveType = "Annual" | "Sick" | "Personal" | "Other";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  employee: {
    id: string;
    name: string;
    position: string;
  };
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: {
    id: string;
    name: string;
  };
  approvedAt?: string;
  rejectedBy?: {
    id: string;
    name: string;
  };
  rejectedAt?: string;
  rejectionReason?: string;
}

// Mission related types
export type MissionStatus = "Pending" | "Approved" | "In Progress" | "Completed" | "Canceled";

export interface Mission {
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
  status: MissionStatus;
  approvedBy?: {
    id: string;
    name: string;
  };
  approvedAt?: string;
  completedAt?: string;
  canceledAt?: string;
  cancelReason?: string;
}

// Policy related types
export type PolicyCategory = "Overtime" | "Vacation" | "Deduction" | "Bonus" | "Other";

export interface Policy {
  id: string;
  name: string;
  category: PolicyCategory;
  description: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  updatedBy?: {
    id: string;
    name: string;
  };
}

// Dashboard related types
export interface DashboardStats {
  totalEmployees: {
    value: number;
    trend: {
      type: "up" | "down" | "neutral" | "warning";
      value: string;
    };
  };
  pendingLeaveRequests: {
    value: number;
    trend: {
      type: "up" | "down" | "neutral" | "warning";
      value: string;
    };
  };
  todayAttendance: {
    value: number;
    trend: {
      type: "up" | "down" | "neutral" | "warning";
      value: string;
    };
  };
  activeMissions: {
    value: number;
    trend: {
      type: "up" | "down" | "neutral" | "warning";
      value: string;
    };
  };
}

export interface AttendanceChartData {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export interface LeaveDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface PendingApproval {
  id: string;
  type: "Leave Request" | "Mission Assignment" | "Attendance Correction";
  employee: {
    id: string;
    name: string;
    position: string;
  };
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface RecentActivity {
  id: string;
  type: "approval" | "new_employee" | "policy_update" | "mission_completed";
  description: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
}

// Report related types
export interface DepartmentData {
  name: string;
  employees: number;
  color: string;
}

export interface SalaryData {
  department: string;
  min: number;
  average: number;
  max: number;
}

export interface AttendanceData {
  month: string;
  onTime: number;
  late: number;
  absent: number;
}

export interface LeaveData {
  month: string;
  annual: number;
  sick: number;
  personal: number;
  other: number;
}

export interface OvertimeData {
  month: string;
  engineering: number;
  production: number;
  hr: number;
  sales: number;
  other: number;
}

export interface ReportData {
  departmentData: DepartmentData[];
  salaryData: SalaryData[];
  attendanceData: AttendanceData[];
  leaveData: LeaveData[];
  overtimeData: OvertimeData[];
}
