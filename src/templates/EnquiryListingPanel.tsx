"use client";

import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import {
  HiX, HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineDownload, HiXCircle,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePencilAlt,
  HiRefresh // Added for the spinner
} from "react-icons/hi";
import { toast } from "react-hot-toast";

interface Remark { _id?: string; text: string; createdBy: string; createdAt: string; fullName: string; }
interface Enquiry { _id: string; fullName: string; email: string; phone: string; serviceName: string; query: string; message: string; status: string; remarks: Remark[]; createdAt: string; assigned_to: string; type_of_query: string; }

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
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editValueAssignedTo, setEditValueAssignedTo] = useState("");

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

  const canEditEnquiry = (enqService: string) => user?.role === "SuperAdmin" || hasPermission(`service:${enqService}:write`) || hasPermission("service:*:write");

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/forms`, {
        params: { page, limit: 100, serviceName, status: statusFilter, search: searchTerm, startDate, endDate }
      });
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) { toast.error("Database connection failure"); } finally { setLoading(false); }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delay);
  }, [serviceName, statusFilter, searchTerm, startDate, endDate]);

  const handleStatusChange = async (enquiry: Enquiry, newStatus: string) => {
    if (!canEditEnquiry(enquiry.serviceName)) return;
    setSavingId(enquiry._id);
    try {
      await axiosInstance.patch(`/forms/${enquiry._id}/status`, { status: newStatus });
      setData(prev => prev.map(item => item._id === enquiry._id ? { ...item, status: newStatus } : item));
      toast.success(`STATUS: ${newStatus.toUpperCase()}`);
      setSuccessId(enquiry._id);
      setTimeout(() => setSuccessId(null), 1500);
    } catch { toast.error("Status Update Failed"); } finally { setSavingId(null); }
  };

  const handleTypeOfQueryChange = async (enquiry: Enquiry, newType: string) => {
    if (!canEditEnquiry(enquiry.serviceName)) return;
    try {
      await axiosInstance.patch(`/forms/${enquiry._id}/assignment`, { type_of_query: newType });
      setData(prev => prev.map(item => item._id === enquiry._id ? { ...item, type_of_query: newType } : item));
      toast.success("CLASSIFICATION UPDATED");
    } catch { toast.error("Classification Failed"); }
  };

  const handleAssignedToChange = async (enquiry: Enquiry, newAssignedTo: string) => {
    if (!canEditEnquiry(enquiry.serviceName)) return;
    setSavingId(enquiry._id);
    try {
      await axiosInstance.patch(`/forms/${enquiry._id}/assignment`, { assigned_to: newAssignedTo });
      setData(prev => prev.map(item => item._id === enquiry._id ? { ...item, assigned_to: newAssignedTo } : item));
      toast.success(`ASSIGNED TO: ${newAssignedTo || 'UNASSIGNED'}`);
      setSuccessId(enquiry._id);
      setTimeout(() => setSuccessId(null), 1500);
    } catch { toast.error("Assignment Failed"); } finally { setSavingId(null); }
  };

  const handleAddRemark = async (item: Enquiry, newValue: string) => {
    if (!newValue.trim()) { setActiveInputId(null); return; }
    setSavingId(item._id);
    try {
      const response = await axiosInstance.put(`/forms/${item._id}`, { remarks: newValue });
      setData(prev => prev.map(i => i._id === item._id ? response.data.data : i));
      setSuccessId(item._id);
      setActiveInputId(null);
      toast.success("LOG ENTRY SAVED");
      setTimeout(() => setSuccessId(null), 2000);
    } catch { toast.error("Log Entry Failed"); } finally { setSavingId(null); }
  };

  const handleUpdateRemark = async (enquiryId: string, remarkId: string, updatedText: string) => {
    if (!updatedText.trim()) { setEditingRemarkId(null); return; }
    setSavingId(enquiryId); // Using it here to fix the build error
    try {
      const response = await axiosInstance.patch(`/forms/${enquiryId}/remarks/${remarkId}`, { text: updatedText });
      setData(prev => prev.map(i => i._id === enquiryId ? response.data.data : i));
      setEditingRemarkId(null);
      toast.success("LOG UPDATED");
    } catch { toast.error("Log Update Failed"); } finally { setSavingId(null); }
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("NO DATA FOR EXPORT");
      return;
    }
    const baseHeaders = ["Date", "Full Name", "Email", "Phone", "Service", "Status", "Message", "Type of Query", "Assigned To"];
    const remarkHeaders = Array.from({ length: 20 }, (_, i) => `Remarks ${i + 1}`);
    const headers = [...baseHeaders, ...remarkHeaders];
    const csvRows = data.map(item => {
      const rowData = [
        new Date(item.createdAt).toLocaleDateString(),
        `"${(item.fullName || "").replace(/"/g, '""')}"`,
        item.email,
        item.phone,
        item.serviceName,
        item.status.toUpperCase(),
        `"${(item.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        item?.type_of_query || "EMPTY",
        item?.assigned_to || "UNASSIGNED",
      ];
      const sortedRemarks = [...(item.remarks || [])].reverse();
      for (let i = 0; i < 20; i++) {
        rowData.push(sortedRemarks[i] ? `"${sortedRemarks[i]?.text.replace(/"/g, '""')}"` : "");
      }
      return rowData.join(",");
    });
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Enquiry${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 border-t-4 border-[#074B83]">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; }
        .table-fixed-layout { table-layout: fixed; width: 100%; }
        .break-word-all { word-break: break-all; overflow-wrap: break-word; }
      `}</style>

      <div className="max-w-[1800px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 border-b border-slate-100 pb-8 gap-6">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#074B83] transition-colors mb-4">
              <HiOutlineArrowLeft /> SYSTEM_DASHBOARD
            </button>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none">
              Enquiry <span className="text-[#074B83]">Panel</span> <span className="text-[#EE222F] italic text-xl font-bold ml-2">(EMS)</span>
            </h1>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="SEARCH_INDEX (EMAIL/PHONE)..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-b-2 border-slate-100 text-xs font-bold uppercase outline-none focus:border-[#074B83] focus:bg-white transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={downloadCSV} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#074B83] transition-all flex items-center gap-2">
              <HiOutlineDownload /> EXPORT_DATA
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-[1px] bg-slate-200 border border-slate-200 mb-10 shadow-sm">
          <div className="bg-white p-4 flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Service Filter</span>
            <select value={serviceName} onChange={e => setServiceName(e.target.value)} className="text-xs font-bold uppercase outline-none bg-transparent cursor-pointer">
              <option value="">ALL_SERVICES</option>
              {allowedServices.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="bg-white p-4 flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Status Filter</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs font-bold uppercase outline-none bg-transparent cursor-pointer">
              <option value="">ALL_STATUS</option>
              <option value="new">NEW</option>
              <option value="contacted">CONTACTED</option>
              <option value="resolved">RESOLVED</option>
            </select>
          </div>
          <div className="bg-white p-4 flex flex-col md:col-span-2 lg:col-span-2 relative group/calendar">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                Temporal Index (Range)
              </span>
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="text-[9px] font-black text-[#EE222F] uppercase tracking-tighter hover:underline flex items-center gap-1"
                >
                  <HiXCircle size={12} /> Clear_Range
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                max={today}
                onChange={e => setStartDate(e.target.value)}
                className="text-xs font-bold outline-none uppercase bg-transparent cursor-pointer hover:text-[#074B83] transition-colors"
              />
              <span className="text-slate-200 font-light">|</span>
              <input
                type="date"
                value={endDate}
                max={today}
                onChange={e => setEndDate(e.target.value)}
                className="text-xs font-bold outline-none uppercase bg-transparent cursor-pointer hover:text-[#074B83] transition-colors"
              />
            </div>
          </div>
          <div className="bg-slate-50 p-4 flex items-center justify-center border-l border-slate-100">
             {/* <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase">Process ID</p>
                <p className="text-[10px] font-bold text-[#074B83]">EMS_ACTIVE</p>
             </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-fixed-layout border-collapse">
              <thead>
                <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-6 py-4 border-r border-slate-800 w-[120px]">DATE</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[180px]">IDENTIFIER</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[140px]">SOURCE</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[140px]">STATUS</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[220px]">CLASSIFICATION</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[450px]">REMARKS</th>
                  <th className="px-6 py-4 w-[180px]">ASSIGNED TO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={7} className="py-20 text-center text-xs font-black uppercase tracking-[0.4em] text-[#074B83] animate-pulse">Establishing Data Stream...</td></tr>
                ) : data.map((item) => (
                  <tr key={item._id} onClick={() => setSelectedEnquiry(item)}
                    className={`group hover:bg-slate-50 cursor-pointer border-l-4 border-transparent hover:border-l-[#074B83] transition-all
                      ${successId === item._id ? 'bg-emerald-50/50 border-l-emerald-500' : ''}`}>
                    <td className="px-6 py-6 text-[10px] font-black text-slate-400 border-r border-slate-50">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-6 border-r border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase truncate break-word-all">{item.fullName}</span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{item.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50">
                      <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-1">{item.serviceName.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <select value={item.status} onChange={e => handleStatusChange(item, e.target.value)} className="text-[9px] font-black uppercase border border-slate-200 px-2 py-1 outline-none bg-white">
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="resolved">RESOLVED</option>
                        </select>
                        {savingId === item._id && <HiRefresh className="animate-spin text-[#074B83] w-3 h-3" />}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50" onClick={e => e.stopPropagation()}>
                      <select value={item.type_of_query} onChange={e => handleTypeOfQueryChange(item, e.target.value)} className="w-full text-[9px] font-black uppercase border border-slate-200 px-2 py-1 outline-none">
                        <option value="EMPTY"># EMPTY</option>
                        <option value="BILL_COPY">BILL COPY</option>
                        <option value="CORPORATE_COMMUNICATION">CORPORATE COMM.</option>
                        <option value="DAMAGE">DAMAGE</option>
                        <option value="DELIVERY_TRACKING">DELIVERY/TRACKING</option>
                        <option value="EMPLOYEE_HR_RELATED">EMPLOYEE/HR</option>
                        <option value="FRANCHISE_QUERY">FRANCHISE QUERY</option>
                        <option value="LEGAL">LEGAL</option>
                        <option value="NEW_BUSINESS_QUERY">BUSINESS QUERY</option>
                        <option value="OPERATION_RELATED">OPERATION</option>
                        <option value="OTHER">OTHER</option>
                        <option value="PAYMENTS">PAYMENTS</option>
                        <option value="PICK_UP_RELATED">PICK UP</option>
                        <option value="POD_RELATED">POD RELATED</option>
                        <option value="TAX_RELATED">TAX RELATED</option>
                        <option value="UNDELIVERED_SHIPMENTS">UNDELIVERED</option>
                        <option value="VEHICLE_ATTACHMENT_RELATED">VEHICLE ATTACH.</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50" onClick={e => e.stopPropagation()}>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                        {item.remarks && item.remarks.length > 0 ? (
                          [...item.remarks].reverse().map((rem, idx) => (
                            <div key={idx} className="bg-slate-50 p-2 border-l-2 border-slate-300 group/rem">
                              <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 mb-1">
                                <span>{rem.fullName}</span>
                                <span>{new Date(rem.createdAt).toLocaleDateString()}</span>
                              </div>
                              {editingRemarkId === rem._id ? (
                                <div className="flex items-center gap-2">
                                  <input autoFocus className="w-full text-[11px] font-bold border-b border-blue-500 outline-none"
                                    value={editValue} onChange={e => setEditValue(e.target.value)}
                                    onBlur={() => handleUpdateRemark(item._id, rem._id!, editValue)}
                                    onKeyDown={e => e.key === 'Enter' && handleUpdateRemark(item._id, rem._id!, editValue)} />
                                  {savingId === item._id && <HiRefresh className="animate-spin text-blue-500 w-3 h-3" />}
                                </div>
                              ) : (
                                <p onClick={() => { if (user?.userId === rem.createdBy) { setEditingRemarkId(rem._id!); setEditValue(rem.text); } }}
                                  className="text-[11px] font-bold text-slate-600 leading-tight break-word-all cursor-edit">{rem.text}</p>
                              )}
                            </div>
                          ))
                        ) : <span className="text-[10px] text-slate-300 font-bold uppercase italic">No Entry</span>}
                      </div>
                      <div className="mt-4">
                        {activeInputId === item._id ? (
                          <div className="relative">
                            <input autoFocus
                              onKeyDown={e => e.key === 'Enter' && handleAddRemark(item, e.currentTarget.value)}
                              onBlur={e => handleAddRemark(item, e.target.value)}
                              placeholder="COMMIT_REMARK..."
                              className="w-full bg-slate-900 text-white text-[10px] font-black p-2 outline-none border-b-2 border-[#EE222F]" />
                            {savingId === item._id && <HiRefresh className="absolute right-2 top-2 animate-spin text-white w-3 h-3" />}
                          </div>
                        ) : (
                          <button onClick={() => setActiveInputId(item._id)} className="text-[9px] font-black text-[#074B83] uppercase">+ NEW_LOG</button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6" onClick={e => e.stopPropagation()}>
                      <div onClick={() => { setActiveInputId(`${item._id}-assign`); setEditValueAssignedTo(item.assigned_to || ""); }} className="flex items-center justify-between cursor-text">
                        {activeInputId === `${item._id}-assign` ? (
                          <div className="relative flex-1">
                            <input
                              autoFocus
                              className="w-full text-xs font-bold border border-slate-900 p-1 outline-none"
                              value={editValueAssignedTo}
                              onChange={e => setEditValueAssignedTo(e.target.value)}
                              onBlur={() => { handleAssignedToChange(item, editValueAssignedTo); setActiveInputId(null); }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') { handleAssignedToChange(item, editValueAssignedTo); setActiveInputId(null); }
                                if (e.key === 'Escape') setActiveInputId(null);
                              }}
                            />
                            {savingId === item._id && <HiRefresh className="absolute right-1 top-1 animate-spin text-slate-900 w-3 h-3" />}
                          </div>
                        ) : (
                          <>
                            <span className={`text-[11px] font-black uppercase ${item.assigned_to ? 'text-slate-900' : 'text-slate-200'}`}>{item.assigned_to || 'UNASSIGNED'}</span>
                            <HiOutlinePencilAlt className="text-slate-300" />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Total_Count: {pagination.total}</span>
          <div className="flex border border-slate-200">
            <button onClick={() => fetchData(pagination.page - 1)} disabled={pagination.page === 1} className="p-3 border-r border-slate-200 hover:bg-slate-50 disabled:opacity-20"><HiChevronLeft /></button>
            <button onClick={() => fetchData(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="p-3 hover:bg-slate-50 disabled:opacity-20"><HiChevronRight /></button>
          </div>
        </div>
      </div>

      {selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)}></div>
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto border-l-4 border-[#074B83]">
            <div className="bg-slate-900 text-white p-8 flex justify-between items-center sticky top-0 z-10">
              <div>
                {/* <p className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase mb-1">Dossier Access</p> */}
                <h2 className="text-2xl font-black uppercase tracking-tighter">Enquiry Details</h2>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="hover:text-[#EE222F]"><HiX size={24} /></button>
            </div>

            <div className="p-10 space-y-12">
              <section>
                <h4 className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 pb-2 mb-6 tracking-widest">Client Identity</h4>
                <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                  <ProfileField label="Full Name" value={selectedEnquiry.fullName} />
                  <ProfileField label="Source" value={selectedEnquiry.serviceName} highlight />
                  <ProfileField label="Email Id" value={selectedEnquiry.email} lower />
                  <ProfileField label="Contact Phone" value={selectedEnquiry.phone} />
                  <ProfileField label="Classification" value={selectedEnquiry.type_of_query || "N/A"} />
                  <ProfileField label="Assigned Personnel" value={selectedEnquiry.assigned_to || "NOT_ASSIGNED"} />
                  <ProfileField label="Creation Date" value={new Date(selectedEnquiry.createdAt).toLocaleString()} />
                  <ProfileField label="System ID" value={selectedEnquiry._id} lower />
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 pb-2 mb-6 tracking-widest">Customer Submission Content</h4>
                <div className="bg-slate-50 p-6 border-l-4 border-slate-900 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Message Payload:</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic break-word-all">
                    "{selectedEnquiry.message || selectedEnquiry.query || 'NO_CONTENT'}"
                  </p>
                </div>
              </section>

              <section className="pb-20">
                <h4 className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 pb-2 mb-6 tracking-widest">Administrative Audit Trail</h4>
                <div className="space-y-6">
                  {selectedEnquiry.remarks && selectedEnquiry.remarks.length > 0 ? (
                    [...selectedEnquiry.remarks].reverse().map((rem, i) => (
                      <div key={i} className="border-l-2 border-slate-200 pl-6 relative">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 bg-[#074B83]"></div>
                        <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                          <span className="text-[#074B83]">{rem.fullName}</span>
                          <span className="text-slate-300">{new Date(rem.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-600 leading-tight break-word-all">{rem.text}</p>
                      </div>
                    ))
                  ) : <p className="text-xs italic text-slate-300 font-bold uppercase">No log entries found for this dossier.</p>}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileField = ({ label, value, highlight, lower }: { label: string, value: string, highlight?: boolean, lower?: boolean }) => (
  <div className="break-word-all">
    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{label}</p>
    <p className={`text-base font-black tracking-tight uppercase ${highlight ? 'text-[#074B83]' : 'text-slate-900'} ${lower ? 'lowercase font-mono text-sm tracking-normal' : ''}`}>
      {(value || "").replace('_', ' ')}
    </p>
  </div>
);