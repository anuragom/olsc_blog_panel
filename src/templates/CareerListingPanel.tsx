// "use client";

// import React, { useState, useEffect } from "react";
// import axiosInstance from "@/utils/axiosInstance";
// import { useAuth } from "@/utils/AuthContext";
// import { HiOutlineDownload, HiX, HiOutlineMail, HiOutlinePhone, HiXCircle, HiOutlineClipboardCopy, HiOutlineBriefcase } from "react-icons/hi";
// import { LiaIdCard } from "react-icons/lia";
// import { toast } from "react-hot-toast";

// interface CareerApp {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobile: string;
//   position: string;
//   totalExperience: string;
//   status: string;
//   employeeStatus: string;
//   currentCTC?: string;
//   expectedCTC?: string;
//   immediateStart: string;
//   relocation: string;
//   jobId?: any;
//   createdAt: string;
// }

// export const CareerListingPanel = ({ onBack, onManageJobs }: { onBack: () => void, onManageJobs: () => void }) => {
//   const { userRole } = useAuth();
//   const [data, setData] = useState<CareerApp[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedApp, setSelectedApp] = useState<CareerApp | null>(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const today = new Date().toISOString().split("T")[0];

//   const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: "10",
//         ...(statusFilter && { status: statusFilter }),
//         ...(startDate && { startDate }),
//         ...(endDate && { endDate }),
//         ...(searchTerm && { search: searchTerm }),
//       });
//       const res = await axiosInstance.get(`/forms/careers?${params.toString()}`);
//       setData(res.data.data);
//       setTotalPages(res.data.pagination.totalPages);
//       setCurrentPage(res.data.pagination.page);
//     } catch (error) {
//       toast.error("Failed to load applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => fetchData(1), 500);
//     return () => clearTimeout(delay);
//   }, [searchTerm, statusFilter, startDate, endDate]);

//   const fetchAppDetails = async (id: string) => {
//     try {
//       const res = await axiosInstance.get(`/forms/careers/${id}`);
//       setSelectedApp(res.data.data || res.data);
//     } catch (error) {
//       toast.error("Could not fetch details");
//     }
//   };

//   const handleDownload = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/careers/${id}/download`, "_blank");
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Job ID copied to clipboard!");
//   };

//   const updateStatus = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
//     e.stopPropagation();
//     try {
//       await axiosInstance.patch(`/forms/careers/${id}/status`, { status: e.target.value });
//       toast.success("Status Updated");
//       fetchData(currentPage);
//     } catch (error) {
//       toast.error("Update failed");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'rejected': return 'bg-red-50 text-red-600';
//       case 'shortlisted': return 'bg-green-50 text-green-600';
//       case 'contacted': return 'bg-orange-50 text-orange-600';
//       default: return 'bg-blue-50 text-blue-600';
//     }
//   };

//   const clearDates = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <div className="min-h-screen bg-white p-8 relative">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 flex items-center gap-2 transition-colors">
//               ← Back to Selection
//             </button>
//             <h1 className="text-5xl font-extralight text-slate-900 tracking-tighter">
//               Career <span className="font-medium text-blue-600">Applications</span>
//             </h1>
//           </div>
//           <button onClick={onManageJobs} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
//             Manage Job Postings
//           </button>
//         </div>

//         <div className="flex flex-wrap gap-4 mb-8">
//           <input 
//             placeholder="Search candidate name, email or mobile..." 
//             className="flex-1 min-w-[300px] px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select 
//             className="px-8 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 cursor-pointer"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All Pipeline</option>
//             <option value="new">New Entry</option>
//             <option value="reviewed">Reviewed</option>
//             <option value="shortlisted">Shortlisted</option>
//             <option value="contacted">Contacted</option>
//             <option value="rejected">Rejected</option>
//           </select>

