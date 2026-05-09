"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Search, ArrowRight, Zap } from "lucide-react";

export default function BlogPage() {
  const posts = [
    { title: "The Future of AI Architecture", date: "May 12, 2026", category: "Technology", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
    { title: "Strategic Market Analysis 2026", date: "May 10, 2026", category: "Business", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
    { title: "Scaling Your Digital Legacy", date: "May 08, 2026", category: "Strategy", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Strategic <span className="text-primary italic">Insights</span>
            </h1>
            <p className="text-lg text-text-muted font-medium max-w-2xl mx-auto">
              Explore the latest thoughts, strategies, and technological breakthroughs in the architectural marketplace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-6 border border-border shadow-xl">
                   <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                   <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-primary">
                      {post.category}
                   </div>
                </div>
                <div className="px-4">
                   <p className="text-xs font-bold text-text-muted mb-2">{post.date}</p>
                   <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                   <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                      Read Analysis <ArrowRight size={14} />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
