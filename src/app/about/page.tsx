"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Globe, Target, Users, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <div className="container mx-auto max-w-6xl text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Our Mission
            </span>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              Revolutionizing the <span className="text-primary">Gig Economy</span> with AI.
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto font-medium">
              NexusMarket is more than just a platform; it's an ecosystem built on trust, intelligence, and elite performance.
            </p>
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 mb-32">
          <div className="glass-morphism p-12 rounded-[3rem] border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
              <Globe size={32} />
            </div>
            <h3 className="text-3xl font-black mb-6">Our Vision</h3>
            <p className="text-text-muted leading-relaxed font-medium">
              To create a world where geographical boundaries don't limit talent. We believe the best minds should work on the best projects, regardless of where they are.
            </p>
          </div>
          <div className="glass-morphism p-12 rounded-[3rem] border border-border">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-8">
              <Target size={32} />
            </div>
            <h3 className="text-3xl font-black mb-6">Our Mission</h3>
            <p className="text-text-muted leading-relaxed font-medium">
              Leveraging Artificial Intelligence to remove the friction from hiring. Our AI Architect ensures that every match is precise, fast, and high-quality.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-black text-center mb-16">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Transparency", icon: ShieldCheck, desc: "Every transaction and communication is open and secure." },
              { title: "Innovation", icon: Sparkles, desc: "Constant evolution of our AI models to serve you better." },
              { title: "Community", icon: Users, desc: "Building a global network of elite talent and visionary clients." }
            ].map((v, i) => (
              <div key={i} className="text-center p-8">
                <div className="w-14 h-14 mx-auto bg-bg-card border border-border rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <v.icon size={24} />
                </div>
                <h4 className="text-xl font-black mb-4">{v.title}</h4>
                <p className="text-sm text-text-muted font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