//           <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range:</span>
//             <input 
//               type="date" 
//               value={startDate}
//               max={today}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="bg-white px-2 py-1 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-slate-300 text-[10px] font-black uppercase">To</span>
//             <input 
//               type="date" 
//               value={endDate}
//               max={today}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="bg-white px-2 py-1 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {(startDate || endDate) && (
//               <button onClick={clearDates} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
//                 <HiXCircle size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
//               <tr>
//                 <th className="px-8 py-5">Candidate</th>
//                 <th className="px-8 py-5">Position</th>
//                 <th className="px-8 py-5">Experience</th>
//                 <th className="px-8 py-5">Status</th>
//                 <th className="px-8 py-5 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {loading ? (
//                 <tr><td colSpan={5} className="py-24 text-center text-slate-400 animate-pulse font-bold tracking-widest text-xs uppercase">Syncing Applications...</td></tr>
//               ) : data.length === 0 ? (
//                 <tr><td colSpan={5} className="py-24 text-center text-slate-400 italic">No records found matching filters.</td></tr>
//               ) : data.map((app) => (
//                 <tr key={app._id} onClick={() => fetchAppDetails(app._id)} className="group hover:bg-blue-50/30 cursor-pointer transition-all">
//                   <td className="px-8 py-6">
//                     <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{app.firstName} {app.lastName}</div>
//                     <div className="text-[11px] text-slate-400 font-medium">{app.email}</div>
//                   </td>
//                   <td className="px-8 py-6">
//                     <div className="flex flex-col gap-1">
//                         <span className="text-sm text-slate-600 font-bold uppercase tracking-tight">{app.position}</span>
//                         {/* Job ID Tag */}
//                         {app.jobId && (
//                             <span className="w-fit flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded-md border border-indigo-100">
//                                 <HiOutlineBriefcase /> Job Portal Lead
//                             </span>
//                         )}
//                     </div>
//                   </td>
//                   <td className="px-8 py-6 text-sm text-slate-500 font-medium">{app.totalExperience} Yrs</td>
//                   <td className="px-8 py-6">
//                     {userRole === "SuperAdmin" ? (
//                       <select 
//                         value={app.status} 
//                         onClick={(e) => e.stopPropagation()} 
//                         onChange={(e) => updateStatus(e, app._id)} 
//                         className="text-[10px] font-black uppercase tracking-tighter border-none bg-white shadow-sm ring-1 ring-slate-100 text-blue-600 rounded-lg px-3 py-1.5 cursor-pointer"
//                       >
//                         <option value="new">NEW</option>
//                         <option value="reviewed">REVIEWED</option>
//                         <option value="shortlisted">SHORTLISTED</option>
//                         <option value="contacted">CONTACTED</option>
//                         <option value="rejected">REJECTED</option>
//                       </select>
//                     ) : (
//                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${getStatusColor(app.status)}`}>
//                         {app.status}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-8 py-6 text-right">
//                     <button onClick={(e) => handleDownload(e, app._id)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
//                       <HiOutlineDownload size={22} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="mt-10 flex items-center justify-between px-6">
//           <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
//             Page <span className="text-slate-900 font-bold">{currentPage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
//           </p>
//           <div className="flex gap-3">
//             <button disabled={currentPage === 1} onClick={() => fetchData(currentPage - 1)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm">
//               Previous
//             </button>
//             <button disabled={currentPage === totalPages} onClick={() => fetchData(currentPage + 1)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm">
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//       {selectedApp && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
//           <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
//             <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all z-10"><HiX size={24} /></button>
//             <div className="p-10 md:p-14 text-slate-900">
//               <div className="mb-10">
//                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 italic">Dossier #{selectedApp._id.slice(-6)}</p>
//                 <h2 className="text-4xl font-bold tracking-tight">{selectedApp.firstName} <span className="font-light text-slate-400">{selectedApp.lastName}</span></h2>
//                 <div className="flex flex-wrap gap-6 mt-6 text-slate-500 text-sm font-bold">
//                    <span className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors cursor-default"><HiOutlineMail className="text-blue-500" /> {selectedApp.email}</span>
//                    <span className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors cursor-default"><HiOutlinePhone className="text-blue-500" /> {selectedApp.mobile}</span>
                   
