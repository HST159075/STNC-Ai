"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, DollarSign, Tag, User, 
  Clock, Briefcase, MapPin, Star, 
  MessageCircle, Send, ShieldCheck, 
  ArrowLeft, Share2, Heart, ExternalLink,
  Zap, Trophy, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectService } from "@/services/projectService";
import { messageService } from "@/services/messageService";
import { userService } from "@/services/userService";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/layout/Navbar";
import AiBidAuditor from "@/components/ai/AiBidAuditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { formatRelativeTime } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  // Proposal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDays, setBidDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);

  // Fetch Project Data with TanStack Query
  const { data: project, isLoading: loading } = useQuery<any>({
    queryKey: ['project', id],
    queryFn: async () => {
      const data = await projectService.getProjectById(id);
      return data.project;
    }
  });

  const bidMutation = useMutation({
    mutationFn: async (newBid: any) => {
      const { data } = await apiClient.post("/bids", newBid);
      return data;
    },
    // Step 1: When mutate is called
    onMutate: async (newBid) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['project', id] });

      // Snapshot the previous value
      const previousProject = queryClient.getQueryData(['project', id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['project', id], (old: any) => ({
        ...old,
        bids: [
          {
            id: 'temp-id-' + Date.now(),
            amount: newBid.amount,
            coverLetter: newBid.coverLetter,
            freelancer: {
              name: session?.user?.name || "You",
              avatarUrl: session?.user?.image
            },
            createdAt: new Date().toISOString()
          },
          ...(old?.bids || [])
        ]
      }));

      return { previousProject };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newBid, context) => {
      queryClient.setQueryData(['project', id], context?.previousProject);
      alert("Failed to submit proposal. Please try again.");
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
    onSuccess: () => {
      setShowSubmitModal(false);
      setBidAmount("");
      setBidDays("");
      setCoverLetter("");
    }
  });

  const handleAiGenerate = async () => {
    if (!session) return;
    setGenerating(true);
    try {
      const profileData = await userService.getProfile(session.user.id);
      const { data: aiRes } = await apiClient.post("/ai/cover-letter", {
        projectTitle: project.title,
        projectDescription: project.description,
        freelancerBio: profileData.user.bio || "",
        skills: profileData.user.skills?.map((s: any) => s.skill.name) || []
      });
      if (aiRes.success) setCoverLetter(aiRes.coverLetter);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const submitProposal = () => {
    bidMutation.mutate({
      projectId: id,
      amount: parseFloat(bidAmount),
      deliveryDays: parseInt(bidDays),
      coverLetter
    });
  };

  const handleContact = async (freelancerId: string) => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    try {
      const res = await messageService.startConversation(freelancerId);
      router.push(`/messages?conversationId=${res.conversation.id}`);
    } catch (error) {
      console.error("Contact error:", error);
      alert("Authentication required. Please log in again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted font-bold text-sm tracking-widest uppercase">Fetching Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl relative">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-center gap-4 mb-6">
                   <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {project?.category || "General"}
                   </span>
                   <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                      <ShieldCheck size={14} /> Verified Client
                   </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-8">
                  {project?.title}
                </h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-bg-card border border-border rounded-[2.5rem] shadow-xl shadow-black/5">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Budget</p>
                      <p className="text-lg font-black">${project?.budgetMin} - ${project?.budgetMax}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Duration</p>
                      <p className="text-lg font-black">Estimated {project?.duration || "2 Weeks"}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Bids</p>
                      <p className="text-lg font-black">{project?.bids?.length || 0} Proposals</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Posted</p>
                      <p className="text-lg font-black">{project?.createdAt ? formatRelativeTime(project.createdAt) : "Just now"}</p>
                   </div>
                </div>
              </motion.div>

              <div className="space-y-8">
                 <h3 className="text-2xl font-black flex items-center gap-3">
                    <Target size={24} className="text-primary" /> Project Blueprint
                 </h3>
                 <p className="text-lg text-text-muted leading-relaxed font-medium">
                    {project?.description}
                 </p>
              </div>

              <div className="space-y-6">
                 <h3 className="text-xl font-black">Technical Requirements</h3>
                 <div className="flex flex-wrap gap-3">
                    {project?.tags?.map((tag: string) => (
                      <span key={tag} className="px-5 py-2.5 bg-bg-card border border-border rounded-2xl text-xs font-bold hover:border-primary/50 transition-all cursor-default">
                         #{tag}
                      </span>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
               {/* Submission Modal Trigger */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-bg-card border border-border p-8 rounded-[3rem] shadow-2xl shadow-primary/5"
               >
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-8">Architectural Client</h3>
                  <div className="flex items-center gap-5 mb-8">
                     <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-primary/20 p-1">
                        <img src={project?.client?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} className="w-full h-full object-cover rounded-[1.2rem]" alt="" />
                     </div>
                     <div>
                        <p className="font-black text-xl mb-1">{project?.client?.name}</p>
                        <p className="text-xs text-text-muted font-bold flex items-center gap-1">
                           <MapPin size={12} /> New York, USA
                        </p>
                     </div>
                  </div>
                  
                  {(session?.user as any)?.role === 'FREELANCER' && (
                    <button 
                      onClick={() => setShowSubmitModal(true)}
                      className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 group mb-6"
                    >
                       Submit Proposal <Zap size={16} className="group-hover:scale-125 transition-transform" />
                    </button>
                  )}

                   {(session?.user?.id === project?.clientId) && ((project?.bids?.length ?? 0) > 0) && (
                     <div className="mb-4">
                       <AiBidAuditor projectId={String(id)} bidCount={project?.bids?.length ?? 0} />
                     </div>
                   )}

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold">Client Rating</span>
                        <span className="flex items-center gap-1 font-black"><Star size={12} fill="currentColor" className="text-yellow-500" /> 4.9</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-bold">Verification</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md font-black">PRO</span>
                     </div>
                  </div>
               </motion.div>

               {/* Stats Card */}
               <div className="bg-bg-card border border-border p-8 rounded-[3rem] space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Trophy size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest leading-none">Security</p>
                        <p className="text-sm font-black">Payment Protected</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Proposals List */}
          <div className="mt-24">
             <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black">Strategic <span className="text-primary">Proposals</span></h2>
                <span className="px-4 py-2 bg-bg-card border border-border rounded-xl text-xs font-bold text-text-muted">
                   {project?.bids?.length || 0} Professional Bids
                </span>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {project?.bids?.map((bid: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={bid.id}
                    className="bg-bg-card border border-border p-10 rounded-[3rem] hover:border-primary/30 transition-all group relative"
                  >
                     <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <img src={bid.freelancer?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`} className="w-14 h-14 rounded-2xl object-cover border border-border" alt="" />
                           <div>
                              <p className="font-black text-lg mb-0.5">{bid.freelancer?.name}</p>
                              <div className="flex items-center gap-3">
                                 <span className="flex items-center gap-1 text-[10px] font-black text-yellow-500 uppercase tracking-widest"><Star size={10} fill="currentColor" /> 5.0</span>
                                 <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Elite Member</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-black leading-none">${bid.amount}</p>
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Proposal</p>
                        </div>
                     </div>
                     <p className="text-sm text-text-muted font-medium leading-relaxed mb-10 line-clamp-3 italic">
                        "{bid.coverLetter}"
                     </p>
                      <div className="flex gap-3">
                        {session?.user?.id === project?.clientId && (
                           <button 
                             onClick={async () => {
                               try {
                                 const res = await apiClient.post("/contracts", {
                                   agreedAmount: bid.amount,
                                   projectId: project.id,
                                   freelancerId: bid.freelancerId,
                                   clientId: session?.user?.id
                                 });
                                 if (res.data.success) {
                                   queryClient.invalidateQueries({ queryKey: ['project', id] });
                                   alert("Strategic partnership established!");
                                 }
                               } catch (error) {
                                 alert("Failed to establish contract.");
                               }
                             }}
                             className="flex-1 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                           >
                              <ShieldCheck size={14} /> Hire Architect
                           </button>
                        )}
                        <button 
                          onClick={() => handleContact(bid.freelancerId)}
                          className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all"
                        >
                           <MessageCircle size={14} /> Send Message
                        </button>
                        <button className="w-14 h-14 bg-bg-main border border-border rounded-2xl flex items-center justify-center hover:bg-bg-card transition-all group">
                           <Heart size={16} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                        </button>
                     </div>
                  </motion.div>
                ))}

                {(!project?.bids || project.bids.length === 0) && (
                   <div className="col-span-full py-20 text-center bg-bg-card border-2 border-dashed border-border rounded-[3rem]">
                      <div className="w-16 h-16 bg-bg-main rounded-2xl flex items-center justify-center mx-auto mb-6">
                         <Briefcase className="text-text-muted" size={32} />
                      </div>
                      <h3 className="text-xl font-black mb-2 text-text-muted">No Proposals Yet</h3>
                      <p className="text-sm font-medium text-text-muted">Be the first strategic expert to apply for this project.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="absolute inset-0 bg-bg-main/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-bg-card border border-border rounded-[3.5rem] shadow-2xl p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <h2 className="text-3xl font-black mb-8">Submit <span className="text-primary italic">Strategic</span> Proposal</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Bid Amount ($)</label>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="500"
                      className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Delivery Time (Days)</label>
                    <input 
                      type="number" 
                      value={bidDays}
                      onChange={(e) => setBidDays(e.target.value)}
                      placeholder="7"
                      className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Proposal Details</label>
                    <button 
                      onClick={handleAiGenerate}
                      disabled={generating}
                      className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1"
                    >
                      {generating ? "Architecting..." : <><Zap size={10} fill="currentColor" /> AI Generate Strategy</>}
                    </button>
                  </div>
                  <textarea 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={6}
                    placeholder="Describe your architectural approach..."
                    className="w-full bg-bg-main border border-border px-6 py-6 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm leading-relaxed"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-5 bg-bg-main border border-border rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-bg-card transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitProposal}
                    className="flex-2 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    Deploy Proposal <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
