"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import {
  HiOutlineDownload,
  HiOutlineArrowLeft,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineHome,
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
  processingStatus: 'pending' | 'completed' | 'failed' | 'stuck';
  processingError?: string;
}

export const ApplicationListingPanel = ({ onBack }: { onBack: () => void }) => {
  const { userRole } = useAuth();
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, totalSuccesses: 0, totalFailures: 0   });

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
          <div className="px-6 py-3.5 bg-green-50 border-none rounded-2xl outline-none font-bold text-slate-600 cursor-pointer">
            Total Successes: <span className="text-slate-900">{pagination.totalSuccesses}</span>
          </div>
          <div className="px-6 py-3.5 bg-red-50 border-none rounded-2xl outline-none font-bold text-slate-600 cursor-pointer">
            Total Failures: <span className="text-slate-900">{pagination?.totalFailures}</span>
          </div>
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
                <th className="px-8 py-5">Processing Status</th>
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
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {item.processingStatus
                      ? item.processingStatus.toUpperCase()
                      : "COMPLETED"}
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