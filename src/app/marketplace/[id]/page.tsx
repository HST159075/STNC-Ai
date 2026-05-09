"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Globe, Code, 
  Briefcase, CheckCircle2, Zap, 
  MessageSquare, ArrowLeft, Layers,
  ExternalLink, Calendar
} from "lucide-react";
import Link from "next/link";

export default function FreelancerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['freelancer', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`);
      return data.user;
    },
    enabled: !!id
  });

  if (isLoading) return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
       <Zap className="text-primary animate-pulse" size={48} />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-6">
       <h1 className="text-4xl font-black">Architect Not Found</h1>
       <Link href="/marketplace" className="btn-primary">Back to Marketplace</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main pb-20">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-bg-card border-b border-border">
         <div className="container mx-auto max-w-6xl px-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-text-muted font-black uppercase text-[10px] tracking-widest mb-10 hover:text-primary transition-all">
               <ArrowLeft size={16} /> Back to Search
            </button>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-primary/20 p-1.5 shadow-2xl shadow-primary/10"
               >
                  <img 
                    src={data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`} 
                    className="w-full h-full object-cover rounded-[2.5rem]" 
                    alt={data.name} 
                  />
               </motion.div>

               <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                     <div>
                        <h1 className="text-5xl font-black tracking-tight mb-2">{data.name}</h1>
                        <p className="text-xl text-primary font-black uppercase tracking-widest">{data.serviceType || "Strategic Architect"}</p>
                     </div>
                     <div className="flex gap-4">
                        <button className="btn-primary px-10 py-5 text-lg">Hire Architect</button>
                        <button className="p-5 bg-bg-main border border-border rounded-2xl text-text-muted hover:text-primary transition-all">
                           <MessageSquare size={24} />
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {[
                        { label: "Success Rate", value: `${data.successRate || 98}%`, icon: CheckCircle2, color: "text-emerald-500" },
                        { label: "Jobs Done", value: data.completedJobs || 0, icon: Briefcase, color: "text-blue-500" },
                        { label: "Avg Rating", value: data.avgRating || 5.0, icon: Star, color: "text-amber-500" },
                        { label: "Location", value: data.location || "Remote", icon: MapPin, color: "text-purple-500" },
                     ].map((stat, i) => (
                        <div key={i} className="p-4 bg-bg-main border border-border rounded-2xl">
                           <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1 ${stat.color}`}>
                              <stat.icon size={12} /> {stat.label}
                           </div>
                           <div className="text-lg font-black">{stat.value}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      <div className="container mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Overview Section */}
            <section className="bg-bg-card p-10 rounded-[3rem] border border-border">
               <h2 className="text-2xl font-black mb-6">Overview</h2>
               <p className="text-lg text-text-muted leading-relaxed font-medium">
                  {data.bio || "No biography provided. This elite architect focuses on high-impact strategic delivery and technical excellence."}
               </p>
            </section>

            {/* Portfolio Section */}
            <section>
               <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Layers className="text-primary" size={24} /> Portfolio Highlights
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.portfolios && data.portfolios.length > 0 ? (
                    data.portfolios.map((item: any, i: number) => (
                      <div key={i} className="bg-bg-card border border-border rounded-[2.5rem] overflow-hidden group">
                         <div className="h-48 bg-bg-main overflow-hidden">
                            <img 
                              src={item.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt=""
                            />
                         </div>
                         <div className="p-8">
                            <h3 className="text-lg font-black mb-2">{item.title}</h3>
                            <p className="text-sm text-text-muted mb-6 line-clamp-2">{item.description}</p>
                            <div className="flex gap-4">
                               {item.liveUrl && <Link href={item.liveUrl} target="_blank" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2"><ExternalLink size={14}/> View Live</Link>}
                               {item.githubUrl && <Link href={item.githubUrl} target="_blank" className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2"><Code size={14}/> Github</Link>}
                            </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center bg-bg-card border-2 border-dashed border-border rounded-[2.5rem]">
                       <p className="text-text-muted font-black uppercase text-xs tracking-widest">No portfolio items added yet</p>
                    </div>
                  )}
               </div>
            </section>

            {/* Reviews Section */}
            <section>
               <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Star className="text-amber-500" size={24} /> Client Testimonials
               </h2>
               <div className="space-y-6">
                  {data.receivedReviews && data.receivedReviews.length > 0 ? (
                    data.receivedReviews.map((rev: any, i: number) => (
                      <div key={i} className="p-8 bg-bg-card border border-border rounded-[2.5rem]">
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-bg-main overflow-hidden">
                                  <img src={rev.reviewer.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.reviewer.name}`} alt="" />
                               </div>
                               <div>
                                  <div className="font-black text-sm">{rev.reviewer.name}</div>
                                  <div className="text-[10px] font-black uppercase text-text-muted">{new Date(rev.createdAt).toLocaleDateString()}</div>
                               </div>
                            </div>
                            <div className="flex gap-1">
                               {[...Array(5)].map((_, j) => (
                                 <Star key={j} size={14} className={j < rev.rating ? "text-amber-500 fill-current" : "text-border"} />
                               ))}
                            </div>
                         </div>
                         <p className="text-text-main font-medium italic">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-muted font-medium">No reviews received yet.</p>
                  )}
               </div>
            </section>
         </div>

         {/* Sidebar Stats & Info */}
         <div className="space-y-8">
            <div className="bg-bg-card border border-border p-8 rounded-[3rem] sticky top-32">
               <div className="text-center mb-8">
                  <div className="text-4xl font-black text-primary mb-1">${data.hourlyRate || 45}</div>
                  <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Hourly Rate</p>
               </div>

               <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase text-text-muted">Member Since</span>
                     <span className="text-xs font-black">May 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase text-text-muted">Avg Response</span>
                     <span className="text-xs font-black">2 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black uppercase text-text-muted">Languages</span>
                     <span className="text-xs font-black">English, Bengali</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-4">Core Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                     {data.skills?.map((s: any) => (
                        <span key={s.skillId} className="px-4 py-2 bg-bg-main border border-border rounded-xl text-[10px] font-black uppercase tracking-widest">
                           {s.skill.name}
                        </span>
                     ))}
                  </div>
               </div>

               <div className="mt-10 flex gap-4">
                  <Link href={data.githubUrl || "#"} className="flex-1 p-4 bg-bg-main border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-primary transition-all">
                     <Code size={20} />
                  </Link>
                  <Link href={data.portfolioUrl || "#"} className="flex-1 p-4 bg-bg-main border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-primary transition-all">
                     <Globe size={20} />
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
