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
  HiOutlineClock
} from "react-icons/hi";
import { toast } from "react-hot-toast";

interface PickupRequest {
  _id: string;
  consignor_fullName: string;
  consignor_contactNo: string;
  consignor_email: string;
  consignor_address: string;
  consignor_pinCode: string;
  consignee_fullName: string;
  consignee_address: string;
  consignee_pinCode: string;
  pickup_expectedDate: string;
  pickup_pickupTime: string;      
  pickup_pickupMode: string;
  pickup_loadType: string;
  product_totalWeight: number;
  product_numberOfBoxes: number;
  product_packagingType: string;
  product_additionalNotes: string; 
  freight_mode: string;
  status: string;
  processingStatus: string;
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

  const handleStatusUpdate = async (
  id: string,
  newStatus: string
): Promise<void> => {
  if (!canEditStatus) {
    toast.error("Unauthorized to update status");
    return;
  }

  try {
    await axiosInstance.patch(
      `/forms/pickup/${id}/status`,
      { status: newStatus }
    );

    toast.success("Status Synchronized");

    setData(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, status: newStatus }
          : item
      )
    );
  } catch {
    toast.error("Status update failed");
  }
};


  const downloadCSV = (): void => {
  if (!canExport) {
    toast.error("Unauthorized to export data");
    return;
  }

  const headers = [
    "Date",
    "Consignor",
    "From Pincode",
    "Consignee",
    "To Pincode",
    "Weight",
    "Mode",
    "Status",
  ];

  const rows = data.map(item => [
    new Date(item.createdAt).toLocaleDateString(),
    item.consignor_fullName,
    item.consignor_pinCode,
    item.consignee_fullName,
    item.consignee_pinCode,
    item.product_totalWeight,
    item.pickup_pickupMode,
    item.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Pickup_Requests_${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  a.click();
};

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
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

        <div className="flex flex-wrap items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
            <HiOutlineFilter className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Filters</span>
          </div>

          <select value={modeFilter} onChange={e => setModeFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none">
            <option value="">All Transport Modes</option>
            <option value="Surface">Surface</option>
            <option value="Express">Express</option>
            <option value="Air">Air</option>
            <option value="Train">Train</option>
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-black uppercase text-slate-600 outline-none">
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

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Pickup Date</th>
                <th className="px-8 py-6">From/To</th>
                <th className="px-8 py-6">Consignor</th>
                <th className="px-8 py-6">Cargo Detail</th>
                <th className="px-8 py-6">Status</th>
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
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                       <span className="bg-slate-100 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter text-slate-600">{item.product_totalWeight} KG</span>
                       <span className="bg-blue-50 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter text-blue-600">{item.pickup_pickupMode}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    {canEditStatus ? (
                      <select 
                        value={item.status} 
                        onChange={e => handleStatusUpdate(item._id, e.target.value)}
                        className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg outline-none ring-1 transition-all ${
                          item.status === 'picked' ? 'bg-green-50 text-green-600 ring-green-200' :
                          item.status === 'cancelled' ? 'bg-red-50 text-red-600 ring-red-200' : 'bg-blue-50 text-blue-600 ring-blue-200'
                        }`}
                      >
                        <option value="new">NEW</option>
                        <option value="assigned">ASSIGNED</option>
                        <option value="picked">PICKED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex items-center justify-between px-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Requests: {pagination.total}</p>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1} 
              onClick={() => fetchData(pagination.page - 1)}
              className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <HiChevronLeft size={20} />
            </button>
            <button 
              disabled={pagination.page === pagination.totalPages} 
              onClick={() => fetchData(pagination.page + 1)}
              className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {selectedPickup && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPickup(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto border-l border-slate-100">
            <div className="p-12">
              <button onClick={() => setSelectedPickup(null)} className="mb-10 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><HiX size={24} /></button>
              
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Request Manifest</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-10">Pickup Details</h2>

              <div className="space-y-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <HiOutlineLocationMarker className="text-blue-500" size={24} />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Route Information</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Origin</p>
                      <p className="font-bold text-slate-800 leading-tight mb-2">{selectedPickup.consignor_fullName}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedPickup.consignor_address}</p>
                      <p className="text-sm font-black text-blue-600 mt-2">{selectedPickup.consignor_pinCode}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Destination</p>
                      <p className="font-bold text-slate-800 leading-tight mb-2">{selectedPickup.consignee_fullName}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedPickup.consignee_address}</p>
                      <p className="text-sm font-black text-red-600 mt-2">{selectedPickup.consignee_pinCode}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 border border-slate-100 rounded-[2.5rem] flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><HiOutlineCube size={28} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Payload</p>
                      <p className="text-xl font-black text-slate-900">{selectedPickup.product_totalWeight} KG</p>
                    </div>
                  </div>
                  <div className="p-8 border border-slate-100 rounded-[2.5rem] flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><HiOutlineClock size={28} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Schedule</p>
                      <p className="text-xl font-black text-slate-900">{new Date(selectedPickup.pickup_expectedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Product Instructions</p>
                    <p className="text-sm font-medium text-slate-700 italic">
                        "{selectedPickup.product_additionalNotes || 'Standard handling procedure.'}"
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};