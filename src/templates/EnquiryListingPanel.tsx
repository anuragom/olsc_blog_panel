// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import axiosInstance from "@/utils/axiosInstance";
// import { useAuth } from "@/utils/AuthContext";
// import { 
//   HiX, HiOutlineArrowLeft, 
//   HiOutlineSearch, HiOutlineMail, 
//   HiOutlinePhone, HiOutlineCalendar,
//   HiOutlineUserCircle, HiOutlineClipboardList
// } from "react-icons/hi";
// import { toast } from "react-hot-toast";

// interface Enquiry {
//   _id: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   serviceName: string;
//   query: string;
//   message: string;
//   status: string;
//   createdAt: string;
// }

// export const EnquiryListingPanel = ({ onBack }: { onBack: () => void }) => {
//   const { user, hasPermission } = useAuth();
//   const [data, setData] = useState<Enquiry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
//   const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

//   const [serviceName, setServiceName] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const servicesList = [
//     { id: "air_logistics", label: "Air Logistics" }, { id: "rail_logistics", label: "Rail Logistics" },
//     { id: "warehousing", label: "Warehousing" }, { id: "3PL", label: "3PL" },
//     { id: "speed_trucking", label: "Speed Trucking" }, { id: "FTL", label: "FTL" },
//     { id: "PTL", label: "PTL" }, { id: "contact_us", label: "Contact Us" },
//     { id: "automotive-engineering", label: "Automotive Engineering" }, { id: "retail-fashion", label: "Retail Fashion" },
//     { id: "it-consumer-electronics", label: "IT & Consumer Electronics" }, { id: "healthcare-pharmaceuticals", label: "Healthcare & Pharmaceuticals" },
//     { id: "books-publishing", label: "Books & Publishing" }, { id: "fmcg", label: "FMCG" },
//     { id: "projects", label: "Projects" }, { id: "bike-logistics", label: "Bike Logistics" },
//     { id: "campus-logistics", label: "Campus Logistics" },
//   ];

//   const allowedServices = useMemo(() => {
//     if (user?.role === "SuperAdmin" || hasPermission("service:*:read")) return servicesList;
//     return servicesList.filter(s => hasPermission(`service:${s.id}:read`));
//   }, [user, hasPermission]);

//   const canEditEnquiry = (enqService: string) => {
//     return user?.role === "SuperAdmin" || hasPermission(`service:${enqService}:write`) || hasPermission("service:*:write");
//   };

//   const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(`/forms`, {
//         params: { page, limit: 100, serviceName, status: statusFilter, search: searchTerm }
//       });
//       setData(response.data.data);
//       setPagination(response.data.pagination);
//     } catch (error) { toast.error("Fetch Error"); } finally { setLoading(false); }
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => fetchData(1), 500);
//     return () => clearTimeout(delay);
//   }, [serviceName, statusFilter, searchTerm]);

//   const handleStatusChange = async (
//   enquiry: Enquiry,
//   newStatus: string
// ): Promise<void> => {
//   if (!canEditEnquiry(enquiry.serviceName)) {
//     toast.error("Unauthorized");
//     return;
//   }

//   try {
//     await axiosInstance.patch(
//       `/forms/${enquiry._id}/status`,
//       { status: newStatus }
//     );

//     toast.success("Status Synchronized");

//     setData(prev =>
//       prev.map(item =>
//         item._id === enquiry._id
//           ? { ...item, status: newStatus }
//           : item
//       )
//     );

//     if (selectedEnquiry?._id === enquiry._id) {
//       setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
//     }
//   } catch {
//     toast.error("Failed to update");
//   }
// };


//   return (
//     <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
//       <div className="max-w-[1600px] mx-auto">
//         {/* Header identical to Pickup for consistency */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
//           <div>
//             <button onClick={onBack} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 mb-4 transition-all">
//               <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Exit to Dashboard
//             </button>
//             <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
//               Enquiry <span className="text-blue-600">Submissions</span>
//             </h1>
//           </div>
//           <div className="flex gap-4 w-full lg:w-auto">
//              <div className="relative flex-1 lg:w-80">
//               <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//               <input type="text" placeholder="Search Email/Phone..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
//           <select value={serviceName} onChange={e => setServiceName(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none">
//             <option value="">Authorized Services</option>
//             {allowedServices.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
//           </select>
//           <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none">
//             <option value="">Status Filter</option>
//             <option value="new">NEW</option>
//             <option value="contacted">CONTACTED</option>
//             <option value="resolved">RESOLVED</option>
//           </select>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
//               <tr>
//                 <th className="px-8 py-6">Submission Date</th>
//                 <th className="px-8 py-6">Consignor</th>
//                 <th className="px-8 py-6">Service Category</th>
//                 <th className="px-8 py-6">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {loading ? (
//                 <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Syncing Enquiries...</td></tr>
//               ) : data.map((item) => (
//                 <tr key={item._id} onClick={() => setSelectedEnquiry(item)} className="group hover:bg-blue-50/20 cursor-pointer transition-all">
//                   <td className="px-8 py-6 text-sm font-black text-slate-900">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
//                   <td className="px-8 py-6">
//                     <div className="flex flex-col">
//                         <span className="text-sm font-black text-slate-800 uppercase">{item.fullName}</span>
//                         <span className="text-[10px] font-bold text-slate-400">{item.email}</span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6"><span className="bg-blue-50 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-blue-600">{item.serviceName.replace('_', ' ')}</span></td>
//                   <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
//                     {canEditEnquiry(item.serviceName) ? (
//                       <select value={item.status} onChange={e => handleStatusChange(item, e.target.value)} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-none ring-1 ring-slate-100">
//                         <option value="new">NEW</option>
//                         <option value="contacted">CONTACTED</option>
//                         <option value="resolved">RESOLVED</option>
//                       </select>
//                     ) : <span className="text-[10px] font-black uppercase text-slate-400">{item.status}</span>}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Detail Sidebar Modal (Matching Pickup Layout) */}
//       {selectedEnquiry && (
//         <div className="fixed inset-0 z-[100] flex justify-end">
//           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)}></div>
//           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto border-l border-slate-100">
//             <div className="p-12">
//               <button onClick={() => setSelectedEnquiry(null)} className="mb-10 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><HiX size={24} /></button>
              
