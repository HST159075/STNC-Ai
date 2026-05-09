"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, Filter, SlidersHorizontal, 
  ChevronDown, Star, Clock, 
  MapPin, ShieldCheck, Zap, 
  ArrowRight, Briefcase, Globe,
  Trophy, Sparkles, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectService } from "@/services/projectService";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const CATEGORIES = ["All", "Web Development", "Mobile Apps", "UI/UX Design", "AI & Data", "Blockchain", "Marketing"];
const BUDGET_RANGES = ["All", "Under $500", "$500 - $2000", "$2000 - $5000", "Above $5000"];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory || "All");
  const [budget, setBudget] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setCategory(catFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProjects();
  }, [category, budget]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects({ category, budget, search });
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      {/* Search & Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-7xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Architect Your <span className="text-primary italic">Legacy</span>
            </h1>
            <p className="text-lg text-text-muted font-medium max-w-2xl mx-auto mb-12">
              Discover high-value strategic projects from the world's most innovative organizations and elite entrepreneurs.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
               <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative bg-bg-card border border-border p-2 rounded-[2.5rem] flex items-center shadow-2xl">
                  <Search className="ml-6 text-text-muted" size={20} />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for strategic initiatives..." 
                    className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold focus:outline-none"
                  />
                  <button type="submit" className="btn-primary px-10 py-4 rounded-[2rem] text-xs uppercase tracking-widest font-black flex items-center gap-2">
                     Analyze <ArrowRight size={14} />
                  </button>
               </div>
            </form>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-10">
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                    <Target size={14} /> Industry Sector
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                          category === cat ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-bg-card text-text-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                    <SlidersHorizontal size={14} /> Compensation
                  </h3>
                  <div className="space-y-2">
                    {BUDGET_RANGES.map(range => (
                      <button 
                        key={range}
                        onClick={() => setBudget(range)}
                        className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                          budget === range ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-bg-card text-text-muted"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="p-8 bg-gradient-to-br from-primary to-accent rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12 group-hover:scale-125 transition-transform duration-500">
                     <Zap size={80} fill="currentColor" />
                  </div>
                  <h4 className="text-xl font-black mb-2">Priority Access</h4>
                  <p className="text-[10px] font-bold opacity-80 mb-6 leading-relaxed">Unlock high-budget enterprise contracts by verifying your architectural status.</p>
                  <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Upgrade Account</button>
               </div>
            </div>

            {/* Project List */}
            <div className="lg:col-span-3">
               <div className="flex items-center justify-between mb-10 px-2">
                  <p className="text-sm font-bold text-text-muted">Showing <span className="text-text-main font-black">{projects.length}</span> Strategic Projects</p>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted cursor-pointer hover:text-primary transition-colors">
                     Sort by: Recent <ChevronDown size={14} />
                  </div>
               </div>

               <div className="grid gap-8">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {[1,2,3].map(i => (
                          <div key={i} className="h-64 bg-bg-card animate-pulse rounded-[3rem] border border-border"></div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="list"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                      >
                        {projects.map((p, idx) => (
                          <Link href={`/projects/${p.id}`} key={p.id}>
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="bg-bg-card border border-border p-10 rounded-[3rem] hover:border-primary/40 hover:shadow-2xl transition-all group relative overflow-hidden"
                            >
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                  <div className="flex-1 space-y-4">
                                     <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/10">
                                           {p.category || "General"}
                                        </span>
                                        <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                           <ShieldCheck size={10} /> Verified
                                        </span>
                                     </div>
                                     <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                                        {p.title}
                                     </h3>
                                     <p className="text-sm text-text-muted font-medium line-clamp-2 max-w-2xl leading-relaxed">
                                        {p.description}
                                     </p>
                                     <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                                           <Clock size={12} className="text-primary" /> 2 Hours Ago
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                                           <MapPin size={12} className="text-primary" /> Remote
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                                           <Globe size={12} className="text-primary" /> Worldwide
                                        </div>
                                     </div>
                                  </div>
                                  <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10">
                                     <p className="text-3xl font-black tracking-tight leading-none">${p.budgetMax}</p>
                                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Maximum Budget</p>
                                     <button className="mt-6 hidden md:flex w-12 h-12 bg-primary/5 text-primary rounded-2xl items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-transparent group-hover:shadow-primary/20">
                                        <ArrowRight size={20} />
                                     </button>
                                  </div>
                               </div>
                               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"></div>
                            </motion.div>
                          </Link>
                        ))}
                        {projects.length === 0 && (
                          <div className="text-center py-32 bg-bg-card border-2 border-dashed border-border rounded-[3rem]">
                             <div className="w-20 h-20 bg-bg-main rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Sparkles size={40} className="text-text-muted" />
                             </div>
                             <h3 className="text-2xl font-black mb-4">No Strategic Projects Found</h3>
                             <p className="text-sm text-text-muted font-medium max-w-sm mx-auto">Try refining your architectural search parameters to discover new initiatives.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
