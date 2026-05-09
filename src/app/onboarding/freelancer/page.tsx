"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Calendar, Globe, Phone, 
  Briefcase, Sparkles, CheckCircle2, 
  ArrowRight, Loader2, Zap 
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/layout/Navbar";

export default function FreelancerOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "",
    phoneNumber: "",
    serviceType: "",
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && formData.skills.length < 10) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        role: "FREELANCER"
      };

      // Call the new application endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/apply-freelancer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Your application has been submitted! Our admins will review it shortly.");
        router.push("/dashboard");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Failed to finalize onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-primary/20 mx-auto mb-6"
             >
                <Zap size={40} fill="currentColor" />
             </motion.div>
             <h1 className="text-4xl font-black tracking-tight mb-4">Elite <span className="text-primary">Onboarding</span></h1>
             <p className="text-text-muted font-medium">Complete your professional profile to start earning.</p>
          </div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-bg-card border border-border p-12 rounded-[3rem] shadow-2xl shadow-primary/5 space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">First Name</label>
                  <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} type="text" placeholder="Alex" className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Last Name</label>
                  <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} type="text" placeholder="Rivera" className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Date of Birth</label>
                  <div className="relative">
                     <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                     <input required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} type="date" className="w-full bg-bg-main border border-border pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Nationality</label>
                  <div className="relative">
                     <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                     <input required value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} type="text" placeholder="Global Citizen" className="w-full bg-bg-main border border-border pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Email (Verified)</label>
                  <div className="relative">
                     <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                     <input disabled value={user?.email || ""} type="email" className="w-full bg-bg-main/50 border border-border pl-14 pr-6 py-4 rounded-2xl text-text-muted font-bold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Phone Number</label>
                  <div className="relative">
                     <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                     <input required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} type="tel" placeholder="+1 234 567 890" className="w-full bg-bg-main border border-border pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-text-muted ml-2">Service Category</label>
               <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <select required value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full bg-bg-main border border-border pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none">
                     <option value="">Select your specialty</option>
                     <option>Web Development</option>
                     <option>AI & Machine Learning</option>
                     <option>UI/UX Design</option>
                     <option>Blockchain</option>
                  </select>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase text-text-muted ml-2 flex items-center justify-between">
                  Expertise Skills ({formData.skills.length}/10)
                  <Sparkles size={14} className="text-primary" />
               </label>
               <div className="flex gap-2">
                  <input 
                    value={skillInput} 
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    type="text" 
                    placeholder="React, TypeScript, etc." 
                    className="flex-1 bg-bg-main border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                  />
                  <button type="button" onClick={addSkill} className="px-6 bg-bg-card border border-border rounded-2xl font-black text-xs uppercase hover:bg-bg-main transition-all">Add</button>
               </div>
               <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold flex items-center gap-2">
                       {skill} <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
               </div>
            </div>

            <button 
              disabled={loading}
              className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 mt-8 shadow-xl shadow-primary/20"
            >
               {loading ? <Loader2 className="animate-spin" /> : <>Finalize Onboarding <ArrowRight size={20} /></>}
            </button>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
