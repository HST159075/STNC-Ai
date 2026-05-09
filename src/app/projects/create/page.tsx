'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { projectService } from '@/services/projectService';
import { aiService } from '@/services/aiService';
import apiClient from '@/lib/axios';
import { useSession } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Sparkles, Layout, 
  DollarSign, Tag, CheckCircle2, 
  ArrowLeft, ArrowRight, Zap, Bot,
  Cpu, Target, ShieldCheck, Globe,
  Terminal, Layers, ChevronRight,
  Image as ImageIcon, Upload, X
} from 'lucide-react';

const CreateProjectPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetMin: 500,
    budgetMax: 2000,
    tags: '',
    category: 'Web Development',
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAIGenerate = async () => {
    if (!formData.title) return alert("Please enter a title first!");
    setLoading(true);
    try {
      const res = await aiService.generateBrief(formData.title, formData.category);
      if (res.success) setFormData({ ...formData, description: res.brief });
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestTags = async () => {
    if (!formData.description) return alert("Please enter a description first!");
    setLoading(true);
    try {
      const res = await aiService.suggestTags(formData.description);
      if (res.success) setFormData({ ...formData, tags: res.tags.join(', ') });
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
       const formDataFile = new FormData();
       formDataFile.append('image', file);

       const response = await apiClient.post('/uploads/image', formDataFile, {
          headers: { 'Content-Type': 'multipart/form-data' }
       });

       if (response.data.success) {
          setFormData({ ...formData, imageUrl: response.data.imageUrl });
       }
    } catch (error) {
       console.error("Upload failed:", error);
       alert("Failed to upload image. Please check your connection.");
    } finally {
       setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await projectService.createProject({
        ...formData,
        clientId: (session.user as any).id,
        tags: formData.tags.split(',').map(tag => tag.trim()),
      });

      if (response.success) {
        router.push(`/projects/${response.project.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-bg-main pt-32 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Side: Progress */}
          <div className="lg:w-1/3 space-y-12">
            <div>
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                 <Sparkles size={12} /> Architect Portal
               </div>
               <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
                 Post Your <br />
                 <span className="text-gradient">Masterpiece</span>
               </h1>
            </div>

            <div className="space-y-4">
               {[
                 { s: 1, label: "Core Vision", desc: "Title & Purpose" },
                 { s: 2, label: "Resource Allocation", desc: "Budget & Scope" },
                 { s: 3, label: "Strategy & Deploy", desc: "Skills & Launch" },
               ].map((item) => (
                 <div key={item.s} className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
                       step === item.s ? 'bg-primary text-white' : step > item.s ? 'bg-emerald-500/20 text-emerald-500' : 'bg-bg-card border border-border text-text-muted'
                    }`}>
                       {step > item.s ? <CheckCircle2 size={20} /> : item.s}
                    </div>
                    <div>
                       <div className="text-xs font-black uppercase tracking-widest">{item.label}</div>
                       <div className="text-[10px] font-bold text-text-muted">{item.desc}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                    <div className="bg-bg-card border border-border p-12 rounded-[3rem] shadow-2xl space-y-10">
                       <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Project Title</label>
                             <input 
                               type="text" required value={formData.title}
                               onChange={(e) => setFormData({...formData, title: e.target.value})}
                               placeholder="e.g. AI-Powered CRM Dashboard" 
                               className="w-full bg-bg-main border border-border p-6 rounded-2xl text-xl font-black outline-none focus:border-primary transition-all" 
                             />
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Cover Image</label>
                             <div className="relative group h-[76px]">
                                {imagePreview ? (
                                   <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border">
                                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                      <button 
                                        type="button" onClick={() => {setImagePreview(null); setFormData({...formData, imageUrl: ''})}}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                      >
                                         <X size={14} />
                                      </button>
                                   </div>
                                ) : (
                                   <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-border rounded-2xl hover:border-primary cursor-pointer transition-all bg-bg-main">
                                      <div className="flex items-center gap-3">
                                         <Upload size={18} className="text-text-muted" />
                                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Upload Cover</span>
                                      </div>
                                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                   </label>
                                )}
                                {uploading && (
                                   <div className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-2">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Comprehensive Brief</label>
                             <button 
                               type="button" onClick={handleAIGenerate} disabled={loading}
                               className="text-[10px] font-black text-primary flex items-center gap-2 hover:bg-primary/10 p-2 rounded-lg transition-all disabled:opacity-50"
                             >
                                <Bot size={14} /> {loading ? "Generating..." : "AI Assistant"}
                             </button>
                          </div>
                          <textarea 
                            required value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe your vision..." 
                            className="w-full h-64 bg-bg-main border border-border p-8 rounded-[2.5rem] text-sm font-medium leading-relaxed outline-none focus:border-primary transition-all resize-none" 
                          />
                       </div>
                    </div>
                    <div className="flex justify-end">
                       <button type="button" onClick={() => setStep(2)} className="px-12 py-6 rounded-[2rem] bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
                         Next Step <ChevronRight size={18} />
                       </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="bg-bg-card border border-border p-12 rounded-[3rem] shadow-2xl space-y-12">
                       <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Min Budget ($)</label>
                             <input 
                               type="number" value={formData.budgetMin}
                               onChange={(e) => setFormData({...formData, budgetMin: Number(e.target.value)})}
                               className="w-full bg-bg-main border border-border p-6 rounded-2xl text-xl font-black outline-none focus:border-primary" 
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Max Budget ($)</label>
                             <input 
                               type="number" value={formData.budgetMax}
                               onChange={(e) => setFormData({...formData, budgetMax: Number(e.target.value)})}
                               className="w-full bg-bg-main border border-border p-6 rounded-2xl text-xl font-black outline-none focus:border-primary" 
                             />
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <button onClick={() => setStep(1)} type="button" className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                          <ArrowLeft size={16} /> Back
                       </button>
                       <button type="button" onClick={() => setStep(3)} className="px-12 py-6 rounded-[2rem] bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
                         Final Step <ChevronRight size={18} />
                       </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                    <div className="bg-bg-card border border-border p-12 rounded-[3rem] shadow-2xl space-y-10">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-2">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Required Skills</label>
                             <button 
                               type="button" onClick={handleAISuggestTags} disabled={loading}
                               className="text-[10px] font-black text-primary flex items-center gap-2 hover:bg-primary/10 p-2 rounded-lg transition-all disabled:opacity-50"
                             >
                                <Terminal size={14} /> {loading ? "Analyzing..." : "AI Optimization"}
                             </button>
                          </div>
                          <input 
                            type="text" value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            placeholder="React, AI, Python..." 
                            className="w-full bg-bg-main border border-border p-6 rounded-2xl text-sm font-black outline-none focus:border-primary" 
                          />
                       </div>
                       {error && <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold text-center">{error}</div>}
                    </div>
                    <div className="flex justify-between items-center">
                       <button onClick={() => setStep(2)} type="button" className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                          <ArrowLeft size={16} /> Back
                       </button>
                       <button 
                         type="submit" disabled={loading}
                         className="px-16 py-7 rounded-[2rem] bg-primary text-white font-black text-sm uppercase tracking-widest hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-4 shadow-2xl"
                       >
                         {loading ? "Launching..." : "Launch Project"} <Rocket size={22} />
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateProjectPage;
