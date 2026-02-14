"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import {
  HiX, HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineDownload, HiXCircle,
  HiChevronLeft,
  HiChevronRight,
  HiRefresh,
  HiOutlineChatAlt,
  HiOutlineClock,
  HiOutlineCube,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineTruck,
  HiOutlinePencilAlt
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import { FaRegBuilding } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";

interface Remark {
  _id?: string;
  text: string;
  createdBy: string;
  createdAt: string;
  fullName: string;
}
interface PickupRequest {
  _id: string;
  // Consignor Details
  consignor_fullName: string;
  consignor_contactNo: string;
  consignor_alternateContactNo?: string;
  consignor_companyName?: string;
  consignor_email?: string;
  consignor_address: string;
  consignor_pinCode: string;

  // Consignee Details
  consignee_fullName: string;
  consignee_contactNo: string;
  consignee_alternateContactNo?: string;
  consignee_address: string;
  consignee_pinCode: string;

  // Pickup Details
  pickup_expectedDate: string;
  pickup_pickupTime?: string;
  pickup_pickupMode: string;
  pickup_loadType: string;

  // Product Details
  product_totalWeight: number;
  product_numberOfBoxes: number;
  product_boxLength?: number;
  product_boxBreadth?: number;
  product_boxHeight?: number;
  product_packagingType: string;
  product_materialType?: string;
  product_additionalNotes?: string;

  // Internal/System
  freight_mode: string;
  status: string;
  processingStatus: string;
  processingError?: string;
  remarks: Remark[];
  assigned_to: string;
  createdAt: string;
}