//               <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Inquiry Dossier</p>
//               <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-10">Submission Details</h2>

//               <div className="space-y-10">
//                 {/* Section: Profile */}
//                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
//                     <div className="flex items-center gap-5 mb-8">
//                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><HiOutlineUserCircle size={32} /></div>
//                         <div>
//                             <p className="text-2xl font-black text-slate-900 tracking-tight">{selectedEnquiry.fullName}</p>
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedEnquiry.serviceName.replace('_', ' ')}</p>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-50">
//                             <HiOutlineMail className="text-blue-500" />
//                             <span className="text-xs font-bold text-slate-700 truncate">{selectedEnquiry.email}</span>
//                         </div>
//                         <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-50">
//                             <HiOutlinePhone className="text-blue-500" />
//                             <span className="text-xs font-bold text-slate-700">{selectedEnquiry.phone}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Section: Query Content */}
//                 <div className="space-y-6">
//                     <div className="flex items-center gap-3">
//                         <HiOutlineClipboardList className="text-blue-600" size={20} />
//                         <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Query & Context</h4>
//                     </div>
//                     <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
//                         <p className="text-[10px] font-black text-blue-600 uppercase mb-3">Topic: {selectedEnquiry.query}</p>
//                         <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
//                             "{selectedEnquiry.message}"
//                         </p>
//                     </div>
//                 </div>

//                 {/* Footer Metadata */}
//                 <div className="pt-10 border-t border-slate-50 flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                         <HiOutlineCalendar className="text-slate-300" />
//                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received: {new Date(selectedEnquiry.createdAt).toLocaleDateString()}</span>
//                     </div>
//                     <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
//                         selectedEnquiry.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
//                     }`}>STATUS: {selectedEnquiry.status}</span>
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

import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import { 
  HiX, HiOutlineArrowLeft, 
  HiOutlineSearch, HiOutlineMail, 
  HiOutlinePhone, HiOutlineCalendar,
  HiOutlineUserCircle, HiOutlineClipboardList,
  HiOutlineDownload, HiOutlineFilter, HiXCircle,
  HiChevronLeft, HiChevronRight
} from "react-icons/hi";
import { toast } from "react-hot-toast";

interface Enquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceName: string;
  query: string;
  message: string;
  status: string;
  createdAt: string;
}