//                    {selectedApp.jobId && (
//                     <button 
//                         onClick={() => copyToClipboard(typeof selectedApp.jobId === 'object' ? selectedApp.jobId._id : selectedApp.jobId)}
//                         className="group flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-all"
//                     >
//                         <LiaIdCard className="text-blue-500 group-hover:text-indigo-500 transition-colors" /> 
//                         <span className="underline decoration-slate-200 group-hover:decoration-indigo-200">
//                             ID: {typeof selectedApp.jobId === 'object' ? selectedApp.jobId._id : selectedApp.jobId}
//                         </span>
//                         <HiOutlineClipboardCopy className="opacity-0 group-hover:opacity-100 transition-opacity" />
//                     </button>
//                    )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 pt-10">
//                 <div className="space-y-8">
//                   <section>
//                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Professional Information</h4>
//                     <div className="space-y-4">
//                       <div><p className="text-[10px] font-bold text-slate-400 uppercase">Target Role</p><p className="text-xl font-bold">{selectedApp.position}</p></div>
//                       <div><p className="text-[10px] font-bold text-slate-400 uppercase">Experience Level</p><p className="text-xl font-bold">{selectedApp.totalExperience} Years</p></div>
//                       <div>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase">Employment Status</p>
//                         <p className="text-sm font-bold capitalize text-slate-700 bg-slate-50 px-3 py-1 rounded-lg w-fit mt-1">{selectedApp.employeeStatus}</p>
//                       </div>
//                     </div>
//                   </section>

//                   <section>
//                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Logistics</h4>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div><p className="text-[10px] font-bold text-slate-400 uppercase">Immediate Start</p><p className="font-bold uppercase text-slate-700">{selectedApp.immediateStart}</p></div>
//                         <div><p className="text-[10px] font-bold text-slate-400 uppercase">Can Relocate</p><p className="font-bold uppercase text-slate-700">{selectedApp.relocation}</p></div>
//                     </div>
//                   </section>
//                 </div>

//                 <div className="space-y-8">
//                   <section>
//                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Financials & Workflow</h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div><p className="text-[10px] font-bold text-slate-400 uppercase">Current CTC</p><p className="text-sm font-bold text-slate-700">{selectedApp.currentCTC || "N/A"} LPA</p></div>
//                       <div><p className="text-[10px] font-bold text-slate-400 uppercase">Expected CTC</p><p className="text-sm font-bold text-slate-700">{selectedApp.expectedCTC || "N/A"} LPA</p></div>
//                     </div>
//                     <div className="mt-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
//                         <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Recruitment Action</p>
//                         <button 
//                             onClick={(e) => handleDownload(e as any, selectedApp._id)} 
//                             className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
//                         >
//                             <HiOutlineDownload /> Download Resume
//                         </button>
//                     </div>
//                   </section>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import { 
  HiOutlineDownload, 
  HiX, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiXCircle, 
  HiOutlineClipboardCopy, 
  HiOutlineBriefcase,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";
import { LiaIdCard } from "react-icons/lia";
import { toast } from "react-hot-toast";

interface CareerApp {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  position: string;
  totalExperience: string;
  status: string;
  employeeStatus: string;
  currentCTC?: string;
  expectedCTC?: string;
  immediateStart: string;
  relocation: string;
  jobId?: any;
  createdAt: string;
  processingStatus: 'pending' | 'completed' | 'failed' | 'stuck';
  processingError?: string;

}

