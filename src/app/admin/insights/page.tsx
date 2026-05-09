"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Sparkles, TrendingUp, PieChart, 
  ShieldCheck, Brain, Zap,
  BarChart3, Target, ArrowUpRight
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminInsightsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== "SUPER_ADMIN")) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <Zap className="w-10 h-10 text-primary animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <header className="mb-12">
           <div className="flex items-center gap-3 mb-2 text-purple-500 font-bold uppercase tracking-widest text-xs">
              <Sparkles size={16} /> Neural Analytics
           </div>
           <h1 className="text-4xl font-black tracking-tight">AI <span className="text-text-muted">Insights</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
           <div className="bg-bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl shadow-black/5">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                 <Brain className="text-purple-500" size={28} /> Revenue Prediction
              </h3>
              <div className="h-64 bg-bg-main rounded-3xl border border-border flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                       <path d="M0,35 Q20,20 40,30 T80,10 T100,5" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                    </svg>
                 </div>
                 <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] relative z-10">Neural Data Visualizer</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                 <div className="p-6 bg-bg-main rounded-[2rem] border border-border">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Growth Forecast</p>
                    <p className="text-2xl font-black text-emerald-500">+24.8%</p>
                 </div>
                 <div className="p-6 bg-bg-main rounded-[2rem] border border-border">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Confidence Score</p>
                    <p className="text-2xl font-black text-primary">92%</p>
                 </div>
              </div>
           </div>

           <div className="bg-bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl shadow-black/5">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                 <Target className="text-primary" size={28} /> Market Equilibrium
              </h3>
              <div className="space-y-6">
                 {[
                   { label: "Web Development", percentage: 45, color: "bg-blue-500" },
                   { label: "Mobile Apps", percentage: 25, color: "bg-emerald-500" },
                   { label: "AI & Data", percentage: 20, color: "bg-purple-500" },
                   { label: "Blockchain", percentage: 10, color: "bg-amber-500" },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                         <span>{item.label}</span>
                         <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full h-3 bg-bg-main rounded-full overflow-hidden border border-border">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.percentage}%` }}
                           className={`h-full ${item.color}`}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl shadow-black/5">
           <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <ShieldCheck className="text-emerald-500" size={28} /> Security Protocols
           </h3>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Bot Mitigation", desc: "AI blocked 2,400 automated access attempts in last 7 days.", icon: Zap },
                { title: "Anomaly Detection", desc: "No abnormal transaction patterns identified in recent cycles.", icon: ShieldCheck },
                { title: "Trust Verification", desc: "98% of active strategic identities have completed verification.", icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-bg-main/50 border border-border">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 shadow-sm">
                      <item.icon size={20} />
                   </div>
                   <h4 className="font-black text-lg mb-2">{item.title}</h4>
                   <p className="text-xs text-text-muted font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}

const CheckCircle2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
