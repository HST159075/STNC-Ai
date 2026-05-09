"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  History, Search, Filter, 
  ArrowUpRight, ArrowDownLeft, 
  Clock, CheckCircle2, XCircle,
  Download, Zap, ChevronLeft, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "@/hooks/useDebounce";

export default function HistoryPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', debouncedSearch, page],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/api/users/history", {
        params: { search: debouncedSearch, page, limit },
        headers: {
            // Usually handled by cookies/BetterAuth middleware on server
        }
      });
      return data;
    },
    enabled: !!session
  });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination;

  if (sessionPending) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <Zap className="w-12 h-12 text-primary animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <Navbar />

        <header className="mb-12 mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-5xl font-black tracking-tight mb-2">Transaction <span className="text-primary italic">Archive</span></h1>
              <p className="text-text-muted font-medium">Review and audit your strategic financial interactions.</p>
           </div>
           <div className="flex gap-3">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search ID or note..." 
                   className="pl-12 pr-6 py-4 bg-bg-card border border-border rounded-2xl outline-none focus:border-primary text-sm font-medium w-64 shadow-xl shadow-black/5"
                 />
              </div>
              <button className="p-4 bg-bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all">
                 <Filter size={18} />
              </button>
           </div>
        </header>

        <div className="bg-bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/5">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left bg-bg-main/50 border-b border-border">
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Signal Type</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Entity / Project</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Timestamp</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Strategic Value</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                       <th className="p-8 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Protocol</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {isLoading ? (
                       [1, 2, 3, 4, 5].map(i => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan={6} className="p-8"><div className="h-8 bg-bg-main rounded-xl w-full"></div></td>
                          </tr>
                       ))
                    ) : transactions.length > 0 ? (
                       transactions.map((item: any, i: number) => (
                          <motion.tr 
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-bg-main/30 transition-all group"
                          >
                             <td className="p-8">
                                <div className="flex items-center gap-4">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                      item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                   }`}>
                                      {item.clientId === (session?.user as any).id ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                   </div>
                                   <span className="font-black text-sm uppercase tracking-widest">
                                      {item.clientId === (session?.user as any).id ? "Disbursement" : "Incoming"}
                                   </span>
                                </div>
                             </td>
                             <td className="p-8">
                                <p className="font-bold text-text-main group-hover:text-primary transition-colors">{item.note || `Strategic Milestone #${item.id.slice(-4)}`}</p>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">ID: {item.id}</p>
                             </td>
                             <td className="p-8">
                                <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                                   <Clock size={14} /> {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                             </td>
                             <td className="p-8 font-black text-lg">${item.amount}</td>
                             <td className="p-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                   item.status === 'COMPLETED' 
                                   ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                   : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                   {item.status}
                                </span>
                             </td>
                             <td className="p-8 text-right">
                                <button className="p-3 bg-bg-main border border-border rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                   <Download size={18} />
                                </button>
                             </td>
                          </motion.tr>
                       ))
                    ) : (
                       <tr>
                          <td colSpan={6} className="p-20 text-center">
                             <div className="w-20 h-20 bg-bg-main rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-text-muted">
                                <History size={32} />
                             </div>
                             <h3 className="text-2xl font-black mb-2">Archive Empty</h3>
                             <p className="text-text-muted font-medium">No strategic signals recorded in your history yet.</p>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
           
           <div className="p-8 bg-bg-main/30 border-t border-border flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
              <div>Total Records: {pagination?.total || 0}</div>
              <div className="flex items-center gap-6">
                 <div className="flex gap-2">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="w-10 h-10 border border-border rounded-xl flex items-center justify-center hover:text-primary disabled:opacity-30 transition-all"
                    >
                       <ChevronLeft size={16} />
                    </button>
                    <div className="px-4 h-10 flex items-center border border-border rounded-xl bg-bg-card font-black">
                       {page} / {pagination?.totalPages || 1}
                    </div>
                    <button 
                      disabled={page === pagination?.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="w-10 h-10 border border-border rounded-xl flex items-center justify-center hover:text-primary disabled:opacity-30 transition-all"
                    >
                       <ChevronRight size={16} />
                    </button>
                 </div>
                 <button className="text-primary hover:underline">Download CSV Audit</button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
