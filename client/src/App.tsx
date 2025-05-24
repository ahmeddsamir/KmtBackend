import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Employees from "@/pages/employees";
import Attendance from "@/pages/attendance";
import LeaveManagement from "@/pages/leave-management";
import Missions from "@/pages/missions";
import Policies from "@/pages/policies";
import Reports from "@/pages/reports";
import { useAuth } from "./lib/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, requiredRoles = [], ...rest }: any) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, requiredRoles, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to dashboard if authenticated and on login page
    if (isAuthenticated && location === "/login") {
      setLocation("/dashboard");
    }
    // Redirect to login if not authenticated and not on login page
    if (!isAuthenticated && location !== "/login") {
      setLocation("/login");
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/employees">
        <ProtectedRoute 
          component={Employees} 
          requiredRoles={["General Manager", "HR Manager"]} 
        />
      </Route>
      <Route path="/attendance">
        <ProtectedRoute component={Attendance} />
      </Route>
      <Route path="/leave-management">
        <ProtectedRoute component={LeaveManagement} />
      </Route>
      <Route path="/missions">
        <ProtectedRoute component={Missions} />
      </Route>
      <Route path="/policies">
        <ProtectedRoute 
          component={Policies} 
          requiredRoles={["General Manager", "HR Manager"]} 
        />
      </Route>
      <Route path="/reports">
        <ProtectedRoute 
          component={Reports} 
          requiredRoles={["General Manager"]} 
        />
      </Route>
      <Route path="/">
        {isAuthenticated ? (
          <ProtectedRoute component={Dashboard} />
        ) : (
          <Login />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
