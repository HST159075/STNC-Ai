"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, ArrowRight, Globe, 
  Cpu, Users, BarChart3, Star, Mail,
  ChevronDown, ChevronUp, Search, Layers,
  Sparkles, CheckCircle2, MessageSquare, ShieldCheck,
  BookOpen, Send
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { projectService } from "@/services/projectService";
import axios from "axios";

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [realStats, setRealStats] = useState<any>(null);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/public-stats`);
      const projectsRes = await projectService.getAllProjects({ limit: 4 });
      
      if (statsRes.data.success) {
        setRealStats(statsRes.data.stats);
        setTestimonials(statsRes.data.testimonials || []);
        setFaqs(statsRes.data.faqs || []);
      }
      if (projectsRes.success) setFeaturedProjects(projectsRes.projects.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch landing page data:", error);
    }
  };

  const stats = [
    { label: "Active Users", value: realStats?.users || "2.5k+", icon: Users },
    { label: "Total Projects", value: realStats?.projects || "1.2k+", icon: Layers },
    { label: "AI Predictions", value: realStats?.predictions || "98%", icon: Cpu },
    { label: "Success Rate", value: realStats?.successRate || "95%", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
              Next-Gen Freelance Marketplace
            </span>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8">
              Hire the Best <span className="text-primary">AI-Powered</span> Talent.
            </h1>
            <p className="text-xl text-text-muted mb-10 max-w-xl">
              The world's first decentralized marketplace that uses artificial intelligence to match projects with elite developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/projects" className="btn-primary flex items-center justify-center gap-2 px-10 py-5 text-lg">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link href="/login" className="px-10 py-5 rounded-2xl bg-bg-card border border-border text-text-main font-bold hover:bg-bg-main transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={18} className="text-primary" /> Try Demo
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative glass-morphism p-4 rounded-[3rem] shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800" alt="Dashboard" className="rounded-[2.5rem] w-full" />
               <div className="absolute -bottom-6 -left-6 glass-morphism p-6 rounded-3xl flex items-center gap-4 animate-bounce">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-500 uppercase">Verification</div>
                    <div className="font-black">Elite Level Verified</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Listing */}
      <section className="section-gap bg-bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Featured Projects</h2>
            <p className="text-text-muted font-medium">Explore the high-budget elite projects currently open for bidding.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProjects.length > 0 ? featuredProjects.map((project, i) => (
              <Link 
                href={`/projects/${project.id}`}
                key={project.id} 
                className="block group"
              >
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-bg-main border border-border p-6 rounded-[2rem] h-full"
                >
                  <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6 overflow-hidden">
                    <img 
                      src={project.imageUrl || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80&i=${i}`} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="text-lg font-black mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-text-muted mb-6 line-clamp-2 h-10">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-primary">${project.budgetMin} - ${project.budgetMax}</span>
                    <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            )) : [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-bg-main border border-border p-6 rounded-[2rem] animate-pulse">
                <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="section-gap">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h2 className="text-4xl font-black mb-4">Browse Categories</h2>
                <p className="text-text-muted font-medium">Find the right talent for your specific industry.</p>
              </div>
              <Link href="/projects" className="btn-primary whitespace-nowrap inline-flex items-center justify-center">
                View All Categories
              </Link>
           </div>
           
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
               {[
                 { label: "Blockchain", icon: Globe, color: "text-blue-500", slug: "Blockchain" },
                 { label: "AI & ML", icon: Cpu, color: "text-purple-500", slug: "AI & Data" },
                 { label: "UI Design", icon: Layers, color: "text-emerald-500", slug: "UI/UX Design" },
                 { label: "App Dev", icon: Zap, color: "text-amber-500", slug: "Mobile Apps" },
                 { label: "Security", icon: ShieldCheck, color: "text-red-500", slug: "Security" },
                 { label: "Marketing", icon: BarChart3, color: "text-cyan-500", slug: "Marketing" },
               ].map((cat, i) => (
                 <Link 
                   href={`/projects?category=${cat.slug}`} 
                   key={i} 
                   className="glass-morphism p-8 rounded-[2rem] text-center hover:shadow-xl transition-all cursor-pointer group block"
                 >
                   <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-bg-card border border-border group-hover:scale-110 transition-transform ${cat.color}`}>
                     <cat.icon size={28} />
                   </div>
                   <div className="font-black text-sm uppercase tracking-widest">{cat.label}</div>
                 </Link>
               ))}
            </div>
        </div>
      </section>

      {/* 4. AI Showcase */}
      <section className="section-gap bg-bg-card relative overflow-hidden">
        <div className="absolute left-[-10%] top-[20%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-primary" size={24} />
              <span className="font-black uppercase tracking-[0.3em] text-primary text-xs">Magic at your fingertips</span>
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-8">Built-in AI Smart Match.</h2>
            <p className="text-text-muted text-lg leading-relaxed mb-10">
              Our proprietary AI Architect analyzes your project scope, budget, and timeline to suggest the top 3% of talent globally. No more endless scrolling.
            </p>
            <ul className="space-y-4 mb-10">
              {['Smart Cost Estimation', 'Skill-to-Project Mapping', 'Real-time Fraud Detection'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-text-main">
                  <CheckCircle2 size={20} className="text-accent" /> {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary">Try AI Architect</button>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <div className="glass-morphism p-8 rounded-[2.5rem] border-primary/20 shadow-2xl shadow-primary/10">
                <div className="text-4xl font-black text-primary mb-2">3s</div>
                <div className="text-xs font-black uppercase text-slate-500">Matching Time</div>
              </div>
              <div className="glass-morphism p-8 rounded-[2.5rem]">
                <div className="text-4xl font-black text-accent mb-2">99%</div>
                <div className="text-xs font-black uppercase text-slate-500">Accuracy Rate</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-morphism p-8 rounded-[2.5rem]">
                <div className="text-4xl font-black text-amber-500 mb-2">15k</div>
                <div className="text-xs font-black uppercase text-slate-500">Elite Talent</div>
              </div>
              <div className="glass-morphism p-8 rounded-[2.5rem]">
                <div className="text-4xl font-black text-blue-500 mb-2">∞</div>
                <div className="text-xs font-black uppercase text-slate-500">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statistics */}
      <section className="section-gap py-24 bg-primary">
         <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-xs font-black uppercase tracking-widest opacity-70">{stat.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* 6. Testimonials */}
      <section className="section-gap">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">User Testimonials</h2>
            <p className="text-text-muted font-medium">Hear from the clients and freelancers who use NexusMarket.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-card p-10 rounded-[3rem] border border-border relative group"
              >
                <div className="flex gap-1 mb-6 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg font-medium mb-10 leading-relaxed italic">"{t.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl overflow-hidden">
                    {t.reviewer?.image ? <img src={t.reviewer.image} alt="" className="w-full h-full object-cover" /> : t.reviewer?.name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{t.reviewer?.name}</h4>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{t.reviewer?.role || "Verified User"}</p>
                  </div>
                </div>
              </motion.div>
            )) : [1, 2, 3].map((i) => (
              <div key={i} className="bg-bg-card p-10 rounded-[3rem] border border-border opacity-50">
                 <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-6 animate-pulse" />
                 <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded mb-10 animate-pulse" />
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                    <div className="space-y-2">
                       <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                       <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Newsletter Section (Upgraded) */}
      <section className="section-gap overflow-hidden">
         <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-primary/10 border border-primary/20 rounded-[4rem] p-16 text-center relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
               <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                     <Mail size={40} />
                  </div>
                  <h2 className="text-4xl font-black mb-6 tracking-tighter">Stay Ahead of the <span className="text-gradient">Market</span></h2>
                  <p className="text-lg text-text-muted font-medium mb-12 italic leading-relaxed">
                     "Get weekly insights on high-paying tech sectors and AI-driven career strategies. No spam, just pure intelligence."
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                     <input 
                       type="email" 
                       placeholder="your@email.com" 
                       className="flex-1 bg-bg-card border border-border px-8 py-5 rounded-2xl outline-none focus:border-primary transition-all font-bold"
                     />
                     <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-primary/20">
                        Subscribe <Send size={16} />
                     </button>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* 7. Latest Blogs Section */}
        <section className="section-gap">
           <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                 <div>
                    <h2 className="text-5xl font-black mb-4 tracking-tighter">Architectural <span className="text-gradient">Insights</span></h2>
                    <p className="text-text-muted font-medium max-w-md italic">Expert strategies from the world's top 3% of tech talent.</p>
                 </div>
                 <Link href="/blogs" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary">
                    Explore all articles <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ArrowRight size={16} /></div>
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { title: "The Rise of AI Agents in 2026", cat: "Trends", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
                   { title: "Escrow Systems: Securing Global Payments", cat: "Safety", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80" },
                   { title: "Remote Infrastructure for Startups", cat: "Strategy", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" }
                 ].map((blog, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-bg-card border border-border rounded-[2.5rem] overflow-hidden group cursor-pointer"
                   >
                      <div className="h-64 overflow-hidden relative">
                         <img src={blog.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white">
                            {blog.cat}
                         </div>
                      </div>
                      <div className="p-8">
                         <h4 className="text-xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">{blog.title}</h4>
                         <div className="flex items-center gap-4 text-text-muted font-bold text-xs">
                            <div className="flex items-center gap-2"><BookOpen size={14} /> 5 min read</div>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

      {/* 8. FAQ */}
      <section className="section-gap bg-bg-card">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-black text-center mb-16">Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {(faqs.length > 0 ? faqs : [
               { question: "How does AI Matching work?", answer: "Our AI analyzes your skills, experience, and past performance to find projects that perfectly match your profile." },
               { question: "What are the platform fees?", answer: "We take a flat 5% commission on successful projects, the lowest in the industry." },
             ]).map((faq, i) => (
               <motion.div 
                 key={i}
                 className="bg-bg-card border border-border rounded-[2.5rem] overflow-hidden"
               >
                 <button 
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                   className="w-full p-8 flex items-center justify-between text-left"
                 >
                   <span className="font-black text-lg">{faq.question}</span>
                   {activeFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                 </button>
                 <AnimatePresence>
                   {activeFaq === i && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="px-8 pb-8"
                     >
                       <p className="text-text-muted font-medium leading-relaxed">
                         {faq.answer}
                       </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer (Section 9 - Implementation of footer structure) */}
      <footer className="pt-20 pb-10 bg-bg-main border-t border-border mt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="text-primary fill-current" size={28} />
              <span className="text-2xl font-black tracking-tighter">NexusMarket</span>
            </Link>
            <p className="text-text-muted font-medium">The future of freelancing. AI-powered matching for elite developers and forward-thinking companies.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold text-text-muted">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Explore</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-text-muted">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8">Contact & Social</h4>
            <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-border gap-8">
            <p className="text-text-muted text-sm font-medium">© 2026 NexusMarket AI. All rights reserved.</p>
            <div className="flex gap-8">
              {[
                { name: "Twitter", href: "https://twitter.com" },
                { name: "LinkedIn", href: "https://linkedin.com" },
                { name: "Github", href: "https://github.com" },
                { name: "Discord", href: "https://discord.com" }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          </div>
        </div>
        <div className="container mx-auto px-6 pt-10 border-t border-border text-center text-xs font-bold text-text-muted uppercase tracking-widest">
          © 2026 NexusMarket AI. All Rights Reserved.
        </div>
      </footer>
      
      {/* 5. AI Chat Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white z-[100]"
      >
        <Sparkles size={28} />
      </motion.button>
    </div>
  );
}
