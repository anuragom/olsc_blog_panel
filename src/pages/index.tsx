"use client";

import { useAuth } from "@/utils/AuthContext";

export default function HomePage() {
  const { userRole } = useAuth();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] w-full overflow-hidden">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0D5BAA] to-[#EE222F] p-[2px] mb-4 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-xl font-bold text-[#0D5BAA]">
                {userRole?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">
              Authorized Session
            </h2>
            <p className="text-2xl font-light text-slate-800">
              {userRole === 'SuperAdmin' ? 'System Administrator' : 'Panel Manager'}
            </p>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extralight text-slate-900 tracking-tighter mb-4">
          Welcome to <span className="font-medium">OLSC</span>
        </h1>

        <div className="flex items-center gap-4 w-full max-w-xs px-10 mb-10">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gray-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#EE222F] animate-ping"></div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gray-200"></div>
        </div>

        <p className="text-slate-400 font-medium text-sm uppercase tracking-widest animate-pulse">
          Navigation Active
        </p>
      </div>

      <div className="absolute bottom-10 left-10 w-20 h-[1px] bg-gray-200"></div>
      <div className="absolute bottom-10 left-10 h-20 w-[1px] bg-gray-200"></div>
    </div>
  );
}