export const PickupListingPanel = ({ onBack }: { onBack: () => void }) => {
  const { user, hasPermission } = useAuth();

  const [data, setData] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);

  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [editValueAssignedTo, setEditValueAssignedTo] = useState("");

  // const today = new Date().toISOString().split("T")[0];
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const canEditStatus = hasPermission("pickup:edit") || user?.role === "SuperAdmin";
  const canExport = hasPermission("pickup:edit") || user?.role === "SuperAdmin";

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "100",
        ...(statusFilter && { status: statusFilter }),
        ...(modeFilter && { pickupMode: modeFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axiosInstance.get(`/forms/pickup?${params.toString()}`);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Database connection failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [statusFilter, modeFilter, startDate, endDate, searchTerm]);

  const handleStatusUpdate = async (id: string, newStatus: string): Promise<void> => {
    if (!canEditStatus) return;
    setSavingId(id);
    try {
      await axiosInstance.patch(`/forms/pickup/${id}/status`, { status: newStatus });
      setData(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
      toast.success(`STATUS: ${newStatus.toUpperCase()}`);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 1500);
    } catch {
      toast.error("Status Update Failed");
    } finally {
      setSavingId(null);
    }
  };

  const handleAddRemark = async (item: PickupRequest, newValue: string) => {
    if (!newValue.trim()) { setActiveInputId(null); return; }
    setSavingId(item._id);
    try {
      const response = await axiosInstance.put(`/forms/pickup/${item._id}`, { remarks: newValue });
      setData(prev => prev.map(i => i._id === item._id ? response.data.data : i));
      if (selectedPickup?._id === item._id) setSelectedPickup(response.data.data);
      setSuccessId(item._id);
      setActiveInputId(null);
      toast.success("LOG ENTRY SAVED");
      setTimeout(() => setSuccessId(null), 2000);
    } catch { toast.error(`Log Save Failed`); } finally { setSavingId(null); }
  };


  const handleUpdateRemark = async (pickupId: string, remarkId: string, updatedText: string) => {
    if (!updatedText.trim()) { setEditingRemarkId(null); return; }
    setSavingId(pickupId);
    try {
      const response = await axiosInstance.patch(`/forms/pickup/${pickupId}/remarks/${remarkId}`, { text: updatedText });
      setData(prev => prev.map(i => i._id === pickupId ? response.data.data : i));
      if (selectedPickup?._id === pickupId) setSelectedPickup(response.data.data);
      setEditingRemarkId(null);
      toast.success("LOG UPDATED");
    } catch { toast.error("Log Update Failed"); } finally { setSavingId(null); }
  };

  const downloadCSV = (): void => {
    if (!canExport) {
      toast.error("Unauthorized to export data");
      return;
    }
    const baseHeaders = ["Date", "Consignor", "From Pincode", "Consignee", "To Pincode", "Weight", "Mode", "Status", "Assigned To"];
    const remarkHeaders = Array.from({ length: 20 }, (_, i) => `Remark ${i + 1}`);
    const headers = [...baseHeaders, ...remarkHeaders];

    const csvRows = data.map(item => {
      const rowData = [
        new Date(item.createdAt).toLocaleDateString(),
        `"${item.consignor_fullName.replace(/"/g, '""')}"`,
        item.consignor_pinCode,
        `"${item.consignee_fullName.replace(/"/g, '""')}"`,
        item.consignee_pinCode,
        item.product_totalWeight,
        item.pickup_pickupMode,
        item.status.toUpperCase(),
        item?.assigned_to || "Unassigned",
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
    link.setAttribute("download", `Pickup_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const canEditPickup = () => {
    return user?.role === "SuperAdmin" || hasPermission(`pickup:edit`) || hasPermission("service:*:write");
  };

  const handleAssignedToChange = async (pickup: PickupRequest, newAssignedTo: string): Promise<void> => {
    if (!canEditPickup()) {
      toast.error("Unauthorized");
      return;
    }
    try {
      await axiosInstance.patch(`/forms/pickup/${pickup._id}/assignment`, { assigned_to: newAssignedTo });
      toast.success(`Assigned To updated for ${pickup.consignor_fullName}`);
      setData(prev => prev.map(item => item._id === pickup._id ? { ...item, assigned_to: newAssignedTo } : item));
      if (selectedPickup?._id === pickup._id) setSelectedPickup({ ...selectedPickup, assigned_to: newAssignedTo });
    } catch { toast.error("Failed to update Assigned To"); }
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
              Pickup <span className="text-[#074B83]">Operations</span> <span className="text-[#EE222F] italic text-xl font-bold ml-2">(EMS)</span>
            </h1>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="SEARCH_CONSIGNOR / PINCODE..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-b-2 border-slate-100 text-xs font-bold uppercase outline-none focus:border-[#074B83] focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {canExport && (
              <button onClick={downloadCSV} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#074B83] transition-all flex items-center gap-2">
                <HiOutlineDownload /> EXPORT_DATA
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-[1px] bg-slate-200 border border-slate-200 mb-10 shadow-sm">
          <div className="bg-white p-4 flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Transport Mode</span>
            <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} className="text-xs font-bold uppercase outline-none bg-transparent cursor-pointer">
              <option value="">ALL_MODES</option>
              <option value="Surface">Surface</option>
              <option value="Express">Express</option>
              <option value="Air">Air</option>
              <option value="Train">Train</option>
            </select>
          </div>
          <div className="bg-white p-4 flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Operation Status</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs font-bold uppercase outline-none bg-transparent cursor-pointer">
              <option value="">ALL_STATUS</option>
              <option value="new">NEW</option>
              <option value="assigned">ASSIGNED</option>
              <option value="picked">PICKED UP</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>
          <div className="bg-white p-4 flex flex-col md:col-span-2 lg:col-span-2 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Temporal Index (Expected)</span>
              {(startDate || endDate) && (
                <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-[9px] font-black text-[#EE222F] uppercase tracking-tighter hover:underline flex items-center gap-1">
                  <HiXCircle size={12} /> Clear_Range
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-xs font-bold outline-none uppercase bg-transparent" />
              <span className="text-slate-200 font-light">|</span>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-xs font-bold outline-none uppercase bg-transparent" />
            </div>
          </div>
          <div className="bg-slate-50 p-4 flex items-center justify-center border-l border-slate-100 text-center">
            {/* <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Process Active</p>
               <p className="text-[10px] font-bold text-[#074B83]">OPS_CENTER_V2</p>
             </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-fixed-layout border-collapse">
              <thead>
                <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-6 py-4 border-r border-slate-800 w-[140px]">EXPECTED_DATE</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[180px]">ROUTE (FROM/TO)</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[180px]">CONSIGNOR</th>
                  <th className="px-6 py-4 border-r border-slate-800 w-[140px]">LIFECYCLE</th>
                  <th className="px-6 py-4 w-[350px]">OPERATIONS_REMARKS</th>
                  <th className="px-8 py-6 w-[180px]">ASSIGNED TO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-xs font-black uppercase tracking-[0.4em] text-[#074B83] animate-pulse">Establishing Ops Link...</td></tr>
                ) : data.map((item) => (
                  <tr key={item._id} onClick={() => setSelectedPickup(item)}
                    className={`group hover:bg-slate-50 cursor-pointer border-l-4 border-transparent hover:border-l-[#074B83] transition-all
                    ${successId === item._id ? 'bg-emerald-50/50 border-l-emerald-500' : ''}`}>
                    <td className="px-6 py-6 border-r border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase">
                          {new Date(item.pickup_expectedDate).toLocaleDateString('en-GB')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {item.pickup_pickupTime || 'UNSCHEDULED'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <div className="w-px h-4 bg-slate-200"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">P{item.consignor_pinCode}</span>
                          <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">D{item.consignee_pinCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50">
                      <span className="text-sm font-black text-slate-900 uppercase truncate break-word-all">{item.consignor_fullName}</span>
                    </td>
                    <td className="px-6 py-6 border-r border-slate-50" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {canEditStatus ? (
                          <select
                            value={item.status}
                            onChange={e => handleStatusUpdate(item._id, e.target.value)}
                            className="text-[9px] font-black uppercase border border-slate-200 px-2 py-1 outline-none bg-white"
                          >
                            <option value="new">NEW</option>
                            <option value="assigned">ASSIGNED</option>
                            <option value="picked">PICKED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.status}</span>
                        )}
                        {savingId === item._id && <HiRefresh className="animate-spin text-[#074B83] w-3 h-3" />}
                      </div>
                    </td>
                    <td className="px-6 py-6" onClick={e => e.stopPropagation()}>
                      <div className="flex flex-col gap-2">
                        <div className="max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                          {item.remarks && Array.isArray(item.remarks) && item.remarks.length > 0 ? (
                            [...item.remarks].reverse().map((rem, idx) => {
                              const isOwner = user?.userId === rem.createdBy;
                              return (
                                <div key={idx} className="bg-slate-50 p-2 border-l-2 border-slate-300 mb-2 group/rem">
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
                                    <p onClick={() => { if (isOwner) { setEditingRemarkId(rem._id!); setEditValue(rem.text); } }}
                                      className={`text-[11px] font-bold text-slate-600 leading-tight break-word-all italic ${isOwner ? 'cursor-edit hover:text-blue-600' : ''}`}>
                                      {rem.text}
                                    </p>
                                  )}
                                </div>
                              );
                            })
                          ) : <span className="text-[10px] text-slate-300 font-bold uppercase italic">No Log Entry</span>}
                        </div>
                        <div className="mt-2">
                          {activeInputId === item._id ? (
                            <input autoFocus onKeyDown={e => e.key === 'Enter' && handleAddRemark(item, e.currentTarget.value)} onBlur={e => handleAddRemark(item, e.target.value)} placeholder="COMMIT_LOG..." className="w-full bg-slate-900 text-white text-[10px] font-black p-2 outline-none border-b-2 border-[#EE222F]" />
                          ) : <button onClick={() => setActiveInputId(item._id)} className="text-[9px] font-black text-[#074B83] uppercase">+ NEW_ENTRY</button>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                      {canEditPickup() ? (
                        <div className="relative group/assign">
                          {activeInputId === `${item._id}-assign` ? (
                            <input
                              autoFocus
                              className="w-full bg-white text-[11px] font-bold text-slate-600 border-none ring-2 ring-blue-500 rounded-lg p-2 shadow-lg"
                              value={editValueAssignedTo}
                              onChange={(e) => setEditValueAssignedTo(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAssignedToChange(item, editValueAssignedTo);
                                  setActiveInputId(null);
                                }
                                if (e.key === 'Escape') {
                                  setActiveInputId(null);
                                  setEditValueAssignedTo("");
                                }
                              }}
                              onBlur={() => {
                                handleAssignedToChange(item, editValueAssignedTo);
                                setActiveInputId(null);
                              }}
                              placeholder="Enter name..."
                            />
                          ) : (
                            <div
                              onClick={() => {
                                setActiveInputId(`${item._id}-assign`);
                                setEditValueAssignedTo(item?.assigned_to || "");
                              }}
                              className="flex items-center justify-between group-hover:bg-slate-50 p-2 rounded-lg transition-all cursor-text min-h-[32px]"
                            >
                              <span className={`text-[11px] font-bold ${item?.assigned_to ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                                {item?.assigned_to || "Click to assign..."}
                              </span>
                              <HiOutlinePencilAlt className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" size={14} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                          {item?.assigned_to || "Unassigned"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Global_Record_Count: {pagination.total}</span>
          <div className="flex border border-slate-200">
            <button disabled={pagination.page === 1} onClick={() => fetchData(pagination.page - 1)} className="p-3 border-r border-slate-200 hover:bg-slate-50 disabled:opacity-20"><HiChevronLeft /></button>
            <button disabled={pagination.page === pagination.totalPages} onClick={() => fetchData(pagination.page + 1)} className="p-3 hover:bg-slate-50 disabled:opacity-20"><HiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Sidebar Modal */}
      {selectedPickup && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPickup(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">

            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-8 flex justify-between items-center sticky top-0 z-10">
              <div>
                <p className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase mb-1">{selectedPickup.consignor_fullName}</p>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Pickup Request</h2>
              </div>
              <button onClick={() => setSelectedPickup(null)} className="hover:text-[#EE222F]"><HiX size={24} /></button>
            </div>

            <div className="p-8 md:p-12 space-y-10">

              <section>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
                  <HiOutlineLocationMarker size={18} /> Consignor Information
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <DetailItem label="Full Name" icon={IoIosPerson} value={selectedPickup.consignor_fullName} />
                  <DetailItem label="Company" icon={FaRegBuilding} value={selectedPickup.consignor_companyName} />

                  <DetailItem label="Contact Number" icon={HiOutlinePhone} value={selectedPickup.consignor_contactNo} />
                  <DetailItem label="Alt Contact" icon={HiOutlinePhone} value={selectedPickup.consignor_alternateContactNo} />
                  <div className="col-span-2">
                    <DetailItem label="Email Address" icon={HiOutlineMail} value={selectedPickup.consignor_email} />
                  </div>
                  <div className="col-span-2">
                    <DetailItem label="Pickup Address" value={selectedPickup.consignor_address} />
                  </div>
                  <DetailItem label="Pincode" value={selectedPickup.consignor_pinCode} highlight="text-blue-600 font-black" />
                </div>
              </section>

              {/* SECTION: CONSIGNEE (RECEIVER) */}
              <section>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-600 mb-6">
                  <HiOutlineLocationMarker size={18} /> Consignee Information
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-red-50/30 p-8 rounded-[2rem] border border-red-100/50">
                  <div className="col-span-2">
                    <DetailItem label="Full Name" value={selectedPickup.consignee_fullName} highlight="text-slate-900 text-base" />
                  </div>
                  <DetailItem label="Contact Number" icon={HiOutlinePhone} value={selectedPickup.consignee_contactNo} />
                  <DetailItem label="Alt Contact" icon={HiOutlinePhone} value={selectedPickup.consignee_alternateContactNo} />
                  <div className="col-span-2">
                    <DetailItem label="Delivery Address" value={selectedPickup.consignee_address} />
                  </div>
                  <DetailItem label="Pincode" value={selectedPickup.consignee_pinCode} highlight="text-red-600 font-black" />
                </div>
              </section>

              {/* SECTION: CARGO & PRODUCT DETAILS */}
              <section>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  <HiOutlineCube size={18} /> Shipment Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <DetailItem label="Weight (Kg)" value={`${selectedPickup.product_totalWeight} KG`} highlight="text-xl font-black text-slate-900" />
                  </div>
                  <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <DetailItem label="No. of Boxes" value={selectedPickup.product_numberOfBoxes} highlight="text-xl font-black text-slate-900" />
                  </div>
                  <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <DetailItem label="Box Size (L×B×H)" value={selectedPickup.product_boxLength ? `${selectedPickup.product_boxLength} × ${selectedPickup.product_boxBreadth} × ${selectedPickup.product_boxHeight}` : "Not Provided"} />
                  </div>
                  <DetailItem label="Material Type" value={selectedPickup.product_materialType} />
                  <DetailItem label="Freight Mode" value={selectedPickup.freight_mode} highlight="font-black text-emerald-600" />
                  <DetailItem
                    label="Packaging"
                    value={selectedPickup.product_packagingType}
                  />
                </div>
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <DetailItem label="Shipment Instructions" value={selectedPickup.product_additionalNotes || "Standard handling."} />
                </div>
              </section>

              {/* SECTION: LOGISTICS & STATUS */}
              <section>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  <HiOutlineTruck size={18} /> Logistics & Lifecycle
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-3xl text-white">
                    <HiOutlineClock size={32} className="text-blue-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Pickup Schedule</p>
                      <p className="text-sm font-bold">{new Date(selectedPickup.pickup_expectedDate).toLocaleDateString('en-IN')}</p>
                      <p className="text-[10px] font-black text-blue-400 uppercase">{selectedPickup.pickup_pickupTime || 'Flexible Time'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-3xl text-white">
                    <HiOutlineTruck size={32} className="text-emerald-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Transport</p>
                      <p className="text-sm font-bold uppercase">{selectedPickup.pickup_pickupMode}</p>
                      <p className="text-[10px] font-black text-emerald-400 uppercase">Load: {selectedPickup.pickup_loadType}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-100">
                    <DetailItem label="Current Status" value={selectedPickup.status.toUpperCase()} highlight="text-blue-600 font-black" />
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-100">
                    <DetailItem label="Processing" value={selectedPickup.processingStatus.toUpperCase()} />
                  </div>
                </div>
              </section>

              {/* SECTION: REMARKS & ERRORS */}
              <section className="pb-20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <HiOutlineChatAlt size={18} /> Administrative Log ({selectedPickup.remarks?.length || 0})
                    </h4>
                  </div>

                  {selectedPickup.remarks && selectedPickup.remarks.length > 0 ? (
                    <div className="space-y-4 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-slate-100">
                      {[...selectedPickup.remarks].reverse().map((rem, idx) => (
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
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, icon: Icon, highlight }: { label: string, value: any, icon?: any, highlight?: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
      {Icon && <Icon size={12} />} {label}
    </span>
    <span className={`text-sm font-bold leading-tight ${highlight || 'text-slate-800'}`}>
      {value || "—"}
    </span>
  </div>
);