"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { 
  HiOutlineChevronDown, HiOutlineChevronRight, HiCheckCircle,
  HiOutlineShare, HiOutlineDatabase,
  HiOutlineEye, HiOutlinePencilAlt, HiOutlineSave
} from "react-icons/hi";
import { toast } from "react-hot-toast";

const PERMISSION_TREE = [
  {
    id: "system",
    label: "Core System Access",
    children: [
      { id: "*:*", label: "Superuser (Full Access)" },
      { id: "roles:manage", label: "Manage Roles & Permissions" },
    ]
  },
  {
    id: "blogs",
    label: "Blog Management",
    children: [
      { id: "sanjvik:view", label: "Sanjvik Website Access" },
      { id: "omlogistics:view", label: "OM Logistics Website Access" },
      { id: "blog:create", label: "Create Blogs", dependsOn_OR: ["sanjvik:view", "omlogistics:view"] },
      { id: "blog:publish", label: "Publish Blogs", dependsOn_OR: ["sanjvik:view", "omlogistics:view"] },
      { id: "blog:delete", label: "Delete Blogs", dependsOn_OR: ["sanjvik:view", "omlogistics:view"] },
    ]
  },
  {
    id: "forms_root",
    label: "Forms & Logistics Operations",
    children: [
      { id: "forms:read", label: "Base: Access Forms Panel" },
      { 
        id: "logistics", 
        label: "Enquiry Management", 
        dependsOn: ["forms:read"],
        children: [
          { id: "enquiry:read", label: "View Enquiries", dependsOn: ["forms:read"] },
          { id: "enquiry:edit", label: "Update Status", dependsOn: ["enquiry:read"] },
          { id: "enquiry:export", label: "Export CSV", dependsOn: ["enquiry:read"] },
          {
            id: "services",
            label: "Specific Service Access",
            dependsOn: ["enquiry:read"],
            children: [
              { id: "service:air_logistics:read", label: "Air: View" },
              { id: "service:air_logistics:write", label: "Air: Edit", dependsOn: ["service:air_logistics:read", "enquiry:edit"] },
              { id: "service:rail_logistics:read", label: "Rail: View" },
              { id: "service:rail_logistics:write", label: "Rail: Edit", dependsOn: ["service:rail_logistics:read", "enquiry:edit"] },
              { id: "service:warehousing:read", label: "Warehousing: View" },
              { id: "service:warehousing:write", label: "Warehousing: Edit", dependsOn: ["service:warehousing:read", "enquiry:edit"] },
              { id: "service:speed_trucking:read", label: "Speed Trucking: View" },
              { id: "service:speed_trucking:write", label: "Speed Trucking: Edit", dependsOn: ["service:speed_trucking:read", "enquiry:edit"] },
              { id: "service:FTL:read", label: "FTL: View" },
              { id: "service:FTL:write", label: "FTL: Edit", dependsOn: ["service:FTL:read", "enquiry:edit"] },
              { id: "service:PTL:read", label: "PTL: View" },
              { id: "service:PTL:write", label: "PTL: Edit", dependsOn: ["service:PTL:read", "enquiry:edit"] },
              { id: "service:contact_us:read", label: "Contact us: View" },
              { id: "service:contact_us:write", label: "Contact us: Edit", dependsOn: ["service:contact_us:read", "enquiry:edit"] },
              { id: "service:automotive-engineering:read", label: "Automotive: View" },
              { id: "service:automotive-engineering:write", label: "Automotive: Edit", dependsOn: ["service:automotive-engineering:read", "enquiry:edit"] },
              { id: "service:retail-fashion:read", label: "Retail: View" },
              { id: "service:retail-fashion:write", label: "Retail: Edit", dependsOn: ["service:retail-fashion:read", "enquiry:edit"] },
              { id: "service:it-consumer-electronics:read", label: "IT consumer-electronics: View" },
              { id: "service:it-consumer-electronics:write", label: "IT consumer-electronics: Edit", dependsOn: ["service:it-consumer-electronics:read", "enquiry:edit"] },
              { id: "service:healthcare-pharmaceuticals:read", label: "Healthcare: View" },
              { id: "service:healthcare-pharmaceuticals:write", label: "Healthcare: Edit", dependsOn: ["service:healthcare-pharmaceuticals:read", "enquiry:edit"] },
              { id: "service:books-publishing:read", label: "Books Publishing: View" },
              { id: "service:books-publishing:write", label: "Books Publishing: Edit", dependsOn: ["service:books-publishing:read", "enquiry:edit"] },
              { id: "service:fmcg:read", label: "FMCG: View" },
              { id: "service:fmcg:write", label: "FMCG: Edit", dependsOn: ["service:fmcg:read", "enquiry:edit"] },
              { id: "service:projects:read", label: "Projects: View" },
              { id: "service:projects:write", label: "Projects: Edit", dependsOn: ["service:projects:read", "enquiry:edit"] },
              { id: "service:bike-logistics:read", label: "Bike Logistics: View" },
              { id: "service:bike-logistics:write", label: "Bike Logistics: Edit", dependsOn: ["service:bike-logistics:read", "enquiry:edit"] },
              { id: "service:campus-logistics:read", label: "Campus Logistics: View" },
              { id: "service:campus-logistics:write", label: "Campus Logistics: Edit", dependsOn: ["service:campus-logistics:read", "enquiry:edit"] },
              { id: "service:*:read", label: "All Services: View" },
              { id: "service:*:write", label: "All Services: Edit", dependsOn: ["service:*:read", "enquiry:edit"] },
            ]
          }
        ]
      },
      {
        id: "hr_forms",
        label: "Career & HR Portals",
        dependsOn: ["forms:read"],
        children: [
          { id: "career:read", label: "Careers: View", dependsOn: ["forms:read"] },
          { id: "career:edit", label: "Careers: Edit", dependsOn: ["career:read"] },
          { id: "career:export", label: "Careers: Export", dependsOn: ["career:read"] },
          { id: "career:jobs_manage", label: "Careers: Manage Jobs", dependsOn: ["career:read"] },
          { id: "retails:read", label: "Retails: View", dependsOn: ["forms:read"] },
          { id: "retails:edit", label: "Retails: Edit", dependsOn: ["retails:read"] },
          { id: "franchise:read", label: "Franchise: View", dependsOn: ["forms:read"] },
          { id: "franchise:edit", label: "Franchise: Edit", dependsOn: ["franchise:read"] },
          { id: "institute:read", label: "Institute: View", dependsOn: ["forms:read"] },
          { id: "institute:edit", label: "Institute: Edit", dependsOn: ["institute:read"] },
          { id: "pickup:read", label: "Pickup: View", dependsOn: ["forms:read"] },
          { id: "pickup:edit", label: "Pickup: Edit", dependsOn: ["pickup:read"] },
        ]
      }
    ]
  }
];

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [roles, setRoles] = useState<any[]>([]);
  const [roleName, setRoleName] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["forms_root", "blogs"]);
  const [empSearch, setEmpSearch] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [targetRoleId, setTargetRoleId] = useState("");
  
  // Modal state for editing
  const [viewingRole, setViewingRole] = useState<any>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/auth/roles");
      setRoles(res.data);
    } catch (e) { toast.error("Role registry offline"); }
  };

  const findLabel = (id: string, nodes: any[] = PERMISSION_TREE): string => {
    for (const node of nodes) {
      if (node.id === id) return node.label;
      if (node.children) {
        const found = findLabel(id, node.children);
        if (found !== id) return found;
      }
    }
    return id;
  };

  // Helper to handle dependency logic for both Create and Edit
  const computeNewPerms = (prev: string[], id: string, dependsOn?: string[], dependsOn_OR?: string[]) => {
    if (prev.includes(id)) {
        return prev.filter(p => p !== id);
    } else {
        const mandatoryDeps = dependsOn || [];
        let orDeps: string[] = [];
        if (dependsOn_OR && dependsOn_OR.length > 0) {
            const hasAtLeastOne = dependsOn_OR.some(d => prev.includes(d));
            if (!hasAtLeastOne) {
                const firstOrDep = dependsOn_OR[0];
                if (firstOrDep) orDeps = [firstOrDep];
            }
        }
        return Array.from(new Set([...prev, id, ...mandatoryDeps, ...orDeps]));
    }
  };

  const handleUpdateRole = async () => {
    if (!viewingRole?._id) return;
    setIsUpdating(true);
    try {
        await axiosInstance.put("/auth/roles", {
            id: viewingRole._id,
            name: editRoleName,
            permissions: editPerms
        });
        toast.success("Protocol Updated Successfully");
        setViewingRole(null);
        fetchRoles();
    } catch (err) {
        toast.error("Failed to update protocol");
    } finally {
        setIsUpdating(false);
    }
  };

  const renderTree = (nodes: any[], isEditMode = false, level = 0) => {
    const currentList = isEditMode ? editPerms : selectedPerms;
    const setList = isEditMode ? setEditPerms : setSelectedPerms;

    return nodes.map(node => {
      const isExpanded = expandedGroups.includes(node.id);
      const isSelected = currentList.includes(node.id);
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} className="select-none">
          <div 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer mb-1
              ${level === 0 ? 'bg-slate-50 font-black text-slate-900 mt-4 border border-slate-100' : 'hover:bg-blue-50/50'}
              ${isSelected ? 'bg-blue-100/30 border-blue-100' : ''}
            `}
            style={{ marginLeft: `${level * 24}px` }}
            onClick={() => {
                if (hasChildren) {
                    setExpandedGroups(prev => prev.includes(node.id) ? prev.filter(g => g !== node.id) : [...prev, node.id]);
                } else {
                    setList(prev => computeNewPerms(prev, node.id, node.dependsOn, node.dependsOn_OR));
                }
            }}
          >
            {hasChildren ? (
              <div className="flex items-center justify-center w-5 h-5">
                {isExpanded ? <HiOutlineChevronDown className="text-[#0D5BAA]" /> : <HiOutlineChevronRight className="text-slate-400" />}
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#0D5BAA] border-[#0D5BAA]' : 'border-slate-300 bg-white'}`}>
                {isSelected && <HiCheckCircle className="text-white w-4 h-4" />}
              </div>
            )}
            <span className={`text-[11px] font-bold uppercase ${level === 0 ? 'text-[#0D5BAA]' : isSelected ? 'text-blue-800' : 'text-slate-600'}`}>{node.label}</span>
          </div>
          {hasChildren && isExpanded && renderTree(node.children, isEditMode, level + 1)}
        </div>
      );
    });
  };

  const renderCanvasTree = (nodes: any[], targetPerms: string[], level = 0) => {
    return nodes.map(node => {
      const isSelected = targetPerms.includes(node.id);
      const hasSelectedChild = node.children?.some((child: any) => 
        targetPerms.includes(child.id) || child.children?.some((gc: any) => targetPerms.includes(gc.id))
      );

      if (!isSelected && !hasSelectedChild) return null;

      return (
        <div key={`canvas-${node.id}`} className="relative">
          <div className="flex items-center gap-4 mb-4" style={{ marginLeft: `${level * 32}px` }}>
            <div className="flex flex-col items-center relative">
               <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'bg-white/20'}`}></div>
               { (isSelected || hasSelectedChild) && <div className="w-px h-12 bg-gradient-to-b from-white/10 to-transparent"></div> }
            </div>
            <div className={`p-4 rounded-2xl flex-1 border backdrop-blur-md transition-all ${isSelected ? 'bg-white/10 border-white/20 shadow-lg shadow-blue-900/20' : 'bg-white/5 border-white/5 opacity-40'}`}>
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] mb-1">{node.children ? 'Branch' : 'Auth Node'}</p>
                <p className="text-sm font-bold text-white leading-tight">{node.label}</p>
            </div>
          </div>
          {node.children && renderCanvasTree(node.children, targetPerms, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="p-8 max-w-full mx-auto font-sans bg-gray-50/30 min-h-screen">
      <div className="flex gap-4 mb-10">
        <button onClick={() => setActiveTab("roles")} className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'roles' ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Role Architect</button>
        <button onClick={() => setActiveTab("users")} className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 border border-slate-100'}`}>User Access</button>
      </div>

      {activeTab === "roles" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[82vh]">
          {/* Column 1: Designer */}
          <div className="xl:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Designer</h3>
            <input value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="DESIGNATION NAME..." className="w-full p-5 bg-slate-50 rounded-2xl mb-6 font-black text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-[#0D5BAA]" />
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t border-slate-50 pt-4">{renderTree(PERMISSION_TREE, false)}</div>
            <button 
                onClick={async () => {
                    if(!roleName) { toast.error("Enter Role Name"); return; }
                    try {
                        await axiosInstance.post("/auth/roles", { name: roleName, permissions: selectedPerms });
                        toast.success("Role Committed"); setRoleName(""); setSelectedPerms([]); fetchRoles();
                    } catch(e) { toast.error("Sync Error"); }
                }} 
                className="mt-6 w-full py-5 bg-[#0D5BAA] text-white rounded-[2rem] font-black uppercase text-xs"
            >Save Architecture</button>
          </div>

          {/* Column 2: Visual Canvas */}
          <div className="xl:col-span-5 bg-[#001F39] rounded-[3.5rem] p-10 flex flex-col relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10 flex flex-col h-full text-white">
                <div className="flex items-center justify-between mb-10 text-left">
                    <div className="flex flex-col"><h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">Live Access Canvas</h3><p className="text-[10px] text-white/30 font-medium mt-1">Visualization of active gates</p></div>
                    <HiOutlineShare className="text-white/20" />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar-white pr-4">{selectedPerms.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-[3rem]"><HiOutlineDatabase size={60} className="mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">Awaiting selection...</p></div> : <div className="space-y-2">{renderCanvasTree(PERMISSION_TREE, selectedPerms)}</div>}</div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between">
                    <div><p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Matrix Nodes</p><p className="text-2xl font-black text-white">{selectedPerms.length}</p></div>
                    <div className="w-12 h-12 rounded-full bg-[#EE222F] flex items-center justify-center shadow-2xl shadow-red-500/50"><HiCheckCircle size={24} className="text-white" /></div>
                </div>
            </div>
          </div>

          {/* Column 3: Existing Registry */}
          <div className="xl:col-span-3 flex flex-col h-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6 mb-6">Existing Registry</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {roles.map((r: any) => (
                <div key={r._id} onClick={() => { setViewingRole(r); setEditRoleName(r.name); setEditPerms(r.permissions); }} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-[#0D5BAA] transition-all group cursor-pointer active:scale-95">
                   <div className="flex items-center justify-between mb-2"><p className="font-black text-slate-900 text-xs uppercase group-hover:text-[#0D5BAA] transition-colors">{r.name}</p><HiOutlineEye className="text-slate-300" size={16} /></div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{r.permissions.length} Logic Gates</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-12">Protocol Assignment</h2>
            <div className="relative mb-12">
                <input value={empSearch} onChange={e => setEmpSearch(e.target.value)} placeholder="EMPLOYEE ID..." className="w-full p-6 bg-slate-50 rounded-[2rem] font-black outline-none border border-slate-100" />
                <button onClick={async () => {
                  try { const res = await axiosInstance.get(`/auth/users/${empSearch}`); setFoundUser(res.data.user); } catch (e) { toast.error("Operator not found"); }
                }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase">Search</button>
            </div>
            {foundUser && (
               <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-8 bg-blue-50 rounded-[3rem] mb-10 flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#0D5BAA] font-black text-3xl shadow-lg">{foundUser.fullName.charAt(0)}</div>
                    <div className="text-left"><p className="text-2xl font-black text-slate-900">{foundUser.fullName}</p><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{foundUser.role?.name || 'Standard Access'}</p></div>
                  </div>
                  <select value={targetRoleId} onChange={e => setTargetRoleId(e.target.value)} className="w-full p-6 bg-slate-50 rounded-2xl mb-10 font-black text-slate-700 outline-none ring-1 ring-slate-100"><option value="">-- SELECT NEW PROTOCOL --</option>{roles.map((r: any) => <option key={r._id} value={r._id}>{r.name.toUpperCase()}</option>)}</select>
                  <button onClick={async () => {
                    try { await axiosInstance.patch(`/auth/users/${foundUser._id}/role`, { roleId: targetRoleId }); toast.success("Protocol Updated"); setFoundUser(null); } catch (e) { toast.error("Failure"); }
                  }} className="w-full py-7 bg-[#0D5BAA] text-white rounded-[2.5rem] font-black uppercase text-xs">Commit Changes</button>
               </div>
            )}
        </div>
      )}

      {/* --- EDIT MODAL (DUAL PANEL: TREE + CANVAS) --- */}
      {viewingRole && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setViewingRole(null)}></div>
          <div className="relative w-full max-w-[85vw] bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            
            {/* Header */}
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0D5BAA]"><HiOutlinePencilAlt size={24} /></div>
                    <div><h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Protocol Editor</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editing ID: {viewingRole._id}</p></div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setViewingRole(null)} className="px-6 py-3 rounded-2xl font-black text-[10px] uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancel Changes</button>
                    <button onClick={handleUpdateRole} disabled={isUpdating} className="px-8 py-3 bg-[#0D5BAA] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-200">
                        {isUpdating ? "Syncing..." : <><HiOutlineSave size={16}/> Update Protocol</>}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Interactive Tree */}
                <div className="w-1/3 border-r border-slate-100 p-10 overflow-y-auto custom-scrollbar">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Protocol Label</label>
                    <input value={editRoleName} onChange={e => setEditRoleName(e.target.value)} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 mb-10 uppercase" />
                    
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4 border-t border-slate-50 pt-8">Permissions Logic</label>
                    {renderTree(PERMISSION_TREE, true)}
                </div>

                {/* Right: Hierarchical Canvas */}
                <div className="flex-1 bg-[#001F39] p-16 overflow-y-auto custom-scrollbar-white relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                            <div><h3 className="text-xl font-black text-white tracking-tighter">LIVE AUTHORIZATION MAP</h3><p className="text-xs text-blue-300 font-bold uppercase tracking-widest mt-1">Hierarchical Resultant</p></div>
                            <div className="bg-white/10 px-5 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest border border-white/10">{editPerms.length} Gates</div>
                        </div>
                        <div className="space-y-2">{renderCanvasTree(PERMISSION_TREE, editPerms)}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}