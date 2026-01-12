// "use client";

// import React, { useState, useEffect } from "react";
// import axiosInstance from "@/utils/axiosInstance";
// import { useAuth } from "@/utils/AuthContext";
// import { 
//   HiOutlineDownload, 
//   HiOutlineArrowLeft, 
//   HiOutlineLocationMarker, 
//   HiOutlineMail, 
//   HiOutlinePhone, 
//   HiOutlineHome, 
//   HiOutlineCalendar,
//   HiOutlineUser
// } from "react-icons/hi";

// interface Application {
//   _id: string;
//   type: 'retail_partner' | 'franchise';
//   firstName: string;
//   lastName: string;
//   email: string;
//   contactNumber: string;
//   address: string;
//   city: string;
//   state: string;
//   desiredLocation: string;
//   pincode: string;
//   vehiclesOwned: number;
//   hasOwnSpace: boolean;
//   areaSqFt: number;
//   status: string;
//   applicationFileUrl: string;
//   createdAt: string;
// }

// export const ApplicationListingPanel = ({ onBack }: { onBack: () => void }) => {
//   const { userRole } = useAuth();
//   const [data, setData] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedApp, setSelectedApp] = useState<Application | null>(null);
//   const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
//   const [typeFilter, setTypeFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [searchTerm, setSearchTerm] = useState(""); 

//   // Permission Check
//   const isSuperAdmin = userRole === "SuperAdmin";

//   const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: "10",
//         ...(typeFilter && { type: typeFilter }),
//         ...(statusFilter && { status: statusFilter }),
//         ...(searchTerm && { search: searchTerm }),
//       });

//       const response = await axiosInstance.get(`/forms/apply?${params.toString()}`);
//       setData(response.data.data);
//       setPagination(response.data.pagination);
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => fetchData(1), 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [typeFilter, statusFilter, searchTerm]);

//   const handleDownload = async (id: string, name: string) => {
//     try {
//       const response = await axiosInstance.get(`/forms/apply/${id}/download`, {
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Application_${name}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       alert("Failed to download file");
//     }
//   };

//   const handleStatusChange = async (id: string, newStatus: string) => {
//     if (!isSuperAdmin) return;
//     try {
//       await axiosInstance.patch(`/forms/apply/${id}/status`, { status: newStatus });
//       setData(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
//       if (selectedApp?._id === id) setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
//     } catch (err) {
//       alert("Failed to update status");
//     }
//   };

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
//       case 'contacted': return 'bg-blue-50 text-blue-700 border-blue-100';
//       case 'reviewed': return 'bg-green-50 text-green-700 border-green-100';
//       default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
//     }
//   };

//   // DETAIL VIEW COMPONENT
//   if (selectedApp) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//         <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
//           {/* Header */}
//           <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
//             <div>
//               <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors font-medium">
//                 <HiOutlineArrowLeft /> Back to List
//               </button>
//               <h2 className="text-3xl font-bold tracking-tight">{selectedApp.firstName} {selectedApp.lastName}</h2>
//               <span className={`inline-block mt-2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedApp.type === 'franchise' ? 'bg-purple-600' : 'bg-orange-600'}`}>
//                 {selectedApp.type.replace('_', ' ')}
//               </span>
//             </div>
//             <div className="text-right">
//               <p className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-widest">Management Status</p>
//               {isSuperAdmin ? (
//                 <select
//                   value={selectedApp.status}
//                   onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
//                   className="bg-slate-800 border-none text-white text-sm rounded-xl px-4 py-2 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
//                 >
//                   <option value="new">NEW</option>
//                   <option value="reviewed">REVIEWED</option>
//                   <option value="contacted">CONTACTED</option>
//                   <option value="rejected">REJECTED</option>
//                 </select>
//               ) : (
//                 <span className={`px-4 py-2 rounded-xl text-xs font-bold border uppercase tracking-widest ${getStatusBadgeClass(selectedApp.status)}`}>
//                   {selectedApp.status}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
//             {/* Contact Details */}
//             <div className="space-y-6">
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">Personal & Contact</h4>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><HiOutlineMail className="w-5 h-5"/></div>
//                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Email</p><p className="font-semibold text-slate-700">{selectedApp.email}</p></div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-green-50 rounded-2xl text-green-600"><HiOutlinePhone className="w-5 h-5"/></div>
//                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p><p className="font-semibold text-slate-700">{selectedApp.contactNumber}</p></div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 mt-1"><HiOutlineHome className="w-5 h-5"/></div>
//                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Permanent Address</p><p className="font-semibold text-slate-700 leading-snug">{selectedApp.address}, {selectedApp.city}, {selectedApp.state}</p></div>
//                 </div>
//               </div>
//             </div>

