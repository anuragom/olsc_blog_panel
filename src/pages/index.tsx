"use client";

import { useAuth } from "@/utils/AuthContext";
import Image from "next/image";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] w-full overflow-hidden font-sans">
      
      {/* Background Ambient Glow - Matching the login panel's deep blue aesthetic subtly */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        {/* The Branded Logo Box - Matching the Login Style but slightly smaller for the internal page */}
        <div className="bg-white w-[450px] aspect-[30/10] rounded-[2.5rem] shadow-2xl mb-12 overflow-hidden flex items-center justify-center border-[8px] border-slate-50 transition-transform hover:scale-105 duration-500">
          <Image 
            src="/assets/Om.png" 
            alt="Logo" 
            width={600} 
            height={600} 
            className="object-contain scale-[1] transform-gpu" 
            priority
          />
        </div>

        {/* User Identity Section */}
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Secure Authorized Session
          </h2>
          <div className="inline-block px-4 py-1.5 bg-slate-900 rounded-xl shadow-lg">
             <p className="text-xs font-black uppercase tracking-widest text-white">
                {user?.role === 'SuperAdmin' ? 'System Administrator' : 'Panel Manager'}
             </p>
          </div>
        </div>

        {/* Personalized Greeting */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
            Welcome back, <span className="text-[#074B83]">{user?.fullName.split(' ')[0]}</span>
          </h1>

          {/* Branded System Name */}
          <p className="text-xl md:text-2xl font-black text-slate-400 tracking-tight">
            Enquiry Management System <span className="text-[#EE222F] italic ml-1">(EMS)</span>
          </p>
        </div>

        {/* Decorative Active Pulse Line */}
        <div className="flex items-center gap-6 w-full max-w-md px-10 mt-12">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200"></div>
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#EE222F]"></div>
            <div className="absolute w-6 h-6 rounded-full border-2 border-[#EE222F] animate-ping opacity-20"></div>
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200"></div>
        </div>

        <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">
          Centralized Platform Active
        </p>
      </div>

      {/* Corporate Accent Elements */}
      {/* <div className="absolute top-20 right-20 flex gap-4 text-[10px] font-black text-slate-200 uppercase tracking-widest pointer-events-none">
        <span>Node_v2.04</span>
        <span>•</span>
        <span>Operational</span>
      </div> */}
    </div>
  );
}