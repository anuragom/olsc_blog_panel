"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
  const { userRole, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    {
      title: "Sanjvik Panel",
      icon: <HiOutlineDocumentText className="w-6 h-6" />,
      path: "/sanjvik",
      roles: ["SuperAdmin", "sanjvikAdmin"],
    },
    {
      title: "OM Logistics Panel",
      icon: <HiOutlineViewGrid className="w-6 h-6" />,
      path: "/omlogistics",
      roles: ["SuperAdmin", "olscAdmin"],
    },
    {
      title: "Forms",
      icon: <HiOutlineClipboardList className="w-6 h-6" />,
      path: "/forms",
      roles: ["SuperAdmin", "olscAdmin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole as string));

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#001F39] text-white transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-700">
          <span className={`${!isSidebarOpen && "hidden"} font-bold text-xl tracking-wider`}>OLSC PANEL</span>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded transition-colors">
            {isSidebarOpen ? <HiChevronLeft className="w-6 h-6" /> : <HiChevronRight className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex-grow mt-6 px-3 space-y-2">
          {filteredMenu.map((item) => (
            <Link key={item.path} href={item.path} 
              className={`flex items-center p-3 rounded-lg transition-all ${router.asPath === item.path ? "bg-[#EE222F] text-white" : "hover:bg-gray-800 text-gray-300"}`}
            >
              {item.icon}
              <span className={`${!isSidebarOpen && "hidden"} ml-4 font-medium`}>{item.title}</span>
            </Link>
          ))}
        </nav>

        <button onClick={logout} className="p-4 flex items-center text-gray-400 hover:text-white hover:bg-red-900/30 transition-all border-t border-gray-700">
          <HiOutlineLogout className="w-6 h-6" />
          <span className={`${!isSidebarOpen && "hidden"} ml-4 font-medium`}>Logout</span>
        </button>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Back">
              <HiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button onClick={() => window.history.forward()} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Next">
              <HiChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HiUserCircle className="w-8 h-8 text-[#0D5BAA]" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-800 leading-none capitalize">{userRole}</p>
                <p className="text-xs text-gray-500 mt-1">Administrator</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 py-2">
                <div className="px-4 py-2 border-b mb-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest">Account</p>
                </div>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};