// "use client";

// import React, { useState, useEffect } from "react";
// import axiosInstance from "@/utils/axiosInstance";
// import { useAuth } from "@/utils/AuthContext";
// import { 
//   HiXCircle, 
//   HiOutlineArrowLeft, 
//   HiChevronLeft, 
//   HiChevronRight, 
//   HiOutlineSearch, 
//   HiOutlineFilter,
//   HiX,
//   HiOutlineMail,
//   HiOutlinePhone,
//   HiOutlineCalendar,
//   HiOutlineChatAlt2
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
//   const { userRole } = useAuth();
//   const [data, setData] = useState<Enquiry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
//   const [serviceName, setServiceName] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [searchTerm, setSearchTerm] = useState(""); 

//   // Modal State
//   const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
//   const [isDetailLoading, setIsDetailLoading] = useState(false);

//   const today = new Date().toISOString().split("T")[0];
//   const canEdit = userRole === "SuperAdmin";

//   const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: "10",
//         ...(serviceName && { serviceName }),
//         ...(statusFilter && { status: statusFilter }),
//         ...(startDate && { startDate }),
//         ...(endDate && { endDate }),
//         ...(searchTerm && { search: searchTerm }),
//       });

//       const response = await axiosInstance.get(`/forms?${params.toString()}`);
//       setData(response.data.data);
//       setPagination(response.data.pagination);
//     } catch (error) {
//       toast.error("Error fetching enquiries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEnquiryDetails = async (id: string) => {
//     setIsDetailLoading(true);
//     try {
//       const res = await axiosInstance.get(`/forms/${id}`);
//       // Based on your response snippet, the object is returned directly or inside a data property
//       setSelectedEnquiry(res.data.data || res.data);
//     } catch (error) {
//       toast.error("Could not fetch enquiry details");
//     } finally {
//       setIsDetailLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => fetchData(1), 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [serviceName, statusFilter, startDate, endDate, searchTerm]);

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, enquiryId: string) => {
//     e.stopPropagation(); // Prevent modal from opening
//     const newStatus = e.target.value;
//     try {
//       axiosInstance.patch(`/forms/${enquiryId}/status`, { status: newStatus });
//       toast.success("Status Updated");
//       setData((prev) => prev.map((item) => item._id === enquiryId ? { ...item, status: newStatus } : item));
//       if (selectedEnquiry?._id === enquiryId) {
//         setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
//       }
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   const clearDates = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <div className="min-h-screen bg-white p-8 relative">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 flex items-center gap-2 transition-colors">
//               <HiOutlineArrowLeft /> Back to Selection
//             </button>
//             <h1 className="text-5xl font-extralight text-slate-900 tracking-tighter">
//               Enquiry <span className="font-medium text-blue-600">Submissions</span>
//             </h1>
//           </div>

//           <div className="w-full md:w-96 relative group">
//             <input
//               type="text"
//               placeholder="Search Phone or Email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none text-slate-900 placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
//             />
//             <HiOutlineSearch className="absolute right-6 top-4.5 text-slate-300 group-focus-within:text-blue-500 w-5 h-5 mt-1" />
//           </div>
//         </div>

//         {/* Filter Toolbar */}
//         <div className="flex flex-wrap items-center gap-4 mb-8 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
//           <div className="flex items-center gap-2 px-4 border-r border-slate-200">
//              <HiOutlineFilter className="text-blue-500" />
//              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filters</span>
//           </div>
          
//           <select 
//             value={serviceName}
//             onChange={(e) => setServiceName(e.target.value)}
//             className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
//           >
//             <option value="">All Services</option>
//             <option value="air_logistics">Air Logistics</option>
//             <option value="rail_logistics">Rail Logistics</option>
//             <option value="warehousing">Warehousing</option>
//             <option value="3PL">3PL</option>
//             <option value="speed_trucking">Speed Trucking</option>
//             <option value="FTL">FTL</option>
//           </select>

//           <select 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
//           >
//             <option value="">All Statuses</option>
//             <option value="new">New</option>
//             <option value="contacted">Contacted</option>
//             <option value="resolved">Resolved</option>
//           </select>
          
//           <div className="flex items-center gap-3 ml-auto pr-4">
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range:</span>
//             <input 
//               type="date" 
//               value={startDate}
//               max={today}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-slate-300 text-[10px] font-black uppercase">To</span>
//             <input 
//               type="date" 
//               value={endDate}
//               max={today}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {(startDate || endDate) && (
//               <button onClick={clearDates} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
//                 <HiXCircle size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Table View */}
//         <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
//               <tr>
//                 <th className="px-8 py-5">Submission</th>
//                 <th className="px-8 py-5">Full Name</th>
//                 <th className="px-8 py-5">Contact Info</th>
//                 <th className="px-8 py-5">Service</th>
//                 <th className="px-8 py-5">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {loading ? (
//                 <tr><td colSpan={5} className="py-24 text-center text-slate-400 animate-pulse font-bold tracking-widest text-xs uppercase text-blue-600">Syncing Database...</td></tr>
//               ) : data.length === 0 ? (
//                 <tr><td colSpan={5} className="py-24 text-center text-slate-400 italic font-medium">No enquiries match the selected filters.</td></tr>
//               ) : data.map((item) => (
//                 <tr 
//                   key={item._id} 
//                   onClick={() => fetchEnquiryDetails(item._id)}
//                   className="hover:bg-blue-50/30 transition-all group cursor-pointer"
//                 >
//                   <td className="px-8 py-6 text-xs font-bold text-slate-400">
//                     {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
//                   </td>
//                   <td className="px-8 py-6 text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
//                     {item.fullName}
//                   </td>
//                   <td className="px-8 py-6">
//                     <div className="flex flex-col">
//                       <span className="text-xs font-bold text-slate-900 underline decoration-blue-100">{item.email}</span>
//                       <span className="text-[11px] text-slate-400 font-medium mt-0.5">{item.phone}</span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
//                       {item.serviceName.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-8 py-6">
//                     {canEdit ? (
//                       <select
//                         value={item.status}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={(e) => handleStatusChange(e, item._id)}
//                         className={`text-[10px] font-black uppercase rounded-lg px-3 py-1.5 outline-none bg-white shadow-sm ring-1 ring-slate-100 cursor-pointer transition-all ${
//                           item.status === 'resolved' ? 'text-green-600 ring-green-100' : 
//                           item.status === 'contacted' ? 'text-blue-600 ring-blue-100' : 'text-orange-600 ring-orange-100'
//                         }`}
//                       >
//                         <option value="new">NEW</option>
//                         <option value="contacted">CONTACTED</option>
//                         <option value="resolved">RESOLVED</option>
//                       </select>
//                     ) : (
//                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                         {item.status}
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="mt-10 flex items-center justify-between px-6">
//           <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
//             Page <span className="text-slate-900 font-bold">{pagination.page}</span> of <span className="text-slate-900 font-bold">{pagination.totalPages}</span>
//           </p>
//           <div className="flex gap-3">
//             <button 
//               disabled={pagination.page === 1 || loading}
//               onClick={() => fetchData(pagination.page - 1)}
//               className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all flex items-center gap-2"
//             >
//               <HiChevronLeft className="w-4 h-4" /> Previous
//             </button>
//             <button 
//               disabled={pagination.page === pagination.totalPages || loading}
//               onClick={() => fetchData(pagination.page + 1)}
//               className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all flex items-center gap-2"
//             >
//               Next <HiChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- ENQUIRY DETAILS MODAL --- */}
//       {selectedEnquiry && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedEnquiry(null)}></div>
//           <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500 border border-white">
            
//             <button 
//               onClick={() => setSelectedEnquiry(null)}
//               className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all z-10"
//             >
//               <HiX size={24} />
//             </button>

//             <div className="p-10 md:p-14">
//               {/* Header */}
//               <div className="mb-10">
//                 <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-3 italic">Customer Requirement</p>
//                 <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
//                   {selectedEnquiry.fullName}
//                 </h2>
//                 <div className="flex flex-wrap gap-6 mt-4 text-slate-500 text-sm font-medium">
//                    <span className="flex items-center gap-2 text-slate-700 font-bold"><HiOutlineMail className="text-blue-500" /> {selectedEnquiry.email}</span>
//                    <span className="flex items-center gap-2 text-slate-700 font-bold"><HiOutlinePhone className="text-blue-500" /> {selectedEnquiry.phone}</span>
//                    <span className="flex items-center gap-2 text-slate-400 italic"><HiOutlineCalendar className="text-blue-500" /> {new Date(selectedEnquiry.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>

//               {/* Data Content */}
//               <div className="grid grid-cols-1 gap-10 border-t border-gray-50 pt-10">
//                 <div className="space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <section>
//                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Service Category</h4>
//                       <p className="text-lg font-bold text-slate-800 bg-blue-50 px-4 py-2 rounded-xl inline-block">
//                         {selectedEnquiry.serviceName.replace('_', ' ')}
//                       </p>
//                     </section>
//                     <section>
//                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Query Type</h4>
//                       <p className="text-lg font-bold text-slate-800 px-4 py-2 border border-slate-100 rounded-xl inline-block">
//                         {selectedEnquiry.query}
//                       </p>
//                     </section>
//                   </div>

//                   <section className="bg-slate-50 p-8 rounded-[2rem] relative border border-slate-100">
//                     <div className="absolute top-6 right-8 text-slate-200">
//                        <HiOutlineChatAlt2 size={40} />
//                     </div>
//                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Customer Message</h4>
//                     <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium italic">
//                       "{selectedEnquiry.message}"
//                     </p>
//                   </section>
//                 </div>

//                 <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row gap-6 items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow Status:</p>
//                     <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
//                       selectedEnquiry.status === 'resolved' ? 'bg-green-100 text-green-700' : 
//                       selectedEnquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
//                     }`}>
//                       {selectedEnquiry.status}
//                     </span>
//                   </div>
                  
//                   <button 
//                     onClick={() => setSelectedEnquiry(null)}
//                     className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
//                   >
//                     Close Record
//                   </button>
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
  HiXCircle, 
  HiOutlineArrowLeft, 
  HiChevronLeft, 
  HiChevronRight, 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiX,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineChatAlt2,
  HiOutlineDownload // Added for CSV button
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
  const { userRole } = useAuth();
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  const [serviceName, setServiceName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const canEdit = userRole === "SuperAdmin";

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      console.log(isDetailLoading)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(serviceName && { serviceName }),
        ...(statusFilter && { status: statusFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axiosInstance.get(`/forms?${params.toString()}`);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Error fetching enquiries");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const headers = ["Date", "Full Name", "Email", "Phone", "Service", "Query", "Message", "Status"];
    
    const csvRows = data.map(item => [
      new Date(item.createdAt).toLocaleDateString(),
      `"${(item.fullName || "").replace(/"/g, '""')}"`, 
      item.email || "",
      item.phone || "",
      item.serviceName || "",
      `"${(item.query || "").replace(/"/g, '""')}"`,
      `"${(item.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      item.status || ""
    ]);

    // Join headers and rows
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    // Create file and trigger download
    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Downloaded Successfully");
    } catch (err) {
      toast.error("Export failed");
      console.error(err);
    }
  };

  const fetchEnquiryDetails = async (id: string) => {
    setIsDetailLoading(true);
    try {
      const res = await axiosInstance.get(`/forms/${id}`);
      setSelectedEnquiry(res.data.data || res.data);
    } catch (error) {
      toast.error("Could not fetch enquiry details");
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [serviceName, statusFilter, startDate, endDate, searchTerm]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, enquiryId: string) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    try {
      axiosInstance.patch(`/forms/${enquiryId}/status`, { status: newStatus });
      toast.success("Status Updated");
      setData((prev) => prev.map((item) => item._id === enquiryId ? { ...item, status: newStatus } : item));
      if (selectedEnquiry?._id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      toast.error("Failed to update status");
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
              <HiOutlineArrowLeft /> Back to Selection
            </button>
            <h1 className="text-5xl font-extralight text-slate-900 tracking-tighter">
              Enquiry <span className="font-medium text-blue-600">Submissions</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Download CSV Button */}
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100"
            >
              <HiOutlineDownload size={20} />
              Download CSV
            </button>

            <div className="w-full md:w-80 relative group">
              <input
                type="text"
                placeholder="Search Phone or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none text-slate-900 placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              />
              <HiOutlineSearch className="absolute right-6 top-4.5 text-slate-300 group-focus-within:text-blue-500 w-5 h-5 mt-1" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-2 px-4 border-r border-slate-200">
             <HiOutlineFilter className="text-blue-500" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filters</span>
          </div>
          
          <select 
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
          >
            <option value="">All Services</option>
            <option value="air_logistics">Air Logistics</option>
            <option value="rail_logistics">Rail Logistics</option>
            <option value="warehousing">Warehousing</option>
            <option value="3PL">3PL</option>
            <option value="speed_trucking">Speed Trucking</option>
            <option value="FTL">FTL</option>
            <option value="contact_us">Contact Us</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <div className="flex items-center gap-3 ml-auto pr-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range:</span>
            <input 
              type="date" 
              value={startDate}
              max={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-300 text-[10px] font-black uppercase">To</span>
            <input 
              type="date" 
              value={endDate}
              max={today}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {(startDate || endDate) && (
              <button onClick={clearDates} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                <HiXCircle size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Submission</th>
                <th className="px-8 py-5">Full Name</th>
                <th className="px-8 py-5">Contact Info</th>
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 animate-pulse font-bold tracking-widest text-xs uppercase text-blue-600">Syncing Database...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 italic font-medium">No enquiries match the selected filters.</td></tr>
              ) : data.map((item) => (
                <tr 
                  key={item._id} 
                  onClick={() => fetchEnquiryDetails(item._id)}
                  className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                >
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.fullName}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 underline decoration-blue-100">{item.email}</span>
                      <span className="text-[11px] text-slate-400 font-medium mt-0.5">{item.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {item.serviceName.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {canEdit ? (
                      <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(e, item._id)}
                        className={`text-[10px] font-black uppercase rounded-lg px-3 py-1.5 outline-none bg-white shadow-sm ring-1 ring-slate-100 cursor-pointer transition-all ${
                          item.status === 'resolved' ? 'text-green-600 ring-green-100' : 
                          item.status === 'contacted' ? 'text-blue-600 ring-blue-100' : 'text-orange-600 ring-orange-100'
                        }`}
                      >
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-between px-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Page <span className="text-slate-900 font-bold">{pagination.page}</span> of <span className="text-slate-900 font-bold">{pagination.totalPages}</span>
          </p>
          <div className="flex gap-3">
            <button 
              disabled={pagination.page === 1 || loading}
              onClick={() => fetchData(pagination.page - 1)}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <HiChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button 
              disabled={pagination.page === pagination.totalPages || loading}
              onClick={() => fetchData(pagination.page + 1)}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              Next <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- ENQUIRY DETAILS MODAL --- */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedEnquiry(null)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500 border border-white">
            
            <button 
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all z-10"
            >
              <HiX size={24} />
            </button>

            <div className="p-10 md:p-14">
              {/* Header */}
              <div className="mb-10">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-3 italic">Customer Requirement</p>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {selectedEnquiry.fullName}
                </h2>
                <div className="flex flex-wrap gap-6 mt-4 text-slate-500 text-sm font-medium">
                   <span className="flex items-center gap-2 text-slate-700 font-bold"><HiOutlineMail className="text-blue-500" /> {selectedEnquiry.email}</span>
                   <span className="flex items-center gap-2 text-slate-700 font-bold"><HiOutlinePhone className="text-blue-500" /> {selectedEnquiry.phone}</span>
                   <span className="flex items-center gap-2 text-slate-400 italic"><HiOutlineCalendar className="text-blue-500" /> {new Date(selectedEnquiry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Data Content */}
              <div className="grid grid-cols-1 gap-10 border-t border-gray-50 pt-10">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Service Category</h4>
                      <p className="text-lg font-bold text-slate-800 bg-blue-50 px-4 py-2 rounded-xl inline-block">
                        {selectedEnquiry.serviceName.replace('_', ' ')}
                      </p>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Query Type</h4>
                      <p className="text-lg font-bold text-slate-800 px-4 py-2 border border-slate-100 rounded-xl inline-block">
                        {selectedEnquiry.query}
                      </p>
                    </section>
                  </div>

                  <section className="bg-slate-50 p-8 rounded-[2rem] relative border border-slate-100">
                    <div className="absolute top-6 right-8 text-slate-200">
                       <HiOutlineChatAlt2 size={40} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Customer Message</h4>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium italic">
                      "{selectedEnquiry.message}"
                    </p>
                  </section>
                </div>

                <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow Status:</p>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      selectedEnquiry.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                      selectedEnquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedEnquiry(null)}
                    className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
                  >
                    Close Record
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