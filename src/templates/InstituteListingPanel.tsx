"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import { HiOutlineDownload, HiOutlineArrowLeft, HiOutlineMail, HiOutlinePhone, HiX, HiChevronLeft, HiChevronRight, HiOutlineSearch } from "react-icons/hi";
import { toast } from "react-hot-toast";

export const InstituteListingPanel = ({ onBack }: { onBack: () => void }) => {
  const { userRole } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/forms/institute?page=${page}&search=${searchTerm}&status=${statusFilter}`);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchData(1), 500);
    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter]);

  const handleDownload = (e: any, id: string) => {
    e.stopPropagation();
    window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/institute/${id}/download`, "_blank");
  };

  const handleStatusChange = async (e: any, id: string) => {
    e.stopPropagation();
    if (userRole !== "SuperAdmin") return;
    try {
      await axiosInstance.patch(`/forms/institute/${id}/status`, { status: e.target.value });
      toast.success("Status Updated");
      fetchData(pagination.page);
    } catch (error) { toast.error("Update failed"); }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 flex items-center gap-2 transition-colors">
              <HiOutlineArrowLeft /> Back to Selection
            </button>
            <h1 className="text-5xl font-extralight text-slate-900 tracking-tighter">Institute <span className="font-medium text-blue-600">Admissions</span></h1>
          </div>
          <div className="w-full md:w-96 relative group">
            <input placeholder="Search by name, email or phone..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none text-slate-900 font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <HiOutlineSearch className="absolute right-6 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Applicant</th>
                <th className="px-8 py-5">Academic (High School)</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-24 text-center animate-pulse font-bold tracking-widest text-xs uppercase text-blue-600">Syncing Applications...</td></tr>
              ) : data.map((item: any) => (
                <tr key={item._id} onClick={() => setSelectedApp(item)} className="hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{item.email} • {item.contactNo}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-slate-700">{item.instituteName}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">{item.board} • {item.percentageObtained}%</div>
                  </td>
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <select value={item.status} disabled={userRole !== "SuperAdmin"} onChange={e => handleStatusChange(e, item._id)} className="text-[10px] font-black rounded-lg border-none px-3 py-1.5 bg-white shadow-sm ring-1 ring-slate-100 text-blue-600 uppercase">
                      <option value="new">NEW</option>
                      <option value="reviewed">REVIEWED</option>
                      <option value="admitted">ADMITTED</option>
                      <option value="rejected">REJECTED</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={e => handleDownload(e, item._id)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                      <HiOutlineDownload size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-between px-6 font-black uppercase tracking-[0.2em] text-[10px]">
          <p className="text-slate-400">Page <span className="text-slate-900">{pagination.page}</span> of <span className="text-slate-900">{pagination.totalPages}</span></p>
          <div className="flex gap-3">
            <button disabled={pagination.page === 1} onClick={() => fetchData(pagination.page - 1)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30 shadow-sm"><HiChevronLeft className="inline mb-0.5" /> Previous</button>
            <button disabled={pagination.page === pagination.totalPages} onClick={() => fetchData(pagination.page + 1)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30 shadow-sm">Next <HiChevronRight className="inline mb-0.5" /></button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 md:p-14 text-slate-900">
            <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><HiX size={24} /></button>
            <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Admission Dossier</p>
                <h2 className="text-4xl font-bold tracking-tight">{selectedApp.fullName}</h2>
                <div className="flex gap-6 mt-4 text-slate-500 text-sm font-bold">
                    <span className="flex items-center gap-2"><HiOutlineMail className="text-blue-500" /> {selectedApp.email}</span>
                    <span className="flex items-center gap-2"><HiOutlinePhone className="text-blue-500" /> {selectedApp.contactNo}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-10">
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic History</h4>
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Standard X / Equivalent</p>
                        <p className="font-bold text-slate-800">{selectedApp.instituteName}</p>
                        <p className="text-xs text-slate-500 font-medium">{selectedApp.board} • Passing Year: {selectedApp.yearOfPassing} • {selectedApp.percentageObtained}%</p>
                    </div>
                    {selectedApp.officeName && (
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Other Qualifications</p>
                            <p className="font-bold text-slate-800">{selectedApp.officeName}</p>
                            <p className="text-xs text-slate-500 font-medium">{selectedApp.officeBoard} • Passing Year: {selectedApp.officeYearOfPassing} • {selectedApp.officePercentageObtained}%</p>
                        </div>
                    )}
                </div>
                <div className="space-y-6 text-sm font-medium">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Details</h4>
                    <p><span className="text-slate-400">Father's Name:</span> {selectedApp.fathersName}</p>
                    <p><span className="text-slate-400">Address:</span> {selectedApp.currentAddress}, {selectedApp.city}, {selectedApp.state}</p>
                    <button onClick={e => handleDownload(e, selectedApp._id)} className="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"><HiOutlineDownload /> Download Marksheet</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};