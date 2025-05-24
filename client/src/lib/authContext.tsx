import { createContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "./api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        // Verify token hasn't expired
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // Token expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        // Invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { username, password });
      const response = await authAPI.login({ username, password });
      console.log("Login response:", response.data);
      
      // Extract token from response
      const token = response.data.token || response.data.accessToken || response.data.jwtToken;
      
      if (!token) {
        throw new Error("No token received from server");
      }
      
      // Decode token to get user info
      const decodedToken: any = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      
      // Extract user info from token claims or response
      const user = {
        id: decodedToken.nameid || decodedToken.sub || response.data.id || "unknown",
        name: decodedToken.name || response.data.name || username,
        username: username,
        role: decodedToken.role || response.data.role || "Employee"
      };
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
