"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, BarChart3, 
  Activity, ArrowUpRight, Zap,
  ShieldAlert, TrendingUp, PieChart,
  Table as TableIcon, Sparkles, ShieldCheck
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { adminService } from "@/services/adminService";
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

    useEffect(() => {
      if (!isPending && (!session || (session.user as any).role !== "SUPER_ADMIN")) {
        router.push("/dashboard");
      } else if (session) {
        fetchStats();
        fetchApplications();
      }
    }, [session, isPending, router]);

    const fetchApplications = async () => {
      try {
        const data = await adminService.getPendingApplications();
        if (data.success) setApplications(data.applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    const handleApprove = async (id: string) => {
      setIsActionLoading(id);
      try {
        const res = await adminService.approveApplication(id);
        if (res.success) {
          setApplications(applications.filter(app => app.id !== id));
          fetchStats(); // Update user counts
        }
      } catch (error) {
        console.error("Approve error:", error);
      } finally {
        setIsActionLoading(null);
      }
    };

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      if (data.success) setStats(data);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <Zap className="w-10 h-10 text-primary animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2 text-primary font-bold uppercase tracking-widest text-xs">
            <ShieldAlert size={16} /> Admin Authority
          </div>
          <h1 className="text-4xl font-black tracking-tight">Main <span className="text-text-muted">Analytics</span></h1>
        </header>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Revenue", value: "$124,500", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Platform Users", value: stats?.stats.userCount || 0, icon: Users, color: "text-blue-500" },
            { label: "Active Bids", value: stats?.stats.bidCount || 0, icon: Sparkles, color: "text-purple-500" },
            { label: "Success Rate", value: "98.2%", icon: Activity, color: "text-amber-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card p-6 rounded-[2.5rem] border border-border shadow-sm group hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-bg-main border border-border ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-emerald-500 text-xs font-bold">+12.5%</div>
              </div>
              <p className="text-text-muted text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* 1.2 Platform Growth Chart */}
        <div className="bg-bg-card border border-border p-10 rounded-[3rem] mb-12 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-2xl font-black mb-1">Platform <span className="text-primary italic">Growth</span></h3>
                 <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Performance analytics for the last 30 days</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Users</span>
                 </div>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { name: 'Week 1', revenue: 4000, users: 2400 },
                   { name: 'Week 2', revenue: 3000, users: 1398 },
                   { name: 'Week 3', revenue: 2000, users: 9800 },
                   { name: 'Week 4', revenue: 2780, users: 3908 },
                 ]}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1.5rem' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorUser)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 1.5 Pending Freelancer Applications */}
        {applications.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
               <h3 className="text-2xl font-black">Freelancer <span className="text-primary italic">Requests</span></h3>
               <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">{applications.length} Pending</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {applications.map((app) => (
                 <motion.div 
                   key={app.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-bg-card border border-border p-8 rounded-[2.5rem] relative group"
                 >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                       <ShieldCheck size={60} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">
                          {app.name?.[0]}
                       </div>
                       <div>
                          <h4 className="font-bold">{app.name}</h4>
                          <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">{app.email}</p>
                       </div>
                    </div>
                    <div className="space-y-4 mb-8">
                       <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Target Specialty</div>
                       <div className="px-4 py-2 bg-bg-main border border-border rounded-xl text-xs font-bold inline-block">
                          {app.freelancerApplicationData?.serviceType || "Expert"}
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => handleApprove(app.id)}
                         disabled={isActionLoading === app.id}
                         className="flex-1 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                       >
                         {isActionLoading === app.id ? "Approving..." : "Approve"}
                       </button>
                       <button className="flex-1 py-4 bg-bg-main border border-border rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                         Reject
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Management Table Preview */}
          <div className="lg:col-span-2 bg-bg-card rounded-[2.5rem] border border-border p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3"><TableIcon size={20} className="text-primary" /> Management Table</h3>
                <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Full View</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="text-left text-xs font-black uppercase text-text-muted border-b border-border pb-4">
                         <th className="pb-4">Entity</th>
                         <th className="pb-4">Status</th>
                         <th className="pb-4">Last Modified</th>
                         <th className="pb-4">Action</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm font-medium">
                      {stats?.recentProjects.map((p: any) => (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-bg-main transition-all group">
                           <td className="py-4">
                              <div className="font-bold">{p.title}</div>
                              <div className="text-[10px] text-text-muted">ID: {p.id.slice(0, 8)}...</div>
                           </td>
                           <td className="py-4">
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">Active</span>
                           </td>
                           <td className="py-4 text-text-muted">Today</td>
                           <td className="py-4">
                              <button className="p-2 hover:bg-white rounded-lg transition-all"><ArrowUpRight size={16} /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* 3. AI Insights */}
          <div className="bg-bg-card rounded-[2.5rem] border border-border p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                <Sparkles size={120} className="text-primary" />
             </div>
             <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><Sparkles size={20} className="text-purple-500" /> AI Insights</h3>
             <div className="space-y-6">
                {[
                  { title: "Revenue Forecast", desc: "Predicted 15% growth next month based on current bid trends.", icon: TrendingUp },
                  { title: "User Behavior", desc: "92% of new users visit AI Architect first.", icon: PieChart },
                  { title: "Security Alert", desc: "No abnormal patterns detected in last 24h.", icon: ShieldCheck }
                ].map((insight, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-main flex items-center justify-center shrink-0">
                      <insight.icon size={18} className="text-text-muted" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed">{insight.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 btn-primary text-xs uppercase">Generate Report</button>
          </div>
        </div>
      </main>
    </div>
  );
}
