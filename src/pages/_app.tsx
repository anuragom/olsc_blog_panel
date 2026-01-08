import "../styles/global.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/utils/AuthContext";
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  const isNoLayoutPage = router.pathname === "/login";

  return (
    <AuthProvider>
      <ProtectedRoute>
        {isNoLayoutPage ? (
          <Component {...pageProps} />
        ) : (
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        )}
      </ProtectedRoute>
    </AuthProvider>
  );
}