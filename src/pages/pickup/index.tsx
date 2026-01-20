import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { PickupListingPanel } from "@/templates/PickupListingPanel";

export default function PortalPage() {
  const router = useRouter();
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <PickupListingPanel onBack={() => router.push("/forms")} />
  );
}
