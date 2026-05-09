"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Table as TableIcon, Search, Filter, 
  Briefcase, MoreVertical, 
  Trash2, Edit, Zap,
  CheckCircle2, XCircle, ArrowUpRight
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { adminService } from "@/services/adminService";

export default function AdminManagementPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });

  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== "SUPER_ADMIN")) {
      router.push("/dashboard");
    } else if (session) {
      fetchData();
    }
  }, [session, isPending, router, pagination.page, status]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProjects({
        page: pagination.page,
        limit: 8,
        search,
        status
      });
      if (data.success) {
        setProjects(data.projects);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalCount: data.pagination.totalCount
        }));
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (isPending) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <Zap className="w-10 h-10 text-primary animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <header className="mb-12 flex items-center justify-between">
           <div>
              <div className="flex items-center gap-3 mb-2 text-primary font-bold uppercase tracking-widest text-xs">
                 <Briefcase size={16} /> Asset Oversight
              </div>
              <h1 className="text-4xl font-black tracking-tight">System <span className="text-text-muted">Management</span></h1>
           </div>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search assets..." 
                   className="pl-12 pr-6 py-4 bg-bg-card border border-border rounded-2xl outline-none focus:border-primary text-sm font-medium w-80 shadow-xl shadow-black/5"
                 />
              </div>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-6 py-4 bg-bg-card border border-border rounded-2xl outline-none focus:border-primary text-xs font-black uppercase tracking-widest"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
           </div>
        </header>

        <div className="bg-bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/5">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left bg-bg-main/50 border-b border-border">
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Strategic Asset</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Visionary (Client)</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Value Bracket</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                       <th className="p-8 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Protocol</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {loading ? (
                       <tr>
                          <td colSpan={5} className="p-20 text-center">
                             <Zap className="w-8 h-8 text-primary animate-pulse mx-auto" />
                          </td>
                       </tr>
                    ) : projects.length > 0 ? (
                       projects.map((p, i) => (
                          <motion.tr 
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-bg-main/30 transition-all group"
                          >
                             <td className="p-8">
                                <div className="font-black text-sm group-hover:text-primary transition-colors">{p.title}</div>
                                <div className="text-[10px] text-text-muted font-bold uppercase mt-1">ID: {p.id.slice(0, 12)}...</div>
                             </td>
                             <td className="p-8">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-bg-main border border-border flex items-center justify-center text-[10px] font-black">
                                      {p.client.name.charAt(0)}
                                   </div>
                                   <span className="font-bold text-sm text-text-muted">{p.client.name}</span>
                                </div>
                             </td>
                             <td className="p-8">
                                <div className="font-black text-sm">${p.budgetMin} - ${p.budgetMax}</div>
                                <p className="text-[10px] text-text-muted font-bold uppercase mt-1">USD ARCHITECTURAL</p>
                             </td>
                             <td className="p-8">
                                <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                                   p.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                   p.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                   'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                   {p.status}
                                </span>
                             </td>
                             <td className="p-8 text-right">
                                <button className="p-3 bg-bg-main border border-border rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                   <ArrowUpRight size={18} />
                                </button>
                             </td>
                          </motion.tr>
                       ))
                    ) : (
                       <tr>
                          <td colSpan={5} className="p-20 text-center text-text-muted font-bold text-sm">
                             No assets found matching your criteria.
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
           
           <div className="p-10 bg-bg-main/30 border-t border-border flex justify-between items-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                 Total Managed Assets: <span className="text-text-main">{pagination.totalCount}</span>
              </div>
              
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => handlePageChange(pagination.page - 1)}
                   disabled={pagination.page === 1}
                   className="p-3 bg-bg-card border border-border rounded-xl hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    <XCircle className="rotate-180" size={18} />
                 </button>
                 <span className="text-[10px] font-black uppercase tracking-widest">
                    Page {pagination.page} <span className="text-text-muted">of</span> {pagination.totalPages}
                 </span>
                 <button 
                   onClick={() => handlePageChange(pagination.page + 1)}
                   disabled={pagination.page === pagination.totalPages}
                   className="p-3 bg-bg-card border border-border rounded-xl hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    <CheckCircle2 size={18} />
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
