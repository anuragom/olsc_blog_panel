import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { useEffect } from "react";
import { InstituteListingPanel } from "@/templates/InstituteListingPanel";

export default function ApplicationPortalPage() {
  const router = useRouter();
  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-bold">
        Verifying Session...
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <InstituteListingPanel onBack={() => router.push("/forms")} />
  );
}