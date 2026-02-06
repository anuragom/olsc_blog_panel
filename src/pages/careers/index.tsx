"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { CareerListingPanel } from "@/templates/CareerListingPanel";
import { JobManagementPanel } from "@/templates/JobManagementPanel";

export default function CareerPortalPage() {
  const [view, setView] = useState<"applications" | "jobs">("applications");
  const router = useRouter();

  if (view === "jobs") {
    return <JobManagementPanel onBack={() => setView("applications")} />;
  }

  return (
    <CareerListingPanel 
      onBack={() => router.push("/forms")} 
      onManageJobs={() => setView("jobs")} 
    />
  );
}