"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useSession, authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Bell, CreditCard, 
  Settings as SettingsIcon, LogOut, 
  Camera, CheckCircle, Smartphone, 
  Eye, Globe, Mail, Lock, Zap,
  Briefcase, Save, Trash2, ShieldCheck,
  ChevronRight, ArrowLeft, MapPin
} from "lucide-react";
import { userService } from "@/services/userService";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    bio: "",
    location: "",
    serviceType: "",
    hourlyRate: "",
    role: ""
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        bio: (session.user as any).bio || "",
        location: (session.user as any).location || "",
        serviceType: (session.user as any).serviceType || "",
        hourlyRate: (session.user as any).hourlyRate || "",
        role: (session.user as any).role || "FREELANCER"
      });
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userService.updateProfile(formData);
      setIsSaving(false);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (isPending) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <Zap className="w-12 h-12 text-primary animate-pulse" />
    </div>
  );

  const tabs = [
    { id: "profile", label: "Identity", icon: User, desc: "Personal and professional details" },
    { id: "security", label: "Security", icon: Shield, desc: "Access control and protection" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Alerts and communication" },
    { id: "billing", label: "Billing", icon: CreditCard, desc: "Payments and transactions" },
  ];

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <Navbar />

        <header className="mb-12 mt-10">
           <h1 className="text-5xl font-black tracking-tight mb-2">Architectural <span className="text-primary italic">Configurations</span></h1>
           <p className="text-text-muted font-medium">Calibrate your professional identity and security parameters.</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group text-left p-6 rounded-[2rem] transition-all flex items-center gap-4 border ${
                  activeTab === tab.id 
                  ? "bg-bg-card border-primary shadow-2xl shadow-primary/10" 
                  : "bg-bg-card/50 border-border hover:border-primary/40 hover:bg-bg-card"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  activeTab === tab.id ? "bg-primary text-white" : "bg-bg-main text-text-muted group-hover:text-primary"
                }`}>
                  <tab.icon size={20} />
                </div>
                <div>
                   <p className={`font-black text-sm ${activeTab === tab.id ? "text-text-main" : "text-text-muted"}`}>{tab.label}</p>
                   <p className="text-[10px] font-bold text-text-muted opacity-60 uppercase tracking-widest">{tab.id}</p>
                </div>
              </button>
            ))}

            <div className="pt-8 mt-8 border-t border-border">
               <button 
                onClick={handleLogout}
                className="w-full group text-left p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all flex items-center gap-4"
               >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <p className="font-black text-sm uppercase tracking-widest">Logout</p>
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-bg-card border border-border p-12 rounded-[3.5rem] shadow-2xl shadow-black/5"
                >
                  {activeTab === "profile" && (
                    <form onSubmit={handleSave} className="space-y-12">
                       <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-border">
                          <div className="relative group">
                             <div className="w-32 h-32 rounded-[3rem] bg-bg-main border-4 border-white shadow-2xl overflow-hidden">
                                <img src={session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`} className="w-full h-full object-cover" alt="" />
                             </div>
                             <button type="button" className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                                <Camera size={18} />
                             </button>
                          </div>
                          <div className="text-center md:text-left">
                             <h2 className="text-3xl font-black mb-2">Public Profile</h2>
                             <p className="text-text-muted font-medium">This information will be displayed on the Strategic Hub and Marketplace.</p>
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <User size={14} /> Full Name
                             </label>
                             <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-bg-main border border-border p-5 rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <Mail size={14} /> Email Identity
                             </label>
                             <div className="w-full bg-bg-main/50 border border-border p-5 rounded-2xl text-sm font-bold text-text-muted cursor-not-allowed flex items-center justify-between">
                                {session?.user?.email} <Lock size={14} />
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <MapPin size={14} /> Geographical Location
                             </label>
                             <input 
                                type="text"
                                placeholder="e.g. San Francisco, USA"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full bg-bg-main border border-border p-5 rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <Zap size={14} /> Professional Role
                             </label>
                             <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full bg-bg-main border border-border p-5 rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                             >
                                <option value="FREELANCER">STRATEGIC ARCHITECT (FREELANCER)</option>
                                <option value="CLIENT">PROJECT VISIONARY (CLIENT)</option>
                             </select>
                          </div>

                          <div className="md:col-span-2 space-y-3">
                             <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <Briefcase size={14} /> Architectural Bio
                             </label>
                             <textarea 
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                placeholder="Describe your architectural legacy..."
                                className="w-full h-40 bg-bg-main border border-border p-6 rounded-3xl text-sm font-medium focus:border-primary outline-none transition-all resize-none leading-relaxed"
                             />
                          </div>
                       </div>

                       <div className="flex justify-end pt-8">
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/30"
                          >
                             {isSaving ? "Synchronizing..." : "Save Configuration"} <Save size={16} />
                          </button>
                       </div>
                    </form>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-12">
                       <h2 className="text-3xl font-black mb-10">Access Control</h2>
                       <div className="space-y-6">
                          {[
                            { title: "Multifactor Authentication", desc: "Add an extra layer of structural security to your identity.", active: true, icon: Smartphone },
                            { title: "Advanced Encryption", desc: "Encrypt all communications and data at rest.", active: true, icon: Lock },
                            { title: "Public Hub Visibility", desc: "Allow your architectural profile to be discovered on search engines.", active: false, icon: Eye },
                          ].map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-bg-main/50 border border-border flex items-center justify-between group hover:border-primary/30 transition-all">
                               <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 rounded-2xl bg-bg-card flex items-center justify-center text-primary shadow-xl">
                                     <item.icon size={24} />
                                  </div>
                                  <div>
                                     <h4 className="font-black text-lg mb-1">{item.title}</h4>
                                     <p className="text-sm text-text-muted font-medium">{item.desc}</p>
                                  </div>
                               </div>
                               <button className={`w-14 h-7 rounded-full relative transition-all ${item.active ? "bg-primary" : "bg-text-muted"}`}>
                                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${item.active ? "right-1" : "left-1"}`} />
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="py-20 text-center">
                       <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                          <Bell size={44} />
                       </div>
                       <h3 className="text-3xl font-black mb-4">Communication Filters</h3>
                       <p className="text-text-muted font-medium max-w-sm mx-auto mb-10">Define which strategic signals should reach your neural link.</p>
                       <button className="btn-primary px-10 py-4 rounded-2xl">Manage Alerts</button>
                    </div>
                  )}

                  {activeTab === "billing" && (
                    <div className="space-y-10">
                       <h2 className="text-3xl font-black mb-10">Strategic Treasury</h2>
                       <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-primary to-accent text-white shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700">
                             <CreditCard size={120} fill="currentColor" />
                          </div>
                          <h3 className="text-2xl font-black mb-4">Architectural Vault</h3>
                          <p className="text-sm font-medium opacity-80 mb-10 max-w-xs">No active payment channels established. Secure your treasury to begin transactions.</p>
                          <button className="px-10 py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Establish Vault</button>
                       </div>
                    </div>
                  )}
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
