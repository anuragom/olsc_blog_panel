// import React from "react";

// import { useState } from "react";

// import { useAuth } from "../utils/AuthContext";

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     await login(userName, password);
//     setLoading(false);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#074B83]">
//       <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
//         <h1 className="mb-6 text-center text-3xl font-bold text-[#074B83]">
//           Welcome Back
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="mb-2 block font-semibold text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#074B83]"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder="Enter your username"
//             />
//           </div>
//           <div>
//             <label className="mb-2 block font-semibold text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#074B83]"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-[#EE222F] py-2 font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-70"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { RiShieldUserLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine } from "react-icons/ri";
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
      {/* Left Panel: Immersive Brand Identity */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#074B83] p-16 lg:flex">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <Image 
                src="/assets/Om.png" 
                alt="Logo" 
                width={50} 
                height={50} 
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white leading-none">OLSC</span>
              <span className="text-xs font-bold tracking-[0.3em] text-[#EE222F] uppercase">Panel</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-7xl font-bold leading-tight text-white tracking-tighter">
            Smart <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#EE222F]">Logistics.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-300 leading-relaxed font-light">
            Welcome to the next generation of supply chain management. Oversee operations, track assets, and manage data with the OLSC Panel.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
          <span>Enterprise Grade</span>
          <span className="text-[#EE222F]">///</span>
          <span>Secure Access</span>
        </div>
      </div>

      {/* Right Panel: Workstation */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo Only */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <Image src="/assets/Om.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-black tracking-tighter text-[#074B83]">OLSC <span className="text-[#EE222F]">PANEL</span></span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Login</h2>
            <p className="mt-3 text-slate-500 font-medium">Enter your credentials to access the OLSC Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors group-focus-within:text-[#074B83]">
                Operator ID
              </label>
              <div className="relative flex items-center">
                <RiShieldUserLine className="absolute left-0 text-2xl text-slate-300 transition-colors group-focus-within:text-[#074B83]" />
                <input
                  type="text"
                  required
                  className="w-full border-b-2 border-slate-100 bg-transparent py-4 pl-10 text-lg font-semibold outline-none transition-all focus:border-[#074B83] placeholder:text-slate-200"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="USERNAME"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors group-focus-within:text-[#074B83]">
                Security Key
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
                  className="absolute right-0 text-slate-400 hover:text-[#EE222F] transition-colors"
                >
                  {showPassword ? <RiEyeOffLine size={24} /> : <RiEyeLine size={24} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
               <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 border-2 border-slate-200 rounded accent-[#074B83]" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">Keep session active</span>
               </label>
               <a href="#" className="text-xs font-black text-[#EE222F] uppercase tracking-tighter hover:opacity-80">Forgot Key?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-slate-900 p-1 hover:bg-slate-800 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span className="flex-1 text-center text-white tracking-[0.2em] uppercase text-xs font-black py-4">
                {loading ? "Authenticating..." : "Enter OLSC Panel"}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 group-hover:bg-[#EE222F] transition-all duration-300 mr-1">
                 {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                 ) : (
                    <RiArrowRightLine size={24} className="text-white" />
                 )}
              </div>
            </button>
          </form>

          <div className="mt-24 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Node_v2.04: Operational</span>
              </div>
              <span className="text-[9px] font-bold text-slate-300">© 2026 OLSC LTD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}