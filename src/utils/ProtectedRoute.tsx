import React, { JSX } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  // While checking session, show a loading spinner or nothing
  if (loading) {
    return <p className="mt-20 text-center">Checking session...</p>;
  }

  // If not logged in and not on login page
  if (!isLoggedIn && router.pathname !== "/login") return null;

  return children;
};
