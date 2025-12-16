import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import axiosInstance from "./axiosInstance";

export type UserRole = 'SuperAdmin' | 'sanjvikAdmin' | 'olscAdmin' | null;
interface AuthContextType {
  isLoggedIn: boolean;
  login: (_userName: string, _password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  userRole: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();

  const fetchUser = async (): Promise<UserRole> => {
    try {
      const response = await axiosInstance.get("/auth/me");
      const role = response.data.user.role as UserRole;
      setUserRole(role);
      return role;
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setUserRole(null);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axiosInstance.post("/auth/refresh-token", {});
        setIsLoggedIn(true);
        await fetchUser();
      } catch (err) {
        console.warn("Session expired or not logged in");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        userName,
        password,
      });
      if (response.status === 200) {
        setIsLoggedIn(true);
        await fetchUser();
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid username or password");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      alert("✅ Successfully Logged Out");
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setIsLoggedIn(false);
      setUserRole(null);
      router.push("/login");
    }
  };

  // If refresh failed inside interceptor → logout
  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        logout(); // Logout user if refresh also fails
      }
      return Promise.reject(err);
    },
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading , userRole}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
