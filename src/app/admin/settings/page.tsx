"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Settings, Shield, Database, 
  Globe, Bell, Lock, Zap,
  Save, Trash2, ShieldAlert
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminSettingsPage() {
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
           <div className="flex items-center gap-3 mb-2 text-primary font-bold uppercase tracking-widest text-xs">
              <ShieldAlert size={16} /> System Control
           </div>
           <h1 className="text-4xl font-black tracking-tight">Admin <span className="text-text-muted">Settings</span></h1>
        </header>

        <div className="max-w-4xl space-y-12">
           <div className="bg-bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl shadow-black/5">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                 <Database className="text-primary" size={28} /> Infrastructure Management
              </h3>
              <div className="space-y-8">
                 {[
                   { title: "Maintenance Mode", desc: "Temporarily disable access to the platform for all non-admin users.", active: false },
                   { title: "Debug Logs", desc: "Enable verbose server logging for real-time monitoring.", active: true },
                   { title: "Automatic Backups", desc: "Snapshot the database state every 6 hours.", active: true },
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-bg-main/50 border border-border">
                       <div>
                          <h4 className="font-black text-lg mb-1">{item.title}</h4>
                          <p className="text-xs text-text-muted font-medium">{item.desc}</p>
                       </div>
                       <button className={`w-14 h-7 rounded-full relative transition-all ${item.active ? "bg-primary" : "bg-text-muted"}`}>
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${item.active ? "right-1" : "left-1"}`} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl shadow-black/5">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                 <Shield className="text-red-500" size={28} /> Security Core
              </h3>
              <div className="space-y-6">
                 <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                    <h4 className="text-red-500 font-black mb-2 flex items-center gap-2"><Trash2 size={18} /> Purge Inactive Data</h4>
                    <p className="text-sm text-text-muted font-medium mb-6">Permanently delete users and projects that have been inactive for over 180 days.</p>
                    <button className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all">Execute Purge</button>
                 </div>
              </div>
           </div>

           <div className="flex justify-end gap-6 pt-8 pb-20">
              <button className="px-12 py-5 rounded-2xl border border-border font-black text-xs uppercase tracking-widest hover:bg-bg-card transition-all">Restore Defaults</button>
              <button className="btn-primary px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-3">
                 Commit Changes <Save size={18} />
              </button>
           </div>
        </div>
      </main>
    </div>
  );
}
