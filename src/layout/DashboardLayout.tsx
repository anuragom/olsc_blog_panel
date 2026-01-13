// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { useAuth } from "@/utils/AuthContext";
// import { 
//   HiOutlineViewGrid, 
//   HiOutlineDocumentText, 
//   HiOutlineClipboardList, 
//   HiOutlineLogout,
//   HiChevronLeft,
//   HiChevronRight,
//   HiUserCircle
// } from "react-icons/hi";

// export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   const { userRole, logout } = useAuth();
//   const router = useRouter();
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isProfileOpen, setProfileOpen] = useState(false);

//   const menuItems = [
//     {
//       title: "Sanjvik Panel",
//       icon: <HiOutlineDocumentText className="w-6 h-6" />,
//       path: "/sanjvik",
//       roles: ["SuperAdmin", "sanjvikAdmin"],
//     },
//     {
//       title: "OM Logistics Panel",
//       icon: <HiOutlineViewGrid className="w-6 h-6" />,
//       path: "/omlogistics",
//       roles: ["SuperAdmin", "olscAdmin"],
//     },
//     {
//       title: "Forms",
//       icon: <HiOutlineClipboardList className="w-6 h-6" />,
//       path: "/forms",
//       roles: ["SuperAdmin", "olscAdmin"],
//     },
//   ];

//   const filteredMenu = menuItems.filter((item) => item.roles.includes(userRole as string));

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
//       {/* Sidebar */}
//       <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#001F39] text-white transition-all duration-300 flex flex-col z-50`}>
//         <div className="p-6 flex items-center justify-between border-b border-gray-700">
//           <span className={`${!isSidebarOpen && "hidden"} font-bold text-xl tracking-wider`}>OLSC PANEL</span>
//           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded transition-colors">
//             {isSidebarOpen ? <HiChevronLeft className="w-6 h-6" /> : <HiChevronRight className="w-6 h-6" />}
//           </button>
//         </div>

//         <nav className="flex-grow mt-6 px-3 space-y-2">
//           {filteredMenu.map((item) => (
//             <Link key={item.path} href={item.path} 
//               className={`flex items-center p-3 rounded-lg transition-all ${router.asPath === item.path ? "bg-[#EE222F] text-white" : "hover:bg-gray-800 text-gray-300"}`}
//             >
//               {item.icon}
//               <span className={`${!isSidebarOpen && "hidden"} ml-4 font-medium`}>{item.title}</span>
//             </Link>
//           ))}
//         </nav>

//         <button onClick={logout} className="p-4 flex items-center text-gray-400 hover:text-white hover:bg-red-900/30 transition-all border-t border-gray-700">
//           <HiOutlineLogout className="w-6 h-6" />
//           <span className={`${!isSidebarOpen && "hidden"} ml-4 font-medium`}>Logout</span>
//         </button>
//       </aside>

//       {/* Main Container */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Navbar */}
//         <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Back">
//               <HiChevronLeft className="w-6 h-6 text-gray-600" />
//             </button>
//             <button onClick={() => window.history.forward()} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Next">
//               <HiChevronRight className="w-6 h-6 text-gray-600" />
//             </button>
//           </div>

//           <div className="relative">
//             <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
//               <HiUserCircle className="w-8 h-8 text-[#0D5BAA]" />
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-bold text-gray-800 leading-none capitalize">{userRole}</p>
//                 <p className="text-xs text-gray-500 mt-1">Administrator</p>
//               </div>
//             </button>

//             {isProfileOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 py-2">
//                 <div className="px-4 py-2 border-b mb-1">
//                   <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest">Account</p>
//                 </div>
//                 <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50">
//           <div className="w-full h-full">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };



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
        <div className="p-4 flex items-center justify-between border-b border-gray-700 min-h-[80px]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Logo container */}
            <div className="bg-white p-1 rounded-lg shrink-0">
              <Image 
                src="/assets/Om.png" 
                alt="OLSC Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            {/* Branding Text */}
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
              className={`flex items-center p-3 rounded-lg transition-all ${router.asPath === item.path ? "bg-[#EE222F] text-white shadow-lg shadow-red-900/20" : "hover:bg-gray-800 text-gray-300"}`}
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
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Back">
              <HiChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button onClick={() => window.history.forward()} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Next">
              <HiChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="hidden md:block text-sm font-semibold text-gray-400 uppercase tracking-widest ml-2">
              Management System
            </h2>
          </div>

          <div className="relative">
            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
              <HiUserCircle className="w-9 h-9 text-[#0D5BAA]" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-black text-gray-800 leading-none capitalize">{userRole}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">Administrator</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-2 border-b border-gray-50 mb-2">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Active Session</p>
                  <p className="text-xs font-bold text-gray-600 mt-1 truncate">raghav.raj@olsc.in</p>
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