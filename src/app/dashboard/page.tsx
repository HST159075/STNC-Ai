"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, History, User, 
  ArrowUpRight, Zap, Bell,
  CheckCircle2, Clock, MessageSquare,
  BarChart3, Wallet, Briefcase
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { userService } from "@/services/userService";
import { aiService } from "@/services/aiService";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { 
  Sparkles, ShieldCheck, Trophy, Target, ArrowRightCircle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';


export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
      fetchAIInsights();
    }
  }, [session]);

  const fetchAIInsights = async () => {
    try {
      const data = await aiService.getInsights();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error("AI Insights error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await userService.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    } finally {
      setStatsLoading(false);
    }
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
            <h1 className="text-4xl font-black tracking-tight">Overview</h1>
            <p className="text-text-muted font-medium">Welcome back, {user?.name}! Here's what's happening.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-4 rounded-2xl bg-bg-card border border-border text-text-muted hover:text-primary transition-all relative">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
             </button>
             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black">
                {user?.name?.[0]}
             </div>
          </div>
        </header>

        {/* 1. Overview Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: user?.role === 'CLIENT' ? "Total Spent" : "Total Earnings", value: `$${stats?.totalAmount || 0}`, icon: Wallet, color: "text-blue-500" },
            { label: "Active Jobs", value: stats?.activeJobs || 0, icon: Briefcase, color: "text-emerald-500" },
            { label: "Unread Messages", value: stats?.unreadMessages || 0, icon: MessageSquare, color: "text-purple-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card p-8 rounded-[2.5rem] border border-border shadow-sm group hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl bg-bg-main border border-border ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-text-muted text-xs font-black uppercase tracking-widest">{stat.label}</div>
              </div>
              <h3 className="text-4xl font-black">{statsLoading ? "..." : stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* 1.5 AI Intel Engine Card */}
        {insights && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 animate-pulse blur-3xl opacity-30" />
            <div className="relative bg-bg-card border border-primary/20 p-10 rounded-[3rem] shadow-2xl shadow-primary/10 overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
                  <Sparkles size={160} className="text-primary" />
               </div>
               
               <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                  <div className="lg:w-2/3">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                          <Sparkles size={20} />
                       </div>
                       <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">AI Intel Engine active</span>
                    </div>
                    <h2 className="text-3xl font-black mb-4">{insights.title}</h2>
                    <p className="text-lg text-text-muted font-medium mb-8 leading-relaxed max-w-2xl">
                       {insights.message}
                    </p>
                    
                    {insights.recommendations && insights.recommendations.length > 0 && (
                      <div className="grid md:grid-cols-2 gap-4">
                         {insights.recommendations.map((rec: any) => (
                           <Link href={`/projects/${rec.id}`} key={rec.id} className="p-4 bg-bg-main border border-border rounded-2xl flex items-center justify-between hover:border-primary/40 transition-all group">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Target size={14} />
                                 </div>
                                 <span className="text-xs font-bold truncate max-w-[150px]">{rec.title}</span>
                              </div>
                              <ArrowRightCircle size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                           </Link>
                         ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:w-1/3 w-full">
                     <div className="bg-bg-main/50 border border-border p-6 rounded-[2rem] space-y-6">
                        <div className="flex justify-between items-center">
                           <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Confidence Score</div>
                           <div className="text-xs font-black text-emerald-500">98.2%</div>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[98%]" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest">
                           <ShieldCheck size={14} /> Strategy: Optimized
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* 2. Dynamic Chart Section */}
        <div className="bg-bg-card rounded-[2.5rem] border border-border p-10 mb-12">
           <h3 className="text-2xl font-black mb-8">Performance Analytics</h3>
           <div className="h-[300px] w-full min-h-[300px]">
              {!isMounted || statsLoading ? (
                <div className="w-full h-full bg-bg-main animate-pulse rounded-2xl"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats?.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                      />
                      <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                   </BarChart>
                </ResponsiveContainer>
              )}
           </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3. Activity History Preview */}
          <div className="bg-bg-card rounded-[2.5rem] border border-border p-10">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black">Activity History</h3>
                <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
             </div>
             <div className="space-y-6">
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-bg-main hover:bg-white transition-all group border border-transparent hover:border-border">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-bg-card flex items-center justify-center text-emerald-500`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Payment {item.status}</div>
                          <div className="text-xs text-text-muted">{new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm">${item.amount}</div>
                        <div className={`text-[10px] font-black uppercase text-emerald-500`}>{item.status}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-text-muted font-medium text-sm">
                    No recent activity found.
                  </div>
                )}
             </div>

          </div>

          {/* 3. Profile Snapshot */}
          <div className="bg-bg-card rounded-[2.5rem] border border-border p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
             <h3 className="text-2xl font-black mb-10 relative z-10">Profile Quick View</h3>
             <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
                   {user?.name?.[0]}
                </div>
                <div>
                   <h4 className="text-2xl font-black">{user?.name}</h4>
                   <p className="text-text-muted font-medium mb-2">{user?.email}</p>
                   <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      {user?.role || "USER"} ACCOUNT
                   </span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-6 rounded-2xl bg-bg-main border border-border">
                   <div className="text-[10px] font-black uppercase text-text-muted mb-2">Member Since</div>
                   <div className="font-bold">May 2026</div>
                </div>
                <div className="p-6 rounded-2xl bg-bg-main border border-border">
                   <div className="text-[10px] font-black uppercase text-text-muted mb-2">Completion Rate</div>
                   <div className="font-bold">94%</div>
                </div>
             </div>
             <button 
               onClick={() => router.push("/profile")}
               className="w-full mt-10 btn-primary flex items-center justify-center gap-2"
              >
                Edit Profile <User size={18} />
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
