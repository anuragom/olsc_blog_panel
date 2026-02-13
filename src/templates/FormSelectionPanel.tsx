// "use client";

// import React, { useMemo } from "react";
// import { useRouter } from "next/router";
// import { FormCard } from "@/components/FormCard";
// import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
// import { useAuth } from "@/utils/AuthContext";

// export const FormSelectionPanel = () => {
//   const router = useRouter();
//   const { hasPermission } = useAuth();

//   // 1. Map each form module to its required permission
//   const formConfig = useMemo(() => [
//     {
//       key: "enquiry",
//       title: "Enquiry Forms",
//       description: "Centralized management of customer service and service-specific queries.",
//       requiredPermission: "enquiry:read",
//       route: "/enquiry"
//     },
//     {
//       key: "retail_and_franchise",
//       title: "Retail and Franchise Forms",
//       description: "Submission tracking and analytics for retail and Franchise Forms.",
//       requiredPermission: "retails:read", 
//       route: "/applications"
//     },
//     {
//       key: "career",
//       title: "Career Forms",
//       description: "Recruitment portal data and employment inquiry processing.",
//       requiredPermission: "career:read",
//       route: "/careers"
//     },
//     {
//       key: "institute",
//       title: "Institute Forms",
//       description: "Om Institute joining Forms management.",
//       requiredPermission: "institute:read",
//       route: "/institutes"
//     },
//     {
//       key: "pickup",
//       title: "Pickup Request Forms",
//       description: "Pickup Request form entries",
//       requiredPermission: "pickup:read",
//       route: "/pickup"
//     },
//   ], []);

//   // 2. Filter the cards based on user permissions
//   const visibleForms = formConfig.filter(form => hasPermission(form.requiredPermission));

//   return (
//     <div className="relative flex flex-col min-h-screen bg-white overflow-hidden">
//       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>

//       <div className="max-w-7xl mx-auto w-full px-8 py-12">
//         <button
//           onClick={() => router.push("/")}
//           className="group flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all mb-16"
//         >
//           <HiOutlineArrowNarrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
//           Dashboard
//         </button>

//         <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
//           <h1 className="text-5xl md:text-6xl font-extralight text-slate-900 tracking-tighter mb-4">
//             Form <span className="font-medium">Management</span>
//           </h1>
//           <div className="flex items-center gap-4 w-48 mb-6">
//             <div className="h-[1px] flex-1 bg-gray-200"></div>
//             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
//           </div>
//           <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">
//             Select module to process submissions
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
//           {visibleForms.length > 0 ? (
//             visibleForms.map((form) => (
//               <FormCard
//                 key={form.key}
//                 title={form.title}
//                 description={form.description}
//                 imageUrl="/assets/Om.png"
//                 onClick={() => router.push(form.route)}
//               />
//             ))
//           ) : (
//             <div className="w-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
//               <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">
//                 No modules authorized for this session
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };







"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { FormCard } from "@/components/FormCard";
import { HiOutlineArrowLeft, HiOutlineViewGrid, HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineTruck, HiOutlineClipboardList } from "react-icons/hi";
import { useAuth } from "@/utils/AuthContext";

export const FormSelectionPanel = () => {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const formConfig = useMemo(() => [
    { key: "enquiry", title: "Enquiry Management", description: "Customer service and service-specific query processing.", requiredPermission: "enquiry:read", route: "/enquiry", icon: HiOutlineViewGrid },
    { key: "retail_and_franchise", title: "Retail & Franchise", description: "Submission tracking and analytics for retail network.", requiredPermission: "retails:read", route: "/applications", icon: HiOutlineUserGroup },
    { key: "career", title: "Career Portal", description: "Recruitment data and employment inquiry processing.", requiredPermission: "career:read", route: "/careers", icon: HiOutlineClipboardList },
    { key: "institute", title: "Institute Management", description: "Om Institute joining and educational administration.", requiredPermission: "institute:read", route: "/institutes", icon: HiOutlineAcademicCap },
    { key: "pickup", title: "Logistics Pickup", description: "Shipment logistics and pickup request data processing.", requiredPermission: "pickup:read", route: "/pickup", icon: HiOutlineTruck },
  ], []);

  const visibleForms = formConfig.filter(form => hasPermission(form.requiredPermission));

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 border-t-4 border-[#074B83]">
      <div className="max-w-[1400px] mx-auto px-10 py-16">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-20 border-b border-slate-100 pb-10">
          <div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#074B83] transition-colors mb-4"
            >
              <HiOutlineArrowLeft /> Dashboard
            </button>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Form <span className="text-[#074B83]">Modules</span> <span className="text-[#EE222F] italic text-2xl font-bold ml-2">(EMS)</span>
            </h1>
          </div>
          {/* <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">System Environment</p>
             <p className="text-sm font-bold text-slate-500">v2.04 • Production Mode</p>
          </div> */}
        </div>

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 shadow-sm bg-slate-100 border border-slate-100">
          {visibleForms.length > 0 ? (
            visibleForms.map((form) => (
              <FormCard
                key={form.key}
                title={form.title}
                description={form.description}
                Icon={form.icon}
                onClick={() => router.push(form.route)}
              />
            ))
          ) : (
            <div className="col-span-full py-40 bg-white text-center">
              <p className="text-slate-300 font-black tracking-[0.4em] uppercase text-xs">Access Denied: No Authorized Modules</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};