"use client";

import React from "react";
import { useRouter } from "next/router";
import { FormCard } from "@/components/FormCard";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

export const FormSelectionPanel = () => {
  const router = useRouter();

  const formConfig = [
    {
      key: "enquiry",
      title: "Enquiry Forms",
      description: "Centralized management of customer service and service-specific queries.",
    },
    {
      key: "retail_and_franchise",
      title: "Retail and Franchise Forms",
      description: "Submission tracking and analytics for retail and Franchise Forms.",
    },
    {
      key: "career",
      title: "Career Forms",
      description: "Recruitment portal data and employment inquiry processing.",
    },
    {
      key: "institute",
      title: "Institute Forms",
      description: "Om Institute joining Forms management.",
    },
    {
      key: "pickup",
      title: "Pickup Request Forms",
      description: "Pickup Request form entries",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto w-full px-8 py-12">
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all mb-16"
        >
          <HiOutlineArrowNarrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Dashboard
        </button>

        <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-extralight text-slate-900 tracking-tighter mb-4">
            Form <span className="font-medium">Management</span>
          </h1>
          <div className="flex items-center gap-4 w-48 mb-6">
            <div className="h-[1px] flex-1 bg-gray-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          </div>
          <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">
            Select module to process submissions
          </p>
        </div>

        <div className="flex flex-wrap gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {formConfig.map((form) => (
            <FormCard
              key={form.key}
              title={form.title}
              description={form.description}
              imageUrl="/assets/Om.png"
              onClick={() => {
                if (form.key === "enquiry") router.push("/enquiry");
                else if (form.key === "retail_and_franchise") router.push("/applications");
                else if (form.key === "career") router.push("/careers");
                else if (form.key === "institute") router.push("/institutes");
                else if (form.key === "pickup") router.push("/pickup");
                else console.log(form.key);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};