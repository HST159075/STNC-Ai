"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { adminService } from "@/services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, TrendingUp, TrendingDown, 
  ArrowUpRight, ArrowDownLeft, Clock,
  Filter, Search, Download, ShieldCheck,
  Zap, PieChart, Activity, Briefcase
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export default function AdminFinancialsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    try {
      const res = await adminService.getFinancials();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Fetch financials error:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Zap className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 p-6 sm:p-12 lg:ml-[280px] overflow-y-auto pt-28 lg:pt-12">
        <Navbar />

        <header className="mb-12 mt-10">
           <h1 className="text-5xl font-black tracking-tight mb-2">Financial <span className="text-primary italic">Intelligence</span></h1>
           <p className="text-text-muted font-medium italic">Monitoring strategic capital flows across the NexusMarket ecosystem.</p>
        </header>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
           {[
             { label: "Total Volume", value: `$${data?.totalVolume?.toLocaleString()}`, icon: DollarSign, color: "text-blue-500", trend: "+12.5%" },
             { label: "Platform Fees", value: `$${data?.platformFees?.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500", trend: "+8.2%" },
             { label: "Total Payouts", value: `$${data?.payouts?.toLocaleString()}`, icon: ArrowUpRight, color: "text-purple-500", trend: "+15.1%" },
             { label: "Active Escrow", value: "$45,200", icon: ShieldCheck, color: "text-amber-500", trend: "Stable" },
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl transition-all group"
             >
                <div className="flex items-center justify-between mb-6">
                   <div className={`p-4 rounded-2xl bg-bg-main border border-border ${stat.color}`}>
                      <stat.icon size={24} />
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full">{stat.trend}</span>
                </div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black">{stat.value}</h3>
             </motion.div>
           ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
           <div className="lg:col-span-2 bg-bg-card border border-border rounded-[3.5rem] p-10">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black">Volume Analytics</h3>
                 <div className="flex gap-2">
                    {['1W', '1M', '1Y'].map(t => (
                      <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${t === '1W' ? 'bg-primary text-white' : 'bg-bg-main text-text-muted hover:text-primary'}`}>{t}</button>
                    ))}
                 </div>
              </div>
              <div className="h-[400px]">
                 {isMounted && (
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                         <defs>
                           <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                         />
                         <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                 )}
              </div>
           </div>

           <div className="bg-bg-card border border-border rounded-[3.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <PieChart size={160} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-10">Revenue Mix</h3>
              <div className="space-y-8 relative z-10">
                 {[
                   { label: "Project Commissions", value: 65, color: "bg-blue-500" },
                   { label: "Elite Memberships", value: 20, color: "bg-emerald-500" },
                   { label: "AI Audit Fees", value: 10, color: "bg-purple-500" },
                   { label: "Other Services", value: 5, color: "bg-amber-500" },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-text-muted">
                         <span>{item.label}</span>
                         <span>{item.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-bg-main rounded-full overflow-hidden">
                         <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap size={12} fill="currentColor" /> Optimization Tip
                 </p>
                 <p className="text-xs text-text-muted font-medium">Increasing project commissions by 2% could generate an additional $12k/month.</p>
              </div>
           </div>
        </div>

        {/* Transaction History */}
        <div className="bg-bg-card border border-border rounded-[3.5rem] overflow-hidden">
           <div className="p-10 border-b border-border flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black">Transaction Registry</h3>
                 <p className="text-xs text-text-muted font-bold mt-1">Real-time ledger of strategic transfers.</p>
              </div>
              <div className="flex gap-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input type="text" placeholder="Search hash..." className="pl-12 pr-6 py-3 bg-bg-main border border-border rounded-xl text-xs font-bold focus:border-primary outline-none" />
                 </div>
                 <button className="p-3 bg-bg-main border border-border rounded-xl hover:text-primary transition-all"><Filter size={18} /></button>
                 <button className="p-3 bg-bg-main border border-border rounded-xl hover:text-primary transition-all"><Download size={18} /></button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left bg-bg-main/50">
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Type</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Protocol</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Sender (Client)</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Receiver (Freelancer)</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Value</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                    {data?.recentTransactions?.map((tx: any, i: number) => (
                      <tr key={tx.id} className="hover:bg-bg-main/30 transition-all group">
                         <td className="p-8">
                            <div className="w-10 h-10 rounded-xl bg-bg-main flex items-center justify-center text-primary border border-border group-hover:border-primary/50 transition-all">
                               <Activity size={18} />
                            </div>
                         </td>
                         <td className="p-8">
                            <p className="text-xs font-bold text-text-main">P2P Disbursement</p>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Hash: {tx.id.slice(0, 10)}...</p>
                         </td>
                         <td className="p-8">
                            <p className="text-sm font-black">{tx.client?.name}</p>
                            <p className="text-[10px] text-text-muted font-bold">{tx.client?.email}</p>
                         </td>
                         <td className="p-8">
                            <p className="text-sm font-black">{tx.freelancer?.name}</p>
                            <p className="text-[10px] text-text-muted font-bold">{tx.freelancer?.email}</p>
                         </td>
                         <td className="p-8">
                            <p className="text-lg font-black">${tx.amount?.toLocaleString()}</p>
                         </td>
                         <td className="p-8">
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                               {tx.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                    {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                      <tr>
                        <td colSpan={6} className="p-20 text-center text-text-muted font-bold italic">No financial signals detected in current epoch.</td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
