import axios from "axios";

// Set the base URL from environment variable
const API_BASE_URL = "http://localhost:5114/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach JWT token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and refresh the page to redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post("/Authentication/Login", credentials),
};

export const employeesAPI = {
  getAll: () => api.get("/employees"),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (employee: any) => api.post("/employees", employee),
  update: (id: string, employee: any) => api.put(`/employees/${id}`, employee),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  getAll: () => api.get("/attendance"),
  getByDate: (date: string) => api.get(`/attendance?date=${date}`),
  getByEmployee: (employeeId: string) => api.get(`/attendance?employeeId=${employeeId}`),
  approve: (id: string) => api.put(`/attendance/${id}/approve`),
  reject: (id: string) => api.put(`/attendance/${id}/reject`),
};

export const leaveAPI = {
  getAll: () => api.get("/leave"),
  getById: (id: string) => api.get(`/leave/${id}`),
  create: (leave: any) => api.post("/leave", leave),
  approve: (id: string) => api.put(`/leave/${id}/approve`),
  reject: (id: string) => api.put(`/leave/${id}/reject`),
};

export const missionsAPI = {
  getAll: () => api.get("/missions"),
  getById: (id: string) => api.get(`/missions/${id}`),
  create: (mission: any) => api.post("/missions", mission),
  approve: (id: string) => api.put(`/missions/${id}/approve`),
  reject: (id: string) => api.put(`/missions/${id}/reject`),
};

export const policiesAPI = {
  getAll: () => api.get("/policies"),
  getById: (id: string) => api.get(`/policies/${id}`),
  create: (policy: any) => api.post("/policies", policy),
  update: (id: string, policy: any) => api.put(`/policies/${id}`, policy),
  delete: (id: string) => api.delete(`/policies/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getAttendanceOverview: (period: string) => api.get(`/dashboard/attendance?period=${period}`),
  getLeaveDistribution: () => api.get("/dashboard/leave-distribution"),
  getPendingApprovals: () => api.get("/dashboard/pending-approvals"),
  getRecentActivity: () => api.get("/dashboard/recent-activity"),
};

export default api;
