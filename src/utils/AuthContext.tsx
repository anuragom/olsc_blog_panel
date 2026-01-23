// import { useRouter } from "next/router";
// import type { ReactNode } from "react";
// import { createContext, useContext, useEffect, useState } from "react";

// import axiosInstance from "./axiosInstance";

// export type UserRole = 'SuperAdmin' | 'sanjvikAdmin' | 'olscAdmin' | null;
// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: (_userName: string, _password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   userRole: UserRole;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState<UserRole>(null);
//   const router = useRouter();

//   const fetchUser = async (): Promise<UserRole> => {
//     try {
//       const response = await axiosInstance.get("/auth/me");
//       const role = response.data.user.role as UserRole;
//       setUserRole(role);
//       return role;
//     } catch (err) {
//       console.error("Failed to fetch user details:", err);
//       setUserRole(null);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         await axiosInstance.post("/auth/refresh-token", {});
//         setIsLoggedIn(true);
//         await fetchUser();
//       } catch (err) {
//         console.warn("Session expired or not logged in");
//         setIsLoggedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkSession();
//   }, []);

//   const login = async (userName: string, password: string) => {
//     try {
//       const response = await axiosInstance.post("/auth/login", {
//         userName,
//         password,
//       });
//       if (response.status === 200) {
//         setIsLoggedIn(true);
//         await fetchUser();
//         router.push("/");
//       }
//     } catch (err: any) {
//       console.error("Login failed:", err.response?.data || err.message);
//       alert("Invalid username or password");
//     }
//   };

//   const logout = async () => {
//     try {
//       await axiosInstance.post("/auth/logout", {});
//       alert("✅ Successfully Logged Out");
//     } catch (err) {
//       console.warn("Logout request failed:", err);
//     } finally {
//       setIsLoggedIn(false);
//       setUserRole(null);
//       router.push("/login");
//     }
//   };

//   // If refresh failed inside interceptor → logout
//   axiosInstance.interceptors.response.use(
//     (res) => res,
//     (err) => {
//       if (err.response?.status === 401) {
//         logout(); // Logout user if refresh also fails
//       }
//       return Promise.reject(err);
//     },
//   );

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, loading , userRole}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used inside AuthProvider");
//   return context;
// };






import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "./axiosInstance";

export type UserRole = 'SuperAdmin' | 'sanjvikAdmin' | 'olscAdmin' | string | null;

interface UserData {
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



