import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "./axiosInstance";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try refreshing token silently
        await axiosInstance.post("/auth/refresh-token", {});
        setIsLoggedIn(true);
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
      const response = await axiosInstance.post("/auth/login", { userName, password });
      if (response.status === 200) {
        setIsLoggedIn(true);
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
    }
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