export const CareerListingPanel = ({ onBack, onManageJobs }: { onBack: () => void, onManageJobs: () => void }) => {
  const { userRole } = useAuth();
  const [data, setData] = useState<CareerApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuccesses, setTotalSuccesses] = useState(1);
  const [totalFailures, setTotalFailures] = useState(1);
  const [selectedApp, setSelectedApp] = useState<CareerApp | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(searchTerm && { search: searchTerm }),
      });
      const res = await axiosInstance.get(`/forms/careers?${params.toString()}`);
      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setCurrentPage(res.data.pagination.page);
      setTotalSuccesses(res.data.pagination.totalSuccesses || 0);
      setTotalFailures(res.data.pagination.totalFailures || 0);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // CSV DOWNLOAD LOGIC
  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const headers = [
      "Applied Date", "Full Name", "Email", "Phone", "Position", 
      "Experience", "Emp Status", "Current CTC", "Expected CTC", 
      "Immediate Start", "Relocation", "Job ID", "Status"
    ];
    
    const csvRows = data.map(item => [
      new Date(item.createdAt).toLocaleDateString(),
      `"${((item.firstName || "") + " " + (item.lastName || "")).replace(/"/g, '""')}"`,
      item.email || "",
      item.mobile || "",
      `"${(item.position || "").replace(/"/g, '""')}"`,
      item.totalExperience || "0",
      item.employeeStatus || "",
      item.currentCTC || "N/A",
      item.expectedCTC || "N/A",
      item.immediateStart || "",
      item.relocation || "",
      typeof item.jobId === 'object' ? item.jobId?._id : (item.jobId || "Direct"),
      item.status || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Career_Apps_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Downloaded Successfully");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter, startDate, endDate]);

  const fetchAppDetails = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/forms/careers/${id}`);
      setSelectedApp(res.data.data || res.data);
    } catch (error) {
      toast.error("Could not fetch details");
    }
  };

  const handleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    window.open(`http://blogspaneluat.omlogistics.co.in/api/forms/careers/${id}/download`, "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Job ID copied to clipboard!");
  };

  const updateStatus = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    e.stopPropagation();
    try {
      await axiosInstance.patch(`/forms/careers/${id}/status`, { status: e.target.value });
      toast.success("Status Updated");
      fetchData(currentPage);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'rejected': return 'bg-red-50 text-red-600';
      case 'shortlisted': return 'bg-green-50 text-green-600';
      case 'contacted': return 'bg-orange-50 text-orange-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 flex items-center gap-2 transition-colors">
              ← Back to Selection
            </button>
            <h1 className="text-5xl font-extralight text-slate-900 tracking-tighter">
              Career <span className="font-medium text-blue-600">Applications</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                Total Success
              </p>
              <h2 className="text-3xl font-bold text-slate-900 bg-green-50 px-4 py-2 rounded-2xl inline-block">
                {totalSuccesses}
              </h2>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                Total Failures
              </p>
              <h2 className="text-3xl font-bold text-slate-900 bg-red-50 px-4 py-2 rounded-2xl inline-block">
                {totalFailures}
              </h2>
            </div>
            {/* Download CSV Button */}
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
            >
              <HiOutlineDownload size={20} />
              Export CSV
            </button>

            <button onClick={onManageJobs} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
              Manage Job Postings
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-slate-50/50 p-4 rounded-[2.5rem] border border-slate-100">
          <input 
            placeholder="Search candidate, email or mobile..." 
            className="flex-1 min-w-[250px] px-6 py-3.5 bg-white border-none rounded-2xl outline-none text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-6 py-3.5 bg-white border-none rounded-2xl outline-none font-bold text-slate-600 cursor-pointer shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="new">New Entry</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r pr-3 border-slate-100">Date Range</span>
            <input type="date" value={startDate} max={today} onChange={(e) => setStartDate(e.target.value)} className="text-xs font-bold text-slate-600 outline-none" />
            <span className="text-slate-300 text-[10px] font-black uppercase">To</span>
            <input type="date" value={endDate} max={today} onChange={(e) => setEndDate(e.target.value)} className="text-xs font-bold text-slate-600 outline-none" />
            {(startDate || endDate) && (
              <button onClick={clearDates} className="text-red-400 hover:text-red-600 ml-1 transition-colors">
                <HiXCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Candidate</th>
                <th className="px-8 py-5">Position</th>
                <th className="px-8 py-5">Experience</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Processing Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 animate-pulse font-bold tracking-widest text-xs uppercase">Syncing Applications...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 italic">No records found matching filters.</td></tr>
              ) : data.map((app) => (
                <tr key={app._id} onClick={() => fetchAppDetails(app._id)} className="group hover:bg-blue-50/30 cursor-pointer transition-all">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{app.firstName} {app.lastName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{app.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-slate-600 font-bold uppercase tracking-tight">{app.position}</span>
                        {app.jobId && (
                            <span className="w-fit flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded-md border border-indigo-100">
                                <HiOutlineBriefcase /> Job Portal Lead
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">{app.totalExperience} Yrs</td>
                  <td className="px-8 py-6">
                    {userRole === "SuperAdmin" ? (
                      <select 
                        value={app.status} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => updateStatus(e, app._id)} 
                        className="text-[10px] font-black uppercase tracking-tighter border-none bg-white shadow-sm ring-1 ring-slate-100 text-blue-600 rounded-lg px-3 py-1.5 cursor-pointer"
                      >
                        <option value="new">NEW</option>
                        <option value="reviewed">REVIEWED</option>
                        <option value="shortlisted">SHORTLISTED</option>
                        <option value="rejected">REJECTED</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {app.processingStatus
                      ? app.processingStatus.toUpperCase()
                      : "COMPLETED"}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={(e) => handleDownload(e, app._id)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                      <HiOutlineDownload size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-between px-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Page <span className="text-slate-900 font-bold">{currentPage}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
          </p>
          <div className="flex gap-3">
            <button disabled={currentPage === 1} onClick={() => fetchData(currentPage - 1)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm">
              <HiChevronLeft className="inline mb-0.5" /> Previous
            </button>
            <button disabled={currentPage === totalPages} onClick={() => fetchData(currentPage + 1)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm">
              Next <HiChevronRight className="inline mb-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all z-10"><HiX size={24} /></button>
            <div className="p-10 md:p-14 text-slate-900">
              <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 italic">Dossier #{selectedApp._id.slice(-6)}</p>
                <h2 className="text-4xl font-bold tracking-tight">{selectedApp.firstName} <span className="font-light text-slate-400">{selectedApp.lastName}</span></h2>
                <div className="flex flex-wrap gap-6 mt-6 text-slate-500 text-sm font-bold">
                   <span className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors cursor-default"><HiOutlineMail className="text-blue-500" /> {selectedApp.email}</span>
                   <span className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors cursor-default"><HiOutlinePhone className="text-blue-500" /> {selectedApp.mobile}</span>
                   
                   {selectedApp.jobId && (
                    <button 
                        onClick={() => copyToClipboard(typeof selectedApp.jobId === 'object' ? selectedApp.jobId._id : selectedApp.jobId)}
                        className="group flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-all"
                    >
                        <LiaIdCard className="text-blue-500 group-hover:text-indigo-500 transition-colors" /> 
                        <span className="underline decoration-slate-200 group-hover:decoration-indigo-200">
                            ID: {typeof selectedApp.jobId === 'object' ? selectedApp.jobId._id : selectedApp.jobId}
                        </span>
                        <HiOutlineClipboardCopy className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 pt-10">
                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Professional Information</h4>
                    <div className="space-y-4">
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Target Role</p><p className="text-xl font-bold">{selectedApp.position}</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Experience Level</p><p className="text-xl font-bold">{selectedApp.totalExperience} Years</p></div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Employment Status</p>
                        <p className="text-sm font-bold capitalize text-slate-700 bg-slate-50 px-3 py-1 rounded-lg w-fit mt-1">{selectedApp.employeeStatus}</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Logistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-[10px] font-bold text-slate-400 uppercase">Immediate Start</p><p className="font-bold uppercase text-slate-700">{selectedApp.immediateStart}</p></div>
                        <div><p className="text-[10px] font-bold text-slate-400 uppercase">Can Relocate</p><p className="font-bold uppercase text-slate-700">{selectedApp.relocation}</p></div>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Financials & Workflow</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Current CTC</p><p className="text-sm font-bold text-slate-700">{selectedApp.currentCTC || "N/A"} LPA</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Expected CTC</p><p className="text-sm font-bold text-slate-700">{selectedApp.expectedCTC || "N/A"} LPA</p></div>
                    </div>
                    <div className="mt-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <button 
                            onClick={(e) => handleDownload(e as any, selectedApp._id)} 
                            className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
                        >
                            <HiOutlineDownload /> Download Resume
                        </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};