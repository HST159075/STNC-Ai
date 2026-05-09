"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Star, MessageSquare, Briefcase, Zap, ArrowRight, ShieldCheck, Filter, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { messageService } from "@/services/messageService";
import { useRouter } from "next/navigation";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export default function MarketplacePage() {
  const router = useRouter();
  const { 
    search, setSearch, 
    category, setCategory, 
    minPrice, maxPrice, setPriceRange,
    page, setPage, limit 
  } = useMarketplaceStore();

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['freelancers', debouncedSearch, category, minPrice, maxPrice, page],
    queryFn: async () => {
      const { data } = await apiClient.get("/users/freelancers", {
        params: { search: debouncedSearch, category, minPrice, maxPrice, page, limit }
      });
      return data;
    }
  });

  const freelancers = data?.freelancers || [];
  const pagination = data?.pagination;

  const handleContact = async (freelancerId: string) => {
    try {
      const res = await messageService.startConversation(freelancerId);
      router.push(`/messages?conversationId=${res.conversation.id}`);
    } catch (error) {
      console.error("Contact error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Strategic <span className="text-primary italic">Marketplace</span>
            </h1>
            <p className="text-lg text-text-muted font-medium max-w-2xl mx-auto">
              Find elite architects and strategic experts.
            </p>
          </motion.div>

          {/* Search and Filters Bar */}
          <div className="bg-bg-card border border-border p-6 rounded-[2.5rem] mb-12 flex flex-col lg:flex-row gap-6 items-center shadow-xl shadow-primary/5">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, skill, or role..."
                  className="w-full bg-bg-main border border-border px-14 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                />
             </div>
             
             <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-bg-main border border-border px-6 py-5 rounded-2xl focus:outline-none font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                   <option value="">All Categories</option>
                   <option value="Architect">Architect</option>
                   <option value="Developer">Developer</option>
                   <option value="Security">Security</option>
                   <option value="Marketing">Marketing</option>
                </select>

                <div className="flex items-center bg-bg-main border border-border p-2 rounded-2xl gap-2">
                   <div className="px-4 text-[10px] font-black uppercase text-text-muted">Price</div>
                   <input 
                     type="number" 
                     placeholder="Min"
                     value={minPrice}
                     onChange={(e) => setPriceRange(Number(e.target.value), maxPrice)}
                     className="w-20 bg-bg-card border border-border px-3 py-3 rounded-xl text-xs font-bold focus:outline-none"
                   />
                   <span className="text-text-muted">-</span>
                   <input 
                     type="number" 
                     placeholder="Max"
                     value={maxPrice}
                     onChange={(e) => setPriceRange(minPrice, Number(e.target.value))}
                     className="w-20 bg-bg-card border border-border px-3 py-3 rounded-xl text-xs font-bold focus:outline-none"
                   />
                </div>
             </div>
          </div>

          {/* Listing Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] bg-bg-card animate-pulse rounded-[3rem] border border-border"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {freelancers.map((f: any, idx: number) => (
                  <motion.div 
                    key={f.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-bg-card border border-border p-10 rounded-[3.5rem] hover:border-primary/40 transition-all group relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                         <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-primary/20 p-1">
                            <img 
                              src={f.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.name}`} 
                              className="w-full h-full object-cover rounded-[1.7rem]" 
                              alt="" 
                            />
                         </div>
                         <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-500 font-black text-sm mb-1">
                               <Star size={14} fill="currentColor" /> 5.0
                            </div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Architect Level {idx % 3 + 1}</p>
                         </div>
                      </div>

                      <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">{f.name}</h3>
                      <p className="text-xs text-primary font-black uppercase tracking-widest mb-6">{f.serviceType || "Elite Developer"}</p>
                      
                      <p className="text-sm text-text-muted font-medium mb-8 line-clamp-2 leading-relaxed italic">
                         "{f.bio || "Crafting digital legacies with architectural precision."}"
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                         {f.skills?.slice(0, 3).map((s: any) => (
                           <span key={s.skillId} className="px-3 py-1.5 bg-bg-main border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-text-muted">
                              {s.skill.name}
                           </span>
                         ))}
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-border">
                         <div>
                            <p className="text-lg font-black leading-none">${f.hourlyRate || 45}/hr</p>
                         </div>
                         <div className="flex gap-2">
                           <button 
                             onClick={() => handleContact(f.id)}
                             className="w-12 h-12 bg-bg-main border border-border text-text-muted rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                           >
                              <MessageSquare size={18} />
                           </button>
                           <button 
                             onClick={() => router.push(`/marketplace/${f.id}`)}
                             className="px-6 h-12 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
                           >
                              View Details <ArrowRight size={14} />
                           </button>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                   <button 
                     disabled={page === 1}
                     onClick={() => setPage(page - 1)}
                     className="w-12 h-12 bg-bg-card border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-primary disabled:opacity-30"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   <div className="text-sm font-black uppercase tracking-widest text-text-muted">
                      Page {page} <span className="opacity-30">of</span> {pagination.totalPages}
                   </div>
                   <button 
                     disabled={page === pagination.totalPages}
                     onClick={() => setPage(page + 1)}
                     className="w-12 h-12 bg-bg-card border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-primary disabled:opacity-30"
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>
              )}

              {freelancers.length === 0 && (
                <div className="text-center py-32 bg-bg-card border-2 border-dashed border-border rounded-[3rem]">
                   <h3 className="text-2xl font-black mb-2 text-text-muted">No Talent Found</h3>
                   <p className="text-sm text-text-muted font-medium max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
