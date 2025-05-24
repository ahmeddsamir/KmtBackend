import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/useAuth";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  }, [location, closeSidebar]);

  const isGeneralManagerOrHR = user?.role === "General Manager" || user?.role === "HR Manager";
  const isGeneralManager = user?.role === "General Manager";
  
  return (
    <aside 
      className={`w-64 bg-white shadow-md z-10 overflow-y-auto flex-shrink-0 transition-all duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } absolute md:relative h-full`}
    >
      <nav className="flex flex-col h-full">
        <div className="p-4">
          <div className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">Main</div>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/dashboard">
                <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location === "/dashboard" 
                    ? "active text-primary" 
                    : "text-neutral-700 hover:text-primary"
                }`}>
                  <span className={`material-icons mr-3 ${
                    location === "/dashboard" ? "text-primary" : "text-neutral-500"
                  }`}>
                    dashboard
                  </span>
                  Dashboard
                </a>
              </Link>
            </li>
            
            {isGeneralManagerOrHR && (
              <li>
                <Link href="/employees">
                  <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location === "/employees" 
                      ? "active text-primary" 
                      : "text-neutral-700 hover:text-primary"
                  }`}>
                    <span className={`material-icons mr-3 ${
                      location === "/employees" ? "text-primary" : "text-neutral-500"
                    }`}>
                      people
                    </span>
                    Employees
                  </a>
                </Link>
              </li>
            )}
            
            <li>
              <Link href="/attendance">
                <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location === "/attendance" 
                    ? "active text-primary" 
                    : "text-neutral-700 hover:text-primary"
                }`}>
                  <span className={`material-icons mr-3 ${
                    location === "/attendance" ? "text-primary" : "text-neutral-500"
                  }`}>
                    fact_check
                  </span>
                  Attendance
                </a>
              </Link>
            </li>
            
            <li>
              <Link href="/leave-management">
                <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location === "/leave-management" 
                    ? "active text-primary" 
                    : "text-neutral-700 hover:text-primary"
                }`}>
                  <span className={`material-icons mr-3 ${
                    location === "/leave-management" ? "text-primary" : "text-neutral-500"
                  }`}>
                    event_busy
                  </span>
                  Leave Management
                </a>
              </Link>
            </li>
            
            <li>
              <Link href="/missions">
                <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location === "/missions" 
                    ? "active text-primary" 
                    : "text-neutral-700 hover:text-primary"
                }`}>
                  <span className={`material-icons mr-3 ${
                    location === "/missions" ? "text-primary" : "text-neutral-500"
                  }`}>
                    assignment
                  </span>
                  Missions
                </a>
              </Link>
            </li>
          </ul>
        </div>
        
        {isGeneralManagerOrHR && (
          <div className="p-4 border-t border-neutral-200">
            <div className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">Administration</div>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/policies">
                  <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location === "/policies" 
                      ? "active text-primary" 
                      : "text-neutral-700 hover:text-primary"
                  }`}>
                    <span className={`material-icons mr-3 ${
                      location === "/policies" ? "text-primary" : "text-neutral-500"
                    }`}>
                      policy
                    </span>
                    Policies
                  </a>
                </Link>
              </li>
              
              {isGeneralManager && (
                <li>
                  <Link href="/reports">
                    <a className={`sidebar-item flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      location === "/reports" 
                        ? "active text-primary" 
                        : "text-neutral-700 hover:text-primary"
                    }`}>
                      <span className={`material-icons mr-3 ${
                        location === "/reports" ? "text-primary" : "text-neutral-500"
                      }`}>
                        bar_chart
                      </span>
                      Reports & Analytics
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div className="mt-auto p-4 border-t border-neutral-200">
          <div className="flex items-center px-4 py-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <span className="material-icons text-neutral-700">support_agent</span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-neutral-700">Need Help?</div>
              <a href="#support" className="text-xs text-primary hover:text-primary-light">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