export const EnquiryListingPanel = ({ onBack }: { onBack: () => void }) => {
  const { user, hasPermission } = useAuth();
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const [serviceName, setServiceName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const servicesList = [
    { id: "air_logistics", label: "Air Logistics" }, { id: "rail_logistics", label: "Rail Logistics" },
    { id: "warehousing", label: "Warehousing" }, { id: "3PL", label: "3PL" },
    { id: "speed_trucking", label: "Speed Trucking" }, { id: "FTL", label: "FTL" },
    { id: "PTL", label: "PTL" }, { id: "contact_us", label: "Contact Us" },
    { id: "automotive-engineering", label: "Automotive Engineering" }, { id: "retail-fashion", label: "Retail Fashion" },
    { id: "it-consumer-electronics", label: "IT & Consumer Electronics" }, { id: "healthcare-pharmaceuticals", label: "Healthcare & Pharmaceuticals" },
    { id: "books-publishing", label: "Books & Publishing" }, { id: "fmcg", label: "FMCG" },
    { id: "projects", label: "Projects" }, { id: "bike-logistics", label: "Bike Logistics" },
    { id: "campus-logistics", label: "Campus Logistics" },
  ];

  const allowedServices = useMemo(() => {
    if (user?.role === "SuperAdmin" || hasPermission("service:*:read")) return servicesList;
    return servicesList.filter(s => hasPermission(`service:${s.id}:read`));
  }, [user, hasPermission]);

  const canEditEnquiry = (enqService: string) => {
    return user?.role === "SuperAdmin" || hasPermission(`service:${enqService}:write`) || hasPermission("service:*:write");
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/forms`, {
        params: { 
            page, 
            limit: 100, 
            serviceName, 
            status: statusFilter, 
            search: searchTerm,
            startDate,
            endDate
        }
      });
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) { toast.error("Fetch Error"); } finally { setLoading(false); }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delay);
  }, [serviceName, statusFilter, searchTerm, startDate, endDate]);

  const handleStatusChange = async (enquiry: Enquiry, newStatus: string): Promise<void> => {
    if (!canEditEnquiry(enquiry.serviceName)) {
      toast.error("Unauthorized");
      return;
    }
    try {
      await axiosInstance.patch(`/forms/${enquiry._id}/status`, { status: newStatus });
      toast.success("Status Synchronized");
      setData(prev => prev.map(item => item._id === enquiry._id ? { ...item, status: newStatus } : item));
      if (selectedEnquiry?._id === enquiry._id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch { toast.error("Failed to update"); }
  };

  // CSV DOWNLOAD LOGIC (Uses local state)
  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const headers = ["Date", "Full Name", "Email", "Phone", "Service", "Query", "Status", "Message"];
    const csvRows = data.map(item => [
      new Date(item.createdAt).toLocaleDateString(),
      `"${item.fullName.replace(/"/g, '""')}"`,
      item.email,
      item.phone,
      item.serviceName,
      `"${item.query.replace(/"/g, '""')}"`,
      item.status.toUpperCase(),
      `"${item.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Enquiries_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <button onClick={onBack} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 mb-4 transition-all">
              <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Exit to Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Enquiry <span className="text-blue-600">Submissions</span>
            </h1>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            {/* DOWNLOAD CSV BUTTON */}
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              <HiOutlineDownload size={18} /> Export CSV
            </button>
            <div className="relative flex-1 lg:w-80">
              <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search Email/Phone..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Filters + Date Range */}
        <div className="flex flex-wrap items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
            <HiOutlineFilter className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filters</span>
          </div>

          <select value={serviceName} onChange={e => setServiceName(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none cursor-pointer">
            <option value="">Authorized Services</option>
            {allowedServices.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none cursor-pointer">
            <option value="">Status Filter</option>
            <option value="new">NEW</option>
            <option value="contacted">CONTACTED</option>
            <option value="resolved">RESOLVED</option>
          </select>

          {/* DATE RANGE FILTER */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black text-slate-300 uppercase">From</span>
                <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} className="text-[10px] font-bold outline-none text-slate-600" />
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black text-slate-300 uppercase">To</span>
                <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} className="text-[10px] font-bold outline-none text-slate-600" />
            </div>
            {(startDate || endDate) && (
                <button onClick={() => {setStartDate(""); setEndDate("");}} className="text-slate-300 hover:text-red-500 transition-colors">
                    <HiXCircle size={20} />
                </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Submission Date</th>
                <th className="px-8 py-6">Consignor</th>
                <th className="px-8 py-6">Service Category</th>
                <th className="px-8 py-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Syncing Enquiries...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="py-20 text-center text-slate-400 italic">No authorized records found.</td></tr>
              ) : data.map((item) => (
                <tr key={item._id} onClick={() => setSelectedEnquiry(item)} className="group hover:bg-blue-50/20 cursor-pointer transition-all">
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 uppercase">{item.fullName}</span>
                        <span className="text-[10px] font-bold text-slate-400">{item.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6"><span className="bg-blue-50 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-blue-600">{item.serviceName.replace('_', ' ')}</span></td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    {canEditEnquiry(item.serviceName) ? (
                      <select value={item.status} onChange={e => handleStatusChange(item, e.target.value)} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-none ring-1 ring-slate-100 cursor-pointer outline-none">
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                    ) : <span className="text-[10px] font-black uppercase text-slate-400">{item.status}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between px-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-900">{data.length}</span> results
            </p>
            <div className="flex gap-2">
                <button disabled={pagination.page === 1} onClick={() => fetchData(pagination.page - 1)} className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30"><HiChevronLeft /></button>
                <button disabled={pagination.page === pagination.totalPages} onClick={() => fetchData(pagination.page + 1)} className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30"><HiChevronRight /></button>
            </div>
        </div>
      </div>

      {/* Detail Sidebar Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto border-l border-slate-100">
            <div className="p-12">
              <button onClick={() => setSelectedEnquiry(null)} className="mb-10 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><HiX size={24} /></button>
              
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Inquiry Dossier</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-10">Submission Details</h2>

              <div className="space-y-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><HiOutlineUserCircle size={32} /></div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{selectedEnquiry.fullName}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedEnquiry.serviceName.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-50">
                            <HiOutlineMail className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700 truncate">{selectedEnquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-50">
                            <HiOutlinePhone className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700">{selectedEnquiry.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <HiOutlineClipboardList className="text-blue-600" size={20} />
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Query & Context</h4>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-3">Topic: {selectedEnquiry.query}</p>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                            "{selectedEnquiry.message}"
                        </p>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received: {new Date(selectedEnquiry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        selectedEnquiry.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                    }`}>STATUS: {selectedEnquiry.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};