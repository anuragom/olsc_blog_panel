'use client';

import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiMailLine } from "react-icons/ri";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(userName, password);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Left Side: Information Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#074B83] p-16 lg:flex">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
        </div>
        
        <div></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* <div className="bg-white p-10 rounded-[3rem] shadow-2xl mb-10 transition-transform hover:scale-105 duration-500">
            <Image 
              src="/assets/Om.png" 
              alt="Logo" 
              width={350} // Increased size
              height={350} // Increased size
              className="object-contain scale-110" 
              priority
            />
          </div> */}
         <div className="bg-white w-[450px] aspect-[30/20] rounded-[3rem] shadow-2xl mb-10 transition-transform hover:scale-105 duration-500 overflow-hidden flex items-center justify-center border-[12px] border-white/10">
    <Image 
      src="/assets/Om.png" 
      alt="Logo" 
      width={600} 
      height={600} 
      className="object-contain scale-[1.4] transform-gpu" 
      priority
    />
  </div>
          <h1 className="text-4xl font-black leading-tight text-white tracking-tighter">
    Welcome to the
  </h1>

  {/* Single Line Heading with Styled (EMS) */}
  <p className="mt-2 text-4xl text-white leading-tight font-black tracking-tighter whitespace-nowrap">
    Enquiry Management System <span className="text-[#EE222F] italic ml-2">(EMS)</span>
  </p>
          <p className="mt-4 max-w-sm text-md text-blue-100/80 leading-relaxed font-medium">
            Access all your enquiries and forms in one centralized platform.
          </p>
        </div>

        {/* Bottom Contact Info */}
        <div className="relative z-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 flex items-center justify-center gap-2">
            Need Assistance?
          </p>
          <p className="text-xs font-bold tracking-[0.2em] text-white/60 flex items-center justify-center gap-2">
  Contact Us : 
  <a 
    href="mailto:divyanshu.choudhary@olsc.in" 
    className="text-white underline decoration-red-500 underline-offset-4 italic hover:text-red-400 transition-colors"
  >
    divyanshu.choudhary@olsc.in
  </a>
</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          
          {/* Mobile Logo View (Hidden on Large screens) */}
          <div className="mb-12 flex flex-col items-center gap-4 lg:hidden text-center">
            <Image src="/assets/Om.png" alt="Logo" width={80} height={80} />
            <h2 className="text-2xl font-black text-[#074B83]">EMS PANEL</h2>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Login</h2>
            <p className="mt-3 text-slate-500 font-medium">Enter your Credential to access the EMS Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors group-focus-within:text-[#074B83]">
                EmailId
              </label>
              <div className="relative flex items-center">
                <RiMailLine className="absolute left-0 text-2xl text-slate-300 transition-colors group-focus-within:text-[#074B83]" />
                <input
                  type="text"
                  required
                  className="w-full border-b-2 border-slate-100 bg-transparent py-4 pl-10 text-lg font-semibold outline-none transition-all focus:border-[#074B83] placeholder:text-slate-200"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your Email..."
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors group-focus-within:text-[#074B83]">
                Password
              </label>
              <div className="relative flex items-center">
                <RiLockPasswordLine className="absolute left-0 text-2xl text-slate-300 transition-colors group-focus-within:text-[#074B83]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border-b-2 border-slate-100 bg-transparent py-4 pl-10 text-lg font-semibold outline-none transition-all focus:border-[#074B83] placeholder:text-slate-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-slate-400 hover:text-red-500 transition-colors"
                >
                  {showPassword ? <RiEyeOffLine size={24} /> : <RiEyeLine size={24} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-slate-900 p-1 hover:bg-slate-800 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span className="flex-1 text-center text-white tracking-[0.2em] uppercase text-xs font-black py-4">
                {loading ? "Authenticating..." : "Login to EMS"}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 group-hover:bg-red-500 transition-all duration-300 mr-1">
                 {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                 ) : (
                    <RiArrowRightLine size={24} className="text-white" />
                 )}
              </div>
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}