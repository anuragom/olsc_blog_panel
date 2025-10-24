import "../styles/global.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/utils/AuthContext";
import { ProtectedRoute } from "@/utils/ProtectedRoute";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </AuthProvider>
  );
}
