"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import {
  HiOutlineArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineSearch,
  HiOutlineFilter,
  HiX,
  HiOutlineDownload,
  HiOutlineLocationMarker,
  HiOutlineCube,
  HiOutlineClock,
  HiCheckCircle,
  HiRefresh,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlinePhone
} from "react-icons/hi";
import { FaRegBuilding } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { IoIosPerson } from "react-icons/io";

// Helper component for clean data rendering
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
  remarks?: string;
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

  const canEditStatus = hasPermission("pickup:edit") || user?.role === "SuperAdmin";
  const canExport = hasPermission("pickup:export") || user?.role === "SuperAdmin";

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
      toast.error("Error fetching pickup requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [statusFilter, modeFilter, startDate, endDate, searchTerm]);

  const handleStatusUpdate = async (id: string, newStatus: string): Promise<void> => {
    if (!canEditStatus) {
      toast.error("Unauthorized to update status");
      return;
    }
    try {
      await axiosInstance.patch(`/forms/pickup/${id}/status`, { status: newStatus });
      toast.success("Status Synchronized");
      setData(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleTableRemarkUpdate = async (item: PickupRequest, newValue: string) => {
    const originalValue = item.remarks || "";
    if (newValue === originalValue) return;
    if (!canEditStatus) return;

    setSavingId(item._id);
    try {
      await axiosInstance.put(`/forms/pickup/${item._id}`, { remarks: newValue });
      setData(prev => prev.map(i => i._id === item._id ? { ...i, remarks: newValue } : i));
      setSuccessId(item._id);
      setTimeout(() => setSuccessId(null), 2000);
      toast.success("Remarks Saved");
    } catch (err) {
      toast.error(`Failed to save remarks`);
    } finally {
      setSavingId(null);
    }
  };

  const downloadCSV = (): void => {
    if (!canExport) {
      toast.error("Unauthorized to export data");
      return;
    }
    const headers = ["Date", "Consignor", "From Pincode", "Consignee", "To Pincode", "Weight", "Mode", "Status", "Remarks"];
    const rows = data.map(item => [
      new Date(item.createdAt).toLocaleDateString(),
      `"${item.consignor_fullName.replace(/"/g, '""')}"`,
      item.consignor_pinCode,
      `"${item.consignee_fullName.replace(/"/g, '""')}"`,
      item.consignee_pinCode,
      item.product_totalWeight,
      item.pickup_pickupMode,
      item.status.toUpperCase(),
      `"${(item.remarks || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Pickup_Requests_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <button onClick={onBack} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all mb-4">
              <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Exit to Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Pickup <span className="text-blue-600">Operations</span>
            </h1>
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            {canExport && (
              <button onClick={downloadCSV} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                <HiOutlineDownload size={18} /> Export Data
              </button>
            )}
            <div className="relative flex-1 lg:w-80">
              <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search Consignor or Pincode..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
            <HiOutlineFilter className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Filters</span>
          </div>

          <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none cursor-pointer">
            <option value="">All Transport Modes</option>
            <option value="Surface">Surface</option>
            <option value="Express">Express</option>
            <option value="Air">Air</option>
            <option value="Train">Train</option>
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none cursor-pointer">
            <option value="">Lifecycle Status</option>
            <option value="new">NEW REQUEST</option>
            <option value="assigned">ASSIGNED</option>
            <option value="picked">PICKED UP</option>
            <option value="cancelled">CANCELLED</option>
          </select>

          <div className="flex items-center gap-4 ml-auto">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">To</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Pickup Date</th>
                <th className="px-8 py-6">From/To</th>
                <th className="px-8 py-6">Consignor</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 w-1/4">Operations Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Initializing Data Stream...</td></tr>
              ) : data.map((item) => (
                <tr key={item._id} onClick={() => setSelectedPickup(item)} className="group hover:bg-blue-50/20 cursor-pointer transition-all">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{new Date(item.pickup_expectedDate).toLocaleDateString('en-GB')}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.pickup_pickupTime || 'Unscheduled'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-slate-800">{item.consignor_pinCode}</span>
                        <span className="text-[11px] font-black text-slate-800">{item.consignee_pinCode}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase">{item.consignor_fullName}</span>
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <select
                      value={item.status}
                      onChange={e => handleStatusUpdate(item._id, e.target.value)}
                      className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg outline-none ring-1 transition-all bg-white ${item.status === 'picked' ? 'bg-green-50 text-green-600 ring-green-200' :
                        item.status === 'cancelled' ? 'bg-red-50 text-red-600 ring-red-200' : 'bg-blue-50 text-blue-600 ring-blue-200'
                        }`}
                    >
                      <option value="new">NEW</option>
                      <option value="assigned">ASSIGNED</option>
                      <option value="picked">PICKED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        defaultValue={item.remarks}
                        onBlur={(e) => handleTableRemarkUpdate(item, e.target.value)}
                        placeholder="Add log entry..."
                        className={`w-full border-none rounded-xl px-4 py-2.5 text-xs font-bold transition-all placeholder:text-slate-300 shadow-sm
                              ${successId === item._id ? 'bg-emerald-50 ring-2 ring-emerald-500 pr-10' : 'bg-slate-50 focus:ring-1 focus:ring-blue-500'}
                            `}
                      />
                      <div className="absolute right-3">
                        {savingId === item._id && <HiRefresh className="w-4 h-4 text-blue-500 animate-spin" />}
                        {successId === item._id && <HiCheckCircle className="w-5 h-5 text-emerald-500" />}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-between px-6 pb-10">
          <div className="flex items-center gap-2">
            <HiOutlineCalendar className="text-slate-300" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Requests: {pagination?.total}
            </span>
          </div>
          <div className="flex gap-2">
            <button disabled={pagination.page === 1} onClick={() => fetchData(pagination.page - 1)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"><HiChevronLeft size={20} /></button>
            <button disabled={pagination.page === pagination.totalPages} onClick={() => fetchData(pagination.page + 1)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"><HiChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* DETAILED SIDEBAR MODAL */}
      {selectedPickup && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPickup(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-100 p-8 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">Full Request Manifest</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter capitalize">{selectedPickup.consignor_fullName}</h2>
              </div>
              <button onClick={() => setSelectedPickup(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                <HiX size={24} />
              </button>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              
              {/* SECTION: CONSIGNOR (SENDER) */}
              <section>
                <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
                  <HiOutlineLocationMarker size={18} /> Consignor Information
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  {/* <div className="col-span-2">
                    <DetailItem label="Full Name / Company" value={`${selectedPickup.consignor_fullName} ${selectedPickup.consignor_companyName ? `(${selectedPickup.consignor_companyName})` : ''}`} highlight="text-slate-900 text-base" />
                  </div> */}
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
                  {/* <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <DetailItem label="Packaging" value={selectedPickup.product_packagingType} />
                  </div> */}
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
                <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">
                    <HiOutlineInformationCircle size={16} /> Operations Log
                  </h4>
                  <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                    "{selectedPickup.remarks || 'No internal remarks noted for this request.'}"
                  </p>
                  {selectedPickup.processingError && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-[10px] font-mono border border-red-200">
                      SYSTEM_ERROR: {selectedPickup.processingError}
                    </div>
                  )}
                  <div className="mt-6 pt-6 border-t border-emerald-100 text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">
                    Created At: {new Date(selectedPickup.createdAt).toLocaleString()}
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};