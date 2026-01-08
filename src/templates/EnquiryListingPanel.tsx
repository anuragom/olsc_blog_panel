"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/utils/AuthContext";
import { HiXCircle } from "react-icons/hi";

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

  const today = new Date().toISOString().split("T")[0];

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
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
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [serviceName, statusFilter, startDate, endDate, searchTerm]);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    const previousData = [...data];

    setData((prevData) =>
      prevData.map((item) =>
        item._id === enquiryId ? { ...item, status: newStatus } : item
      )
    );

    try {
      await axiosInstance.patch(`/forms/${enquiryId}/status`, { 
        status: newStatus 
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error: Could not update status. Rolling back changes.");
      setData(previousData);
    }
  };

  const canEdit = userRole === "SuperAdmin";

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button onClick={onBack} className="text-sm text-blue-600 font-medium hover:underline flex items-center mb-2">
                ← Back to Forms
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Enquiry Submissions</h2>
            </div>

            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search by Phone or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters:</span>
            
            <select 
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Services</option>
              <option value="air_logistics">Air Logistics</option>
              <option value="rail_logistics">Rail Logistics</option>
              <option value="warehousing">Warehousing</option>
              <option value="3PL">3PL</option>
              <option value="speed_trucking">Speed Trucking</option>
              <option value="FTL">FTL</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <div className="flex items-center gap-2 border-l pl-3 border-gray-300">
              <input 
                type="date" 
                value={startDate}
                max={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400 text-xs font-bold uppercase">to</span>
              <input 
                type="date" 
                value={endDate}
                max={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(startDate || endDate) && (
                <button 
                  onClick={clearDates}
                  className="flex items-center gap-1 text-xs text-red-500 font-bold hover:text-red-700 transition-colors ml-2"
                  title="Clear Dates"
                >
                  <HiXCircle className="text-lg" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-500 font-medium">Loading enquiries...</p>
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 font-medium">No enquiries found.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">{item.email}</span>
                        <span className="text-xs text-gray-400 font-mono tracking-tight">{item.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wide">
                        {item.serviceName.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{item.message}</td>
                    <td className="px-6 py-4">
                      {canEdit ? (
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`text-[11px] font-extrabold rounded-md px-2 py-1 outline-none cursor-pointer border-none shadow-sm ring-1 ring-inset ring-gray-200 ${
                            item.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                            item.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="resolved">RESOLVED</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'resolved' ? 'bg-green-50 text-green-700' : 
                          item.status === 'contacted' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-gray-50 border-t flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            Page <span className="text-gray-900 font-bold">{pagination.page}</span> of <span className="text-gray-900 font-bold">{pagination.totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1 || loading}
              onClick={() => fetchData(pagination.page - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              Previous
            </button>
            <button 
              disabled={pagination.page === pagination.totalPages || loading}
              onClick={() => fetchData(pagination.page + 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};