//             {/* Business Details */}
//             <div className="space-y-6">
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">Operational Details</h4>
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><HiOutlineLocationMarker className="w-5 h-5"/></div>
//                 <div><p className="text-[10px] text-slate-400 font-bold uppercase">Proposed Location</p><p className="font-semibold text-slate-700">{selectedApp.desiredLocation} (PIN: {selectedApp.pincode})</p></div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
//                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Floor Area</p>
//                   <p className="text-xl font-bold text-slate-800">{selectedApp.areaSqFt} <span className="text-xs font-medium text-slate-400">SqFt</span></p>
//                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${selectedApp.hasOwnSpace ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
//                     {selectedApp.hasOwnSpace ? 'Owned Space' : 'Rented'}
//                   </span>
//                 </div>
//                 <div className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
//                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fleet Size</p>
//                   <p className="text-xl font-bold text-slate-800">{selectedApp.vehiclesOwned} <span className="text-xs font-medium text-slate-400">Units</span></p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
//             <div className="flex items-center gap-2 text-slate-400">
//                 <HiOutlineCalendar />
//                 <p className="text-xs font-medium">Applied on {new Date(selectedApp.createdAt).toLocaleDateString()} at {new Date(selectedApp.createdAt).toLocaleTimeString()}</p>
//             </div>
//             <button 
//               onClick={() => handleDownload(selectedApp._id, `${selectedApp.firstName}_${selectedApp.lastName}`)}
//               className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
//             >
//               <HiOutlineDownload className="w-5 h-5" />
//               Download Application PDF
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
//         <div className="p-8 border-b border-gray-100 flex flex-col space-y-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4 transition-all">
//                 <HiOutlineArrowLeft /> Back to Dashboard
//               </button>
//               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Partnership <span className="font-light text-slate-400 text-2xl">Submissions</span></h2>
//             </div>

//             <div className="w-full md:w-96 relative group">
//               <input
//                 type="text"
//                 placeholder="Search candidates..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-2xl text-sm bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
//               />
//               <HiOutlineUser className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-4">
//             <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
//               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</span>
//               <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
//                 <option value="">All Applications</option>
//                 <option value="retail_partner">Retail Partners</option>
//                 <option value="franchise">Franchise Units</option>
//               </select>
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
//               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
//               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
//                 <option value="">All Pipeline</option>
//                 <option value="new">New Entry</option>
//                 <option value="reviewed">Reviewed</option>
//                 <option value="contacted">Contacted</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-100">
//                 <th className="px-8 py-5">Submission Date</th>
//                 <th className="px-8 py-5">Applicant Details</th>
//                 <th className="px-8 py-5">Module</th>
//                 <th className="px-8 py-5">Target Location</th>
//                 <th className="px-8 py-5">Current Status</th>
//                 <th className="px-8 py-5 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {loading ? (
//                 <tr><td colSpan={6} className="text-center py-24 text-slate-400 animate-pulse font-medium">Syncing applications...</td></tr>
//               ) : data.length === 0 ? (
//                 <tr><td colSpan={6} className="text-center py-24 text-slate-400 font-medium">No applications found matching criteria.</td></tr>
//               ) : data.map((item) => (
//                 <tr 
//                     key={item._id} 
//                     onClick={() => setSelectedApp(item)}
//                     className="hover:bg-blue-50/30 transition-all cursor-pointer group"
//                 >
//                   <td className="px-8 py-6 text-xs font-bold text-slate-400">
//                     {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
//                   </td>
//                   <td className="px-8 py-6">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.firstName} {item.lastName}</span>
//                       <span className="text-[11px] text-slate-400 font-medium">{item.email}</span>
//                       <span className="text-[11px] text-blue-500 font-bold mt-0.5">{item.contactNumber}</span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6">
//                     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.type === 'franchise' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
//                       {item.type.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-8 py-6">
//                     <p className="text-xs font-bold text-slate-700">{item.desiredLocation}</p>
//                     <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{item.city}, {item.pincode}</p>
//                   </td>
//                   <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
//                     {isSuperAdmin ? (
//                       <select
//                         value={item.status}
//                         onChange={(e) => handleStatusChange(item._id, e.target.value)}
//                         className="text-[10px] font-black rounded-lg border-gray-200 px-3 py-1.5 outline-none bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-500 uppercase transition-all"
//                       >
//                         <option value="new">NEW</option>
//                         <option value="reviewed">REVIEWED</option>
//                         <option value="contacted">CONTACTED</option>
//                         <option value="rejected">REJECTED</option>
//                       </select>
//                     ) : (
//                       <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadgeClass(item.status)}`}>
//                         {item.status}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
//                     <button 
//                       onClick={() => handleDownload(item._id, `${item.firstName}_${item.lastName}`)}
//                       className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
//                       title="Download PDF"
//                     >
//                       <HiOutlineDownload className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="p-8 bg-slate-50 border-t border-gray-100 flex justify-between items-center">
//           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//             Showing Page <span className="text-slate-900">{pagination.page}</span> of <span className="text-slate-900">{pagination.totalPages}</span>
//           </p>
//           <div className="flex gap-3">
//             <button 
//               onClick={() => fetchData(pagination.page - 1)} 
//               disabled={pagination.page === 1} 
//               className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all"
//             >
//               Previous
//             </button>
//             <button 
//               onClick={() => fetchData(pagination.page + 1)} 
//               disabled={pagination.page === pagination.totalPages} 
//               className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import { 
  HiOutlineDownload, 
  HiOutlineArrowLeft, 
  HiOutlineLocationMarker, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineHome, 
  HiOutlineCalendar,
  HiOutlineUser,
  HiChevronLeft,
  HiChevronRight,
  HiX
} from "react-icons/hi";
import { toast } from "react-hot-toast";

