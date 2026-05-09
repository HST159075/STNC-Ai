"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Globe, MapPin, 
  Briefcase, Calendar, ShieldCheck, 
  Zap, Edit3, Sparkles, ArrowRight,
  Star, Award, CheckCircle2, Layout,
  Settings, LogOut, Trophy, Clock, ArrowRightCircle,
  Upload, Trash2, MoreVertical
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { projectService } from "@/services/projectService";
import AiProfileOptimizer from "@/components/ai/AiProfileOptimizer";
import { formatRelativeTime } from "@/lib/utils";
import apiClient from "@/lib/axios";


export default function ProfilePage() {
  const router = useRouter();
    const { data: session, isPending } = useSession();
    const userData = session?.user as any;

    useEffect(() => {
      if (!isPending && !session) {
        router.push("/");
      }
    }, [session, isPending, router]);
   const [hireHistory, setHireHistory] = useState<any[]>([]);
   const [myProjects, setMyProjects] = useState<any[]>([]);
   const [loadingHistory, setLoadingHistory] = useState(true);
   const [loadingProjects, setLoadingProjects] = useState(true);
   const [profileData, setProfileData] = useState<any>(null);
   const [profileStats, setProfileStats] = useState<any>(null);
   const [loadingProfile, setLoadingProfile] = useState(true);

   useEffect(() => {
     if (userData?.id) {
       fetchProfile();
       fetchMyProjects();
     }
   }, [userData?.id]);

   const fetchMyProjects = async () => {
     try {
       const res = await projectService.getMyProjects();
       if (res.success) setMyProjects(res.projects);
     } catch (error) {
       console.error("Fetch projects error:", error);
     } finally {
       setLoadingProjects(false);
     }
   };

   const fetchProfile = async () => {
     try {
       const data = await userService.getProfile(userData.id);
       if (data.success) {
         setProfileData(data.user);
         setProfileStats(data.stats);
       }
     } catch (error) {
       console.error("Fetch profile error:", error);
     } finally {
       setLoadingProfile(false);
     }
   };

   useEffect(() => {
     if (userData) {
       fetchHistory();
     }
   }, [userData]);

    const [isUpdating, setIsUpdating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
      name: "",
      image: "",
      bio: ""
    });

    useEffect(() => {
      if (userData) {
        setEditForm({
          name: userData.name || "",
          image: userData.image || "",
          bio: userData.bio || ""
        });
      }
    }, [userData]);

    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          const newImageUrl = response.data.imageUrl;

          // Update user profile with the new image URL
          await userService.updateProfile({ 
            image: newImageUrl,
            avatarUrl: newImageUrl 
          });

          // Update local state for the form
          setEditForm(prev => ({ ...prev, image: newImageUrl }));

          // Refresh the session to get updated user data
          await authClient.getSession();

          alert("Profile image updated successfully!");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    const handleDeleteProject = async (projectId: string) => {
      if (!confirm("Are you sure you want to delete this strategic blueprint? This action is irreversible.")) return;
      
      try {
        await projectService.deleteProject(projectId);
        setMyProjects(prev => prev.filter(p => p.id !== projectId));
        alert("Project deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete project");
      }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsUpdating(true);
      try {
        const res = await userService.updateProfile(editForm);
        if (res.success) {
          setShowEditModal(false);
          window.location.reload(); // Refresh to sync session and UI
        }
      } catch (error) {
        console.error("Update profile error:", error);
      } finally {
        setIsUpdating(false);
      }
    };

   const fetchHistory = async () => {
     try {
       const data = await userService.getHireHistory(); // This URL now handles both roles
       if (data.success) {
         setHireHistory(data.history);
       }
     } catch (error) {
       console.error("Fetch history error:", error);
     } finally {
       setLoadingHistory(false);
     }
   };


  if (isPending || !userData) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      <Sidebar />

      <main className="pt-28 pb-20 px-4 sm:px-8 lg:pl-72 lg:pt-32">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-primary/20 p-1.5 bg-bg-card shadow-2xl">
                 <img 
                   src={userData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} 
                   className="w-full h-full object-cover rounded-[2.5rem]" 
                   alt={userData.name} 
                 />
              </div>
               <button 
                 onClick={() => setShowEditModal(true)}
                 className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-4 border-bg-main"
               >
                  <Edit3 size={18} />
               </button>
            </motion.div>

            <div className="text-center md:text-left flex-1">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <h1 className="text-4xl font-black tracking-tight">{userData.name}</h1>
                  <span className="px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={12} /> {userData.role === "CLIENT" ? "Strategic Client" : "Elite Architect"}
                  </span>
               </div>
              <p className="text-text-muted font-medium mb-6 max-w-lg">
                {userData.bio || (userData.role === "FREELANCER" ? "Senior Strategy Consultant specializing in Global Market Architecture and High-Value Asset Management." : "Elite Client focused on high-impact strategic project delivery.") }
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                 <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                    <MapPin size={16} className="text-primary" /> {userData.location || "Silicon Valley, CA"}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                    <Calendar size={16} className="text-primary" /> Joined May 2024
                 </div>
              </div>
            </div>

            <div className="flex gap-3">
               {userData.role === 'FREELANCER' && <AiProfileOptimizer />}
               <button className="w-14 h-14 bg-bg-card border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-primary transition-all shadow-xl shadow-black/5">
                  <Settings size={20} />
               </button>
               <button 
                 onClick={() => signOut()}
                 className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5"
               >
                  <LogOut size={20} />
               </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column: Stats & Role Transition */}
            <div className="lg:col-span-1 space-y-8">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-card border border-border p-6 rounded-[2.5rem] text-center">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{userData.role === "FREELANCER" ? "Trust Score" : "Reliability"}</p>
                     <p className="text-2xl font-black">{profileStats?.trustScore || 98}%</p>
                  </div>
                  <div className="bg-bg-card border border-border p-6 rounded-[2.5rem] text-center">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{userData.role === "FREELANCER" ? "Reviews" : "Feedback"}</p>
                     <p className="text-2xl font-black">{profileStats?.totalHires || 0}</p>
                  </div>
               </div>

               {userData.role === "CLIENT" && (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group cursor-pointer"
                  onClick={() => router.push("/onboarding/freelancer")}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12 group-hover:scale-125 transition-transform duration-500">
                    <Zap size={120} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                    <Sparkles size={24} /> Become an Elite Expert
                  </h3>
                  <p className="text-sm font-medium opacity-80 leading-relaxed mb-8">
                    Unlock premium features, set your own rates, and work on high-value AI projects.
                  </p>
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                    Join Now <ArrowRight size={16} />
                  </div>
                </motion.div>
               )}

               <div className="bg-bg-card border border-border p-8 rounded-[3rem] space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Verified Credentials</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 bg-bg-main rounded-2xl border border-border">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                        <div>
                           <p className="text-xs font-black">Identity Verified</p>
                           <p className="text-[10px] text-text-muted font-bold">Government ID Confirmed</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-bg-main rounded-2xl border border-border opacity-50">
                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><Award size={20} /></div>
                        <div>
                           <p className="text-xs font-black">Skill Certification</p>
                           <p className="text-[10px] text-text-muted font-bold">Pending Assessment</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Experience & Details */}
            <div className="lg:col-span-2 space-y-10">
                 <div className="bg-bg-card border border-border p-12 rounded-[3.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                       <Layout size={200} />
                    </div>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <Trophy size={28} className="text-primary" /> {userData.role === "FREELANCER" ? "Professional Synopsis" : "Strategic Vision"}
                   </h3>
                   <p className="text-lg text-text-muted leading-relaxed font-medium mb-12">
                      {profileData?.bio || (userData.role === "FREELANCER" 
                        ? "Driven by a passion for architectural excellence and digital innovation, I have dedicated over a decade to crafting scalable solutions for Fortune 500 companies." 
                        : "Focused on identifying strategic market gaps and deploying high-impact technical solutions to solve complex business challenges.")}
                   </p>
  
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Core Expertise</h4>
                      <div className="flex flex-wrap gap-3">
                         {(profileData?.skills?.length > 0 ? profileData.skills.map((s: any) => s.skill.name) : ["Market Strategy", "Financial Architecture", "Risk Management", "AI Integration", "Product Vision"]).map((skill: string) => (
                           <span key={skill} className="px-6 py-3 bg-bg-main border border-border rounded-2xl text-xs font-black hover:border-primary/50 transition-all cursor-default flex items-center gap-2">
                              <Sparkles size={12} className="text-primary" /> {skill}
                           </span>
                         ))}
                      </div>
                   </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-bg-card border border-border p-10 rounded-[3rem] group">
                     <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Briefcase size={24} />
                     </div>
                     <h4 className="text-xl font-black mb-2">{userData.role === "FREELANCER" ? "Projects Completed" : "Projects Posted"}</h4>
                     <p className="text-3xl font-black text-primary mb-4">{profileStats?.totalProjects || 0}</p>
                     <p className="text-sm text-text-muted font-medium">
                        {userData.role === "FREELANCER" 
                          ? "Real-world impact across strategic sectors." 
                          : "Consistently delivering high-impact project blueprints."}
                     </p>
                  </div>
                   <div className="bg-bg-card border border-border p-10 rounded-[3rem] group">
                      <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                         <Star size={24} />
                      </div>
                      <h4 className="text-xl font-black mb-2">{userData.role === "FREELANCER" ? "Architect Rating" : "Client Rating"}</h4>
                      <p className="text-3xl font-black text-accent mb-4">{profileStats?.rating?.toFixed(1) || "5.0"}</p>
                      <p className="text-sm text-text-muted font-medium">
                        {userData.role === "FREELANCER" 
                          ? "Recognized as a top-tier strategist." 
                          : "Maintains elite status in the ecosystem."}
                      </p>
                   </div>
                </div>

                {/* Hire History Section */}
                <div className="bg-bg-card border border-border p-12 rounded-[3.5rem]">
                       <div className="flex items-center justify-between mb-10">
                          <h3 className="text-2xl font-black flex items-center gap-4">
                             <Briefcase size={28} className="text-primary" /> {userData.role === "FREELANCER" ? "Work History" : "Hire History"}
                          </h3>
                          <span className="px-4 py-1 bg-bg-main border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted">
                             {hireHistory.length} {userData.role === "FREELANCER" ? "Jobs" : "Hires"}
                          </span>
                       </div>

                      <div className="space-y-6">
                         {loadingHistory ? (
                           [1, 2].map(i => <div key={i} className="h-24 bg-bg-main animate-pulse rounded-3xl" />)
                         ) : hireHistory.length > 0 ? (
                            hireHistory.map((item: any) => {
                              const relatedUser = userData.role === 'CLIENT' ? item.freelancer : item.client;
                              return (
                                <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-bg-main border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                                   <div className="flex items-center gap-6 mb-4 md:mb-0">
                                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/10">
                                         <img src={relatedUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${relatedUser?.name}`} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <div>
                                         <h4 className="font-black text-lg group-hover:text-primary transition-colors">{relatedUser?.name}</h4>
                                         <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{item.project?.title}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-8">
                                      <div className="text-right">
                                         <p className="text-lg font-black leading-none">${item.amount}</p>
                                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{item.status}</p>
                                      </div>
                                      <button 
                                        onClick={() => router.push(`/projects/${item.projectId}`)}
                                        className="w-12 h-12 bg-white border border-border rounded-2xl flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                                      >
                                         <ArrowRight size={18} />
                                      </button>
                                   </div>
                                </div>
                              );
                            })
                         ) : (
                           <div className="py-12 text-center text-text-muted font-medium bg-bg-main rounded-3xl border border-dashed border-border">
                              No strategic hires documented yet.
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Posted Projects Section (For Clients) */}
                   {userData.role === 'CLIENT' && (
                     <div className="bg-bg-card border border-border p-12 rounded-[3.5rem] mt-10">
                        <div className="flex items-center justify-between mb-10">
                           <h3 className="text-2xl font-black flex items-center gap-4">
                              <Layout size={28} className="text-primary" /> Project Blueprint Archive
                           </h3>
                           <span className="px-4 py-1 bg-bg-main border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted">
                              {myProjects.length} Active Posts
                           </span>
                        </div>

                        <div className="space-y-6">
                           {loadingProjects ? (
                             [1, 2].map(i => <div key={i} className="h-24 bg-bg-main animate-pulse rounded-3xl" />)
                           ) : myProjects.length > 0 ? (
                            myProjects.map((project: any) => (
                               <div key={project.id} className="p-8 rounded-[2.5rem] bg-bg-main border border-transparent hover:border-primary/20 hover:bg-white transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="flex-1">
                                     <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase tracking-widest">
                                           {project.category}
                                        </span>
                                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1">
                                           <Clock size={10} /> {formatRelativeTime(project.createdAt)}
                                        </span>
                                     </div>
                                     <h4 className="text-xl font-black group-hover:text-primary transition-colors">{project.title}</h4>
                                     <p className="text-xs text-text-muted font-medium mt-2 line-clamp-1">{project.description}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                                     <div className="text-right">
                                        <p className="text-lg font-black">${project.budgetMax}</p>
                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{project._count?.bids || 0} Proposals</p>
                                     </div>
                                     <div className="flex items-center gap-3">
                                       <button 
                                         onClick={() => router.push(`/projects/${project.id}/edit`)}
                                         className="w-11 h-11 bg-white border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-primary transition-all"
                                         title="Edit Project"
                                       >
                                          <Edit3 size={16} />
                                       </button>
                                       <button 
                                         onClick={() => handleDeleteProject(project.id)}
                                         className="w-11 h-11 bg-white border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-red-500 transition-all"
                                         title="Delete Project"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                       <button 
                                         onClick={() => router.push(`/projects/${project.id}`)}
                                         className="w-14 h-14 bg-white border border-border rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5"
                                       >
                                          <ArrowRightCircle size={20} />
                                       </button>
                                     </div>
                                  </div>
                               </div>
                             ))
                           ) : (
                             <div className="py-20 text-center bg-bg-main rounded-[2.5rem] border border-dashed border-border">
                                <Sparkles size={40} className="text-text-muted mx-auto mb-6 opacity-20" />
                                <h4 className="text-lg font-black text-text-muted">No projects posted yet</h4>
                                <button 
                                  onClick={() => router.push('/projects/create')}
                                  className="mt-6 text-xs font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                   Create your first blueprint
                                </button>
                             </div>
                           )}
                        </div>
                     </div>
                   )}
             </div>
          </div>
        </div>
       </main>

       {/* Edit Profile Modal */}
       <AnimatePresence>
         {showEditModal && (
           <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditModal(false)}
                className="absolute inset-0 bg-bg-main/80 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-bg-card border border-border rounded-[3.5rem] shadow-2xl p-12 overflow-hidden"
              >
                <h2 className="text-3xl font-black mb-8">Edit <span className="text-primary italic">Strategic</span> Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                        required
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Strategic Avatar</label>
                      <div className="flex items-center gap-6 p-4 bg-bg-main border border-border rounded-2xl">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border relative">
                            <img 
                              src={imagePreview || editForm.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editForm.name}`} 
                              className="w-full h-full object-cover" 
                              alt="Preview" 
                            />
                            {uploading && (
                               <div className="absolute inset-0 bg-bg-main/60 flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                               </div>
                            )}
                         </div>
                         <label className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3 px-6 py-3 bg-bg-card border border-border rounded-xl hover:border-primary transition-all">
                               <Upload size={16} className="text-primary" />
                               <span className="text-[10px] font-black uppercase tracking-widest">
                                  {uploading ? "Uploading..." : "Direct Upload"}
                               </span>
                            </div>
                            <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleProfileImageUpload} />
                         </label>
                      </div>
                      <input 
                        type="hidden" 
                        value={editForm.image}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Strategic Bio</label>
                      <textarea 
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        rows={4}
                        className="w-full bg-bg-main border border-border px-6 py-6 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm leading-relaxed"
                      />
                   </div>
                   <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 py-5 bg-bg-main border border-border rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-bg-card transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="flex-2 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                   </div>
                </form>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}
