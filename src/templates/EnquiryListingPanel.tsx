"use client";

import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import {
  HiX, HiOutlineArrowLeft,
  HiOutlineSearch, HiOutlineMail,
  HiOutlinePhone, HiOutlineCalendar,
  HiOutlineUserCircle, HiOutlineClipboardList,
  HiOutlineDownload, HiOutlineFilter, HiXCircle, HiOutlineChatAlt,
  HiCheckCircle, HiRefresh,
  HiChevronLeft,
  HiChevronRight
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
  remarks?: string;
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

  // States for confirmation UI
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

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
        params: { page, limit: 100, serviceName, status: statusFilter, search: searchTerm, startDate, endDate }
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
      toast.success(`Status updated for ${enquiry.fullName}`);
      setData(prev => prev.map(item => item._id === enquiry._id ? { ...item, status: newStatus } : item));
    } catch { toast.error("Failed to update status"); }
  };

  const handleTableRemarkUpdate = async (item: Enquiry, newValue: string) => {
    const originalValue = item.remarks || "";
    if (newValue === originalValue) return;
    if (!canEditEnquiry(item.serviceName)) return;

    setSavingId(item._id);
    try {
      await axiosInstance.put(`/forms/${item._id}`, { remarks: newValue });

      setData(prev => prev.map(i => i._id === item._id ? { ...i, remarks: newValue } : i));

      setSuccessId(item._id);
      const actionType = originalValue === "" ? "Added" : "Updated";
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Remarks {actionType}</span>
          <span className="text-xs opacity-80">{item.fullName} ({item.email})</span>
        </div>,
        { id: `save-${item._id}`, duration: 3000 }
      );

      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      toast.error(`Failed to save remarks for ${item.fullName}`);
    } finally {
      setSavingId(null);
    }
  };

  const downloadCSV = () => {
  if (data.length === 0) {
    toast.error("No data available");
    return;
  }

  const headers = ["Date", "Full Name", "Email", "Phone", "Service", "Status", "Message", "Remarks"];
  
  const csvRows = data.map(item => [
    new Date(item.createdAt).toLocaleDateString(),
    `"${(item.fullName || "").replace(/"/g, '""')}"`,
    item.email,
    item.phone,
    item.serviceName,
    item.status.toUpperCase(),
    `"${(item.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(item.remarks || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Enquiries_Report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); 
  URL.revokeObjectURL(url);
};

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <button onClick={onBack} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all mb-4">
              <HiOutlineArrowLeft className="group-hover:-translate-x-1" /> Exit to Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Enquiry <span className="text-blue-600">Submissions</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button onClick={downloadCSV} className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              <HiOutlineDownload size={18} /> Export CSV
            </button>
            <div className="relative w-80">
              <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search Email/Phone..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
            <HiOutlineFilter className="text-blue-600" />
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Filters</span>
          </div>
          <select value={serviceName} onChange={e => setServiceName(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none">
            <option value="">Authorized Services</option>
            {allowedServices.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none">
            <option value="">Status Filter</option>
            <option value="new">NEW</option>
            <option value="contacted">CONTACTED</option>
            <option value="resolved">RESOLVED</option>
          </select>
          <div className="flex items-center gap-4 ml-auto">
            <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none" />
            <span className="text-[10px] font-black text-slate-300">TO</span>
            <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none" />
            {(startDate || endDate) && <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-slate-300 hover:text-red-500"><HiXCircle size={20} /></button>}
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Submission</th>
                <th className="px-8 py-6">Applicant</th>
                <th className="px-8 py-6">Service</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 w-1/4">Internal Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Syncing...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 italic">No authorized records found.</td></tr>
              ) : data.map((item) => (
                <tr key={item._id} onClick={() => setSelectedEnquiry(item)} className="group hover:bg-blue-50/20 cursor-pointer transition-all">
                  <td className="px-8 py-6 text-xs font-black text-slate-400">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 uppercase group-hover:text-blue-600 transition-colors">{item.fullName}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6"><span className="bg-blue-50 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-blue-600">{item.serviceName.replace('_', ' ')}</span></td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    {canEditEnquiry(item.serviceName) ? (
                      <select value={item.status} onChange={e => handleStatusChange(item, e.target.value)} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-none ring-1 ring-slate-100 bg-white">
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                    ) : <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.status}</span>}
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    {canEditEnquiry(item.serviceName) ? (
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          defaultValue={item.remarks}
                          onBlur={(e) => handleTableRemarkUpdate(item, e.target.value)}
                          placeholder="Add administrative note..."
                          className={`w-full border-none rounded-xl px-4 py-2.5 text-xs font-bold transition-all placeholder:text-slate-300 shadow-sm
                              ${successId === item._id ? 'bg-emerald-50 ring-2 ring-emerald-500 pr-10' : 'bg-slate-50 focus:ring-1 focus:ring-blue-500'}
                            `}
                        />
                        <div className="absolute right-3">
                          {savingId === item._id && <HiRefresh className="w-4 h-4 text-blue-500 animate-spin" />}
                          {successId === item._id && <HiCheckCircle className="w-5 h-5 text-emerald-500 animate-bounce" />}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic font-medium truncate max-w-[220px]">{item.remarks || "No notes"}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex items-center justify-between px-6">
          {pagination?.total > 100 ? (
            <div className="flex items-center gap-2"><HiOutlineCalendar className="text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 100 out of {pagination?.total}</span></div>
          ) : <div className="flex items-center gap-2"><HiOutlineCalendar className="text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {pagination?.total} out of {pagination?.total}</span></div>}
          <div className="flex gap-2">
            <button disabled={pagination.page === 1} onClick={() => fetchData(pagination.page - 1)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"><HiChevronLeft size={20} /></button>
            <button disabled={pagination.page === pagination.totalPages} onClick={() => fetchData(pagination.page + 1)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"><HiChevronRight size={20} /></button>
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
                    <div className="bg-white p-4 rounded-2xl border border-slate-50 flex items-center gap-3"><HiOutlineMail className="text-blue-500" /><span className="text-xs font-bold truncate">{selectedEnquiry.email}</span></div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3"><HiOutlinePhone className="text-blue-500" /><span className="text-xs font-bold">{selectedEnquiry.phone}</span></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3"><HiOutlineClipboardList className="text-blue-600" size={20} /><h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Query & Context</h4></div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-3">Topic: {selectedEnquiry.query}</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{selectedEnquiry.message}"</p>
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 shadow-inner">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2 font-black uppercase"><HiOutlineChatAlt size={18} /> Official Audit Note</h4>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    {selectedEnquiry.remarks || "No administrative notes recorded yet."}
                  </p>
                </div>

                <div className="pt-10 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2"><HiOutlineCalendar className="text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received: {new Date(selectedEnquiry.createdAt).toLocaleDateString()}</span></div>
                  <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">STATUS: {selectedEnquiry.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};