"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/utils/AuthContext";
import { 
  HiOutlineViewGrid, 
  HiOutlineDocumentText, 
  HiOutlineClipboardList, 
  HiOutlineLogout,
  HiChevronLeft,
  HiChevronRight,
  HiUserCircle
} from "react-icons/hi";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // 1. Use the new 'user' and 'hasPermission' from AuthContext
  const { user, logout, hasPermission } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(false);

  // 2. Define menu items based on "Permissions" rather than hardcoded roles
  // This is more optimal for your service-based architecture
  const menuItems = [
    {
      title: "Sanjvik Panel",
      icon: <HiOutlineDocumentText className="w-6 h-6" />,
      path: "/sanjvik",
      requiredPermission: "sanjvik:view", 
    },
    {
      title: "OM Logistics Panel",
      icon: <HiOutlineViewGrid className="w-6 h-6" />,
      path: "/omlogistics",
      requiredPermission: "omlogistics:view",
    },
    {
      title: "Forms & Enquiries",
      icon: <HiOutlineClipboardList className="w-6 h-6" />,
      path: "/forms",
      requiredPermission: "forms:read", // Base permission to see the forms section
    },
    {
    title: "User Management",
    icon: <HiUserCircle className="w-6 h-6" />,
    path: "/admin",
    requiredPermission: "roles:manage", // Only SuperAdmin or those with this perm see this
},
  ];

  // 3. Filter the menu using the hasPermission helper
  const filteredMenu = menuItems.filter((item) => hasPermission(item.requiredPermission));

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#001F39] text-white transition-all duration-300 flex flex-col z-50`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700 min-h-[80px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-white p-1 rounded-lg shrink-0">
              <Image 
                src="/assets/Om.png" 
                alt="OLSC Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col animate-in fade-in duration-500">
                <span className="font-black text-lg tracking-tighter leading-none">OLSC</span>
                <span className="text-[10px] font-bold text-[#EE222F] uppercase tracking-[0.2em]">Panel</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className={`p-1 hover:bg-gray-700 rounded transition-colors ${!isSidebarOpen && "hidden md:block"}`}
          >
            {isSidebarOpen ? <HiChevronLeft className="w-6 h-6" /> : <HiChevronRight className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex-grow mt-6 px-3 space-y-2">
          {filteredMenu.map((item) => (
            <Link key={item.path} href={item.path} 
              className={`flex items-center p-3 rounded-lg transition-all ${router.asPath.startsWith(item.path) ? "bg-[#EE222F] text-white shadow-lg shadow-red-900/20" : "hover:bg-gray-800 text-gray-300"}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {isSidebarOpen && <span className="ml-4 font-medium whitespace-nowrap animate-in slide-in-from-left-2">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <button onClick={logout} className="p-4 flex items-center text-gray-400 hover:text-white hover:bg-red-900/30 transition-all border-t border-gray-700">
          <HiOutlineLogout className="w-6 h-6 shrink-0" />
          {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
        </button>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="hidden md:block text-sm font-semibold text-gray-400 uppercase tracking-widest ml-2">
              Management System
            </h2>
          </div>

          <div className="relative">
            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
              <HiUserCircle className="w-9 h-9 text-[#0D5BAA]" />
              <div className="hidden md:block text-left">
                {/* 4. Display the dynamic fullName and Role name */}
                <p className="text-sm font-black text-gray-800 leading-none capitalize">
                  {user?.fullName || "Operator"}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">
                  {user?.role === 'SuperAdmin' ? 'System Admin' : 'Panel Manager'}
                </p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-2 border-b border-gray-50 mb-2">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Employee ID</p>
                  <p className="text-xs font-bold text-gray-600 mt-1 truncate">
                    {user?.userName}@olsc.in
                  </p>
                </div>
                <button onClick={logout} className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                  <HiOutlineLogout className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/50">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};