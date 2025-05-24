import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-2 md:hidden text-neutral-700 hover:text-primary focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <span className="material-icons">menu</span>
          </button>
          <h1 className="text-xl font-semibold text-neutral-900">KMT HR Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="flex items-center text-neutral-700 hover:text-primary focus:outline-none" 
              aria-label="Notifications"
            >
              <span className="material-icons">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full flex items-center justify-center text-xs text-white">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 text-neutral-700 hover:text-primary focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen}
            >
              <AvatarWithInitials 
                name={user?.name || "User"} 
                size="sm"
                className="bg-primary text-white"
              />
              <span className="hidden md:block text-sm font-medium">
                {user?.name || "User"}
              </span>
              <span className="hidden md:block text-xs bg-neutral-200 px-2 py-0.5 rounded-full">
                {user?.role || "User"}
              </span>
              <span className="material-icons text-sm">arrow_drop_down</span>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <Link href="/profile">
                  <a className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                    Your Profile
                  </a>
                </Link>
                <Link href="/settings">
                  <a className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                    Settings
                  </a>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
