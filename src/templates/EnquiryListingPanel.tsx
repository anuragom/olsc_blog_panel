"use client";

import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import {
  HiX, HiOutlineArrowLeft,
  HiOutlineSearch, HiOutlineMail,
  HiOutlinePhone, HiOutlineCalendar,
  HiOutlineUserCircle,
  HiOutlineDownload, HiOutlineFilter, HiXCircle, HiOutlineChatAlt,
  HiCheckCircle, HiRefresh,
  HiChevronLeft,
  HiChevronRight,
  HiPlus,
  HiOutlineClock,
  HiOutlinePencilAlt
} from "react-icons/hi";
import { toast } from "react-hot-toast";

interface Remark {
  _id?: string;
  text: string;
  createdBy: string;
  createdAt: string;
  fullName: string;
}

interface Enquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceName: string;
  query: string;
  message: string;
  status: string;
  remarks: Remark[];
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

  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);

  // States for editing existing remarks
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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
      if (selectedEnquiry?._id === enquiry._id) setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    } catch { toast.error("Failed to update status"); }
  };

  const handleAddRemark = async (item: Enquiry, newValue: string) => {
    if (!newValue.trim()) {
      setActiveInputId(null);
      return;
    }
    if (!canEditEnquiry(item.serviceName)) return;

    setSavingId(item._id);
    try {
      const response = await axiosInstance.put(`/forms/${item._id}`, { remarks: newValue });
      const updatedEnquiry = response.data.data;

      setData(prev => prev.map(i => i._id === item._id ? updatedEnquiry : i));
      if (selectedEnquiry?._id === item._id) setSelectedEnquiry(updatedEnquiry);

      setSuccessId(item._id);
      setActiveInputId(null);
      toast.success("Remark Saved");

      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      toast.error(`Failed to add remark`);
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdateRemark = async (enquiryId: string, remarkId: string, updatedText: string) => {
    if (!updatedText.trim()) {
      setEditingRemarkId(null);
      return;
    }
    setSavingId(enquiryId);
    try {
      const response = await axiosInstance.patch(`/forms/${enquiryId}/remarks/${remarkId}`, { text: updatedText });
      const updatedEnquiry = response.data.data;

      setData(prev => prev.map(i => i._id === enquiryId ? updatedEnquiry : i));
      if (selectedEnquiry?._id === enquiryId) setSelectedEnquiry(updatedEnquiry);

      setEditingRemarkId(null);
      toast.success("Remark Updated");
    } catch (err) {
      toast.error("Failed to update remark");
    } finally {
      setSavingId(null);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("No data available");
      return;
    }

    const baseHeaders = ["Date", "Full Name", "Email", "Phone", "Service", "Status", "Message"];
    const remarkHeaders = Array.from({ length: 20 }, (_, i) => `Remark ${i + 1}`);
    const headers = [...baseHeaders, ...remarkHeaders];

    const csvRows = data.map(item => {
      const rowData = [
        new Date(item.createdAt).toLocaleDateString(),
        `"${(item.fullName || "").replace(/"/g, '""')}"`,
        item.email,
        item.phone,
        item.serviceName,
        item.status.toUpperCase(),
        `"${(item.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ];
      const sortedRemarks = [...(item.remarks || [])].reverse();

      for (let i = 0; i < 20; i++) {
        const r = sortedRemarks[i];
        if (r) {
          const dateValue = r.createdAt ? new Date(r.createdAt) : new Date();
          const timestamp = dateValue.toLocaleString('en-GB', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
          });
          const rName = r.fullName || "N/A";
          const rText = r.text || "";
          const remarkString = `name : ${rName}, time: ${timestamp}, remarks: ${rText}`;
          rowData.push(`"${remarkString.replace(/"/g, '""').replace(/\n/g, ' ')}"`);
        } else {
          rowData.push("");
        }
      }
      return rowData.join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Enquiries_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
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

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
            <HiOutlineFilter className="text-blue-600" />
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Filters</span>
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
          <div className="flex items-center gap-4 ml-auto">
            <input type="date" value={startDate} max={today} onChange={e => setStartDate(e.target.value)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none" />
            <span className="text-[10px] font-black text-slate-300">TO</span>
            <input type="date" value={endDate} max={today} onChange={e => setEndDate(e.target.value)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none" />
            {(startDate || endDate) && <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-slate-300 hover:text-red-500"><HiXCircle size={20} /></button>}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[1200px] table-fixed">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 w-[120px]">Submission</th>
                <th className="px-8 py-6 w-[200px]">Applicant</th>
                <th className="px-8 py-6 w-[150px]">Service</th>
                <th className="px-8 py-6 w-[140px]">Status</th>
                <th className="px-8 py-6 w-[400px]">Internal Remarks History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Syncing Database...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 italic">No records found.</td></tr>
              ) : data.map((item) => (
                <tr key={item._id} onClick={() => setSelectedEnquiry(item)} className="group hover:bg-blue-50/20 cursor-pointer transition-all align-top">
                  <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase leading-tight">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 uppercase group-hover:text-blue-600 transition-colors truncate">{item.fullName}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-blue-600 whitespace-nowrap">
                      {item.serviceName.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    {canEditEnquiry(item.serviceName) ? (
                      <select value={item.status} onChange={e => handleStatusChange(item, e.target.value)} className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-none ring-1 ring-slate-100 bg-white cursor-pointer hover:ring-blue-300 transition-all">
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                    ) : <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.status}</span>}
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col gap-3">
                      {/* Remarks List View */}
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                        {item.remarks && item.remarks.length > 0 ? (
                          [...item.remarks].reverse().map((rem, idx) => {
                            const isOwner = user?.userId === rem.createdBy;
                            const isEditing = editingRemarkId === rem._id;

                            return (
                              <div key={idx} className={`p-3 rounded-xl border border-slate-100 group/remark ${isOwner ? 'bg-blue-50/30' : 'bg-slate-50/80'}`}>
                                <div className="flex UserDatajustify-between items-center mb-1">
                                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter flex items-center gap-1">
                                    {rem.fullName || 'User'} {isOwner && <HiOutlinePencilAlt size={10} className="text-slate-400" />}
                                  </span>
                                  <span className="text-[8px] text-slate-300 font-bold">{new Date(rem.createdAt).toLocaleDateString()}</span>
                                </div>
                                {isOwner && isEditing ? (
                                  <input
                                    autoFocus
                                    className="w-full bg-white text-[11px] font-bold text-slate-600 border-none ring-1 ring-blue-500 rounded p-1"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleUpdateRemark(item._id, rem._id!, editValue);
                                      if (e.key === 'Escape') setEditingRemarkId(null);
                                    }}
                                    onBlur={() => handleUpdateRemark(item._id, rem._id!, editValue)}
                                  />
                                ) : (
                                  <p
                                    onClick={() => { if (isOwner && rem._id) { setEditingRemarkId(rem._id); setEditValue(rem.text); } }}
                                    className={`text-[11px] font-bold text-slate-600 leading-snug break-all ${isOwner ? 'cursor-edit hover:text-blue-600' : ''}`}
                                  >
                                    {rem.text}
                                  </p>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-slate-300 italic font-medium">No notes recorded</span>
                        )}
                      </div>

                      {/* Add Button/Input */}
                      {/* Add Button/Input - Only show if user has write access */}
                      {canEditEnquiry(item.serviceName) && (
                        <>
                          {activeInputId === item._id ? (
                            <div className="relative">
                              <input
                                autoFocus
                                type="text"
                                placeholder="Type and press Enter..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddRemark(item, e.currentTarget.value);
                                  if (e.key === 'Escape') setActiveInputId(null);
                                }}
                                onBlur={(e) => handleAddRemark(item, e.target.value)}
                                className="w-full bg-white border-none rounded-xl px-4 py-2.5 text-xs font-bold ring-2 ring-blue-500 shadow-xl"
                              />
                              {savingId === item._id && <HiRefresh className="absolute right-3 top-3 w-4 h-4 text-blue-500 animate-spin" />}
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveInputId(item._id)}
                              className="flex items-center gap-2 w-fit px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                              <HiPlus size={12} /> Add Remark
                            </button>
                          )}
                        </>
                      )}
                      {successId === item._id && (
                        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase animate-pulse">
                          <HiCheckCircle /> Saved
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="mt-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-2"><HiOutlineCalendar className="text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Records Found: {pagination?.total}</span></div>
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
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Submission Dossier</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-10">Inquiry Profile</h2>

              <div className="space-y-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><HiOutlineUserCircle size={32} /></div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 tracking-tight break-all">{selectedEnquiry.fullName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedEnquiry.serviceName.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-50 flex items-center gap-3 overflow-hidden">
                      <HiOutlineMail className="text-blue-500 shrink-0" />
                      <span className="text-xs font-bold truncate break-all">{selectedEnquiry.email}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <HiOutlinePhone className="text-blue-500 shrink-0" />
                      <span className="text-xs font-bold">{selectedEnquiry.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-3">Customer Message</p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic break-all whitespace-pre-wrap">
                    "{selectedEnquiry.message}"
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <HiOutlineChatAlt size={18} /> Administrative Log ({selectedEnquiry.remarks?.length || 0})
                    </h4>
                  </div>

                  {selectedEnquiry.remarks && selectedEnquiry.remarks.length > 0 ? (
                    <div className="space-y-4 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-slate-100">
                      {[...selectedEnquiry.remarks].reverse().map((rem, idx) => (
                        <div key={idx} className="relative pl-12">
                          <div className="absolute left-[20px] top-2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white z-10"></div>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-slate-900 uppercase">
                                {rem?.fullName || "Staff"}
                              </span>
                              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                <HiOutlineClock />
                                {new Date(rem.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed break-all whitespace-pre-wrap">
                              {rem.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-200 text-center text-slate-400 italic text-xs font-bold">
                      No administrative logs found.
                    </div>
                  )}
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
