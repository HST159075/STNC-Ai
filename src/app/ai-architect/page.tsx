'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, Zap, 
  Terminal, ShieldCheck, Cpu, 
  Layers, Code2, Globe, Database,
  ArrowRight, Download, Share2,
  BrainCircuit, Info, Clock
} from 'lucide-react';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const AIArchitectPage = () => {
  const [prompt, setPrompt] = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const { data } = await axios.post('http://localhost:5000/api/ai/architect', 
        { prompt },
        { withCredentials: true }
      );
      return data.advice;
    }
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    mutation.mutate(prompt);
  };

  const response = mutation.data;
  const loading = mutation.isPending;
  const error = mutation.error;

  useEffect(() => {
    if (response) {
      responseRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <main className="min-h-screen pt-24 bg-slate-950 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Grid & FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <BrainCircuit size={40} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
          >
            Nexus <span className="text-gradient">Architect</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Transform your wild ideas into technical blueprints. Describe your project and let the AI build the architecture.
          </motion.p>
        </div>

        {/* Prompt Input Area */}
        <div className="mb-16">
          <form onSubmit={handleGenerate} className="p-2 rounded-[2.5rem] glass border-white/5 shadow-2xl relative">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 flex items-center bg-slate-950/50 rounded-[2rem] px-8 py-6 gap-6 w-full">
                  <Terminal size={24} className="text-emerald-500" />
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g. I want to build a real-time auction app with AI matching..."
                    className="bg-transparent border-none outline-none text-white w-full text-lg font-medium placeholder:text-slate-700"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-6 rounded-[2rem] bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-emerald-400 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Analyzing..." : "Generate Architecture"} 
                  {!loading && <Zap size={18} className="fill-current" />}
                </button>
             </div>
             
             {/* Suggestions */}
             <div className="mt-4 flex flex-wrap gap-2 px-4 pb-4">
                {["Mobile Fintech App", "B2B SaaS Platform", "Web3 Game Engine"].map(s => (
                  <button 
                    key={s} 
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
             </div>
          </form>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
               <div className="relative inline-block">
                  <div className="w-24 h-24 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-8 mx-auto" />
                  <Bot size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-emerald-500 animate-pulse" />
               </div>
               <h3 className="text-2xl font-black mb-2 animate-pulse">Consulting Knowledge Graph...</h3>
               <p className="text-slate-500 font-medium">Analyzing market trends and technical feasibility.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Response Card */}
        <AnimatePresence>
          {response && (
            <motion.div 
              ref={responseRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               <div className="p-12 rounded-[3.5rem] glass border-white/5 relative overflow-hidden">
                  {/* Glowing background */}
                  <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 blur-[150px] rounded-full" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 text-emerald-500 font-black text-xs uppercase tracking-widest mb-4">
                           <ShieldCheck size={16} /> Technical Blueprint 01-A
                        </div>
                        <h2 className="text-4xl font-black mb-8 leading-tight">{response.title}</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                           {[
                              { label: "Estimated Budget", value: response.estimate.budget, icon: Globe },
                              { label: "Development Time", value: response.estimate.timeline, icon: Clock },
                              { label: "Complexity", value: response.estimate.complexity, icon: Cpu }
                           ].map((item, i) => (
                              <div key={i} className="p-6 rounded-[2rem] bg-slate-900/50 border border-white/5">
                                 <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <item.icon size={12} className="text-emerald-500" /> {item.label}
                                 </div>
                                 <div className="text-lg font-black">{item.value}</div>
                              </div>
                           ))}
                        </div>

                        <div className="space-y-10">
                           <section>
                              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                 <Layers size={14} className="text-emerald-500" /> Core Modules
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {response.modules.map((m: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 font-medium text-slate-300">
                                       <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xs font-black">{i+1}</div>
                                       {m}
                                    </div>
                                 ))}
                              </div>
                           </section>

                           <section>
                              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                 <Code2 size={14} className="text-emerald-500" /> Recommended Stack
                              </h3>
                              <div className="flex flex-wrap gap-3">
                                 {response.techStack.map((tech: string, i: number) => (
                                    <span key={i} className="px-5 py-2.5 rounded-2xl bg-slate-900 text-sm font-bold text-slate-300 border border-white/5">
                                       {tech}
                                    </span>
                                 ))}
                              </div>
                           </section>
                        </div>
                     </div>
                     
                     {/* Action Sidebar */}
                     <div className="w-full md:w-80 space-y-4">
                        <div className="p-8 rounded-[2.5rem] bg-emerald-500 text-slate-950">
                           <h4 className="font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                              <Sparkles size={16} /> AI Advice
                           </h4>
                           <p className="text-sm font-bold leading-relaxed mb-8">
                              "{response.advice}"
                           </p>
                           <button className="w-full py-4 rounded-2xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2">
                              Create Project <ArrowRight size={14} />
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <button className="p-6 rounded-[2rem] glass border-white/5 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white transition-all">
                              <Download size={24} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Save PDF</span>
                           </button>
                           <button className="p-6 rounded-[2rem] glass border-white/5 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white transition-all">
                              <Share2 size={24} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex justify-center items-center gap-4 text-slate-500">
                  <Info size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">AI generation is based on historical marketplace data and technical standards.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default AIArchitectPage;
