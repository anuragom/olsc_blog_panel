import { useRouter } from "next/router";
import { useAuth } from "@/utils/AuthContext";
import { EnquiryListingPanel } from "@/templates/EnquiryListingPanel";

export default function PortalPage() {
  const router = useRouter();
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <EnquiryListingPanel onBack={() => router.push("/forms")} />
  );
}
