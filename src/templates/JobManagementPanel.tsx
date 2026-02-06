"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { HiOutlineBriefcase, HiOutlineLocationMarker, HiX } from "react-icons/hi";

interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  company: string;
  profile: string;
  experienceRequired: string;
  ctc: string;
  vacancies: number;
  qualification: string;
  description: string;
  responsibilities: string[];
}

export const JobManagementPanel = ({ onBack }: { onBack: () => void }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "Full-time",
    company: "OM Logistics Supply Chain Pvt Ltd",
    profile: "Operations",
    experienceRequired: "",
    ctc: "",
    vacancies: 1,
    qualification: "",
    description: "",
    responsibilities: "" // We will split this by newline before sending
  });

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/forms/jobs");
      setJobs(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.split("\n").filter(r => r.trim() !== "")
      };
      await axiosInstance.post("/forms/jobs", payload);
      toast.success("Job Opening Created");
      setShowAddForm(false);
      fetchJobs();
    } catch (error) {
      toast.error("Error creating job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-blue-600 transition-colors">
          ← Back to Applications
        </button>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extralight tracking-tighter text-slate-900">
            Manage <span className="font-medium text-blue-600">Job Postings</span>
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${showAddForm ? 'bg-red-50 text-red-600' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
          >
            {showAddForm ? "Close Form" : "Add New Opening"}
          </button>
        </div>

        {/* --- ADD JOB FORM --- */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-12 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Basic Info</label>
                <input placeholder="Job Title" className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <input placeholder="Location" className="w-full mt-3 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Classification</label>
                <select className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl outline-none" onChange={e => setFormData({ ...formData, jobType: e.target.value })}>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contractual">Contractual</option>
                </select>
                <select className="w-full mt-3 p-3 bg-gray-50 border-none rounded-xl outline-none" onChange={e => setFormData({ ...formData, profile: e.target.value })}>
                  {[
                    'Sales_and_Marketing', 'Human_Resource', 'Corporate_Communications',
                    'Credit_Control', 'Purchase', 'Audit', 'Finance', 'Operations',
                    'Administration', 'Key_Operation_Manager', 'Civil_Procurement'
                  ].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input placeholder="Experience (e.g. 3-5 years)" className="p-3 bg-gray-50 border-none rounded-xl outline-none" required onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })} />
              <input placeholder="CTC (e.g. 5-7 LPA)" className="p-3 bg-gray-50 border-none rounded-xl outline-none" required onChange={e => setFormData({ ...formData, ctc: e.target.value })} />
              <input type="number" placeholder="Vacancies" className="p-3 bg-gray-50 border-none rounded-xl outline-none" required onChange={e => setFormData({ ...formData, vacancies: parseInt(e.target.value) })} />
            </div>

            <input placeholder="Qualification (e.g. B.Tech / Diploma)" className="w-full p-3 bg-gray-50 border-none rounded-xl outline-none" required onChange={e => setFormData({ ...formData, qualification: e.target.value })} />

            <textarea placeholder="Job Description" className="w-full p-3 bg-gray-50 border-none rounded-xl h-32 outline-none" required onChange={e => setFormData({ ...formData, description: e.target.value })} />

            <textarea placeholder="Responsibilities (One per line)" className="w-full p-3 bg-gray-50 border-none rounded-xl h-32 outline-none" required onChange={e => setFormData({ ...formData, responsibilities: e.target.value })} />

            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-colors">
              {isSubmitting ? "Processing..." : "Publish Job Opening"}
            </button>
          </form>
        )}

        {/* --- JOB LIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className="group bg-white p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center cursor-pointer hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">{job.profile}</p>
                <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><HiOutlineLocationMarker /> {job.location}</span>
                  <span className="flex items-center gap-1"><HiOutlineBriefcase /> {job.jobType}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- JOB DETAILS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">

            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <HiX size={20} />
            </button>

            <div className="p-8 md:p-12">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2">{selectedJob.company}</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{selectedJob.title}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 pb-10 border-b border-gray-50">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Experience</p>
                  <p className="text-sm font-bold text-slate-700">{selectedJob.experienceRequired}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">CTC</p>
                  <p className="text-sm font-bold text-slate-700">{selectedJob.ctc}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Vacancies</p>
                  <p className="text-sm font-bold text-slate-700">{selectedJob.vacancies}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Qualification</p>
                  <p className="text-sm font-bold text-slate-700">{selectedJob.qualification}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-black uppercase text-slate-900 mb-3 tracking-widest">Description</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{selectedJob.description}</p>
                </div>

                {/* <div>
                  <h4 className="text-sm font-black uppercase text-slate-900 mb-3 tracking-widest">Key Responsibilities</h4>
                  <ul className="space-y-3">
                    {selectedJob.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div> */}

                {/* Replace the existing Key Responsibilities block with this */}
                <div>
                  <div className="space-y-6">
                    {selectedJob.responsibilities.map((item, idx) => {
                      // Check if item is a heading
                      const isHeading = item.startsWith("<h>") && item.endsWith("</h>");

                      if (isHeading) {
                        const headingText = item.replace(/<\/?h>/g, "");
                        return (
                          <h4 key={idx} className="text-sm font-black uppercase text-slate-900 mt-6 mb-3 tracking-widest">
                            {headingText}
                          </h4>
                        );
                      }

                      return (
                        <li key={idx} className="flex gap-3 text-sm text-slate-500 list-none mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                          {item}
                        </li>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                  ID: {selectedJob._id}
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-8 py-3 bg-gray-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  Close Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};