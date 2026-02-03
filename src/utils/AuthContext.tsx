import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "./axiosInstance";

export type UserRole = 'SuperAdmin' | 'sanjvikAdmin' | 'olscAdmin' | string | null;

interface UserData {
  userId: string;
  userName: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  user: UserData | null;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper to check permissions anywhere in the app
  const hasPermission = useCallback((perm: string) => {
    if (user?.role === 'SuperAdmin' || user?.permissions.includes('*:*')) return true;
    return user?.permissions.includes(perm) || false;
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      const { userName, fullName, role, permissions } = response.data.user;
      
      // role here is now the populated object { name, permissions } from backend
      const userData: UserData = {
        userName,
        fullName,
        role: typeof role === 'object' ? role.name : role,
        permissions: typeof role === 'object' ? role.permissions : permissions || [],
        userId: response.data.user._id,   
      };

      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Silent refresh on mount
        await axiosInstance.post("/auth/refresh-token", {});
        await fetchUser();
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      await axiosInstance.post("/auth/login", { userName, password });
      await fetchUser();
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};