interface Application {
  _id: string;
  type: 'retail_partner' | 'franchise';
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  desiredLocation: string;
  pincode: string;
  vehiclesOwned: number;
  hasOwnSpace: boolean;
  areaSqFt: number;
  status: string;
  applicationFileUrl: string;
  createdAt: string;
}

export const ApplicationListingPanel = ({ onBack }: { onBack: () => void }) => {
  const { userRole } = useAuth();
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  const isSuperAdmin = userRole === "SuperAdmin";

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axiosInstance.get(`/forms/apply?${params.toString()}`);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [typeFilter, statusFilter, searchTerm]);

  const handleDownload = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.get(`/forms/apply/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Application_${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    e.stopPropagation();
    if (!isSuperAdmin) return;
    try {
      await axiosInstance.patch(`/forms/apply/${id}/status`, { status: e.target.value });
      toast.success("Status Updated");
      fetchData(pagination.page);
      if (selectedApp?._id === id) setSelectedApp(prev => prev ? { ...prev, status: e.target.value } : null);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 flex items-center gap-2 transition-colors">
              <HiOutlineArrowLeft /> Back to Selection
            </button>
            <h1 className="text-5xl font-extralight text-slate-900 tracking-tighter">
              Partnership <span className="font-medium text-blue-600">Submissions</span>
            </h1>
          </div>

          <div className="w-full md:w-96 relative group">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none text-slate-900 placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-6 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 cursor-pointer">
                <option value="">All Applications</option>
                <option value="retail_partner">Retail Partners</option>
                <option value="franchise">Franchise Units</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-6 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-600 cursor-pointer">
                <option value="">All Pipeline</option>
                <option value="new">New Entry</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>

        {/* Table View */}
        <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Submission</th>
                <th className="px-8 py-5">Applicant</th>
                <th className="px-8 py-5">Module</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 animate-pulse font-bold tracking-widest text-xs uppercase text-blue-600">Syncing Applications...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 italic">No records found.</td></tr>
              ) : data.map((item) => (
                <tr 
                    key={item._id} 
                    onClick={() => setSelectedApp(item)}
                    className="hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.firstName} {item.lastName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{item.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.type === 'franchise' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                    {isSuperAdmin ? (
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(e, item._id)}
                        className="text-[10px] font-black rounded-lg border-none px-3 py-1.5 outline-none bg-white shadow-sm ring-1 ring-slate-100 text-blue-600 uppercase cursor-pointer"
                      >
                        <option value="new">NEW</option>
                        <option value="reviewed">REVIEWED</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="rejected">REJECTED</option>
                      </select>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-blue-600">{item.status}</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={(e) => handleDownload(e, item._id, `${item.firstName}_${item.lastName}`)}
                      className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                    >
                      <HiOutlineDownload className="w-5 h-5" />
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
            Page <span className="text-slate-900">{pagination.page}</span> of <span className="text-slate-900">{pagination.totalPages}</span>
          </p>
          <div className="flex gap-3">
            <button onClick={() => fetchData(pagination.page - 1)} disabled={pagination.page === 1} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm">
              <HiChevronLeft className="inline w-4 h-4 mr-1" /> Previous
            </button>
            <button onClick={() => fetchData(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm">
              Next <HiChevronRight className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500 border border-white">
            
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all z-10"
            >
              <HiX size={24} />
            </button>

            <div className="p-10 md:p-14">
              <div className="mb-10">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-3 italic">Partnership Application</p>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {selectedApp.firstName} <span className="text-slate-400 font-light">{selectedApp.lastName}</span>
                </h2>
                <div className="flex flex-wrap gap-6 mt-4 text-slate-500 text-sm font-bold">
                   <span className="flex items-center gap-2 text-slate-700"><HiOutlineMail className="text-blue-500" /> {selectedApp.email}</span>
                   <span className="flex items-center gap-2 text-slate-700"><HiOutlinePhone className="text-blue-500" /> {selectedApp.contactNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-50 pt-10">
                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Location & Address</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Target Area</p>
                        <p className="text-lg font-bold text-slate-800">{selectedApp.desiredLocation}</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <HiOutlineHome className="text-blue-500 mt-1" />
                        <div>
                            <p className="text-sm font-bold text-slate-700 leading-snug">{selectedApp.address}</p>
                            <p className="text-xs text-slate-400">{selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Business Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Space</p>
                        <p className="text-xl font-bold text-slate-800">{selectedApp.areaSqFt} <span className="text-xs font-medium">SqFt</span></p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fleet</p>
                        <p className="text-xl font-bold text-slate-800">{selectedApp.vehiclesOwned} <span className="text-xs font-medium">Units</span></p>
                      </div>
                    </div>
                  </section>
                  <button 
                    onClick={(e) => handleDownload(e as any, selectedApp._id, selectedApp.firstName)}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
                  >
                    <HiOutlineDownload size={18} /> Download Application PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};