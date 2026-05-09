"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Book, ShieldQuestion } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    { q: "How does the AI Escrow work?", a: "Our AI Escrow system automatically holds payments and releases them upon milestone verification by both parties." },
    { q: "How can I upgrade to Architect Level 2?", a: "Level 2 status is granted after successfully completing 10 high-value projects with a 95%+ satisfaction rate." },
    { q: "What are the platform fees?", a: "NexusMarket charges a flat 5% transaction fee on completed contracts to maintain the infrastructure." },
  ];

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Strategic <span className="text-primary italic">Support</span>
            </h1>
            <p className="text-lg text-text-muted font-medium max-w-2xl mx-auto">
              Everything you need to navigate the NexusMarket ecosystem and maximize your architectural potential.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <h2 className="text-3xl font-black mb-8">Frequently Asked</h2>
               {faqs.map((faq, i) => (
                 <div key={i} className="p-8 rounded-[2.5rem] bg-bg-card border border-border shadow-sm">
                    <h4 className="font-black text-lg mb-3">{faq.q}</h4>
                    <p className="text-sm text-text-muted font-medium leading-relaxed">{faq.a}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-8">
               <h2 className="text-3xl font-black mb-8">Contact Nodes</h2>
               <div className="p-10 rounded-[3rem] bg-primary text-white shadow-2xl relative overflow-hidden group cursor-pointer">
                  <div className="relative z-10">
                     <MessageSquare size={32} className="mb-6" />
                     <h3 className="text-2xl font-black mb-2">Live Strategic Hub</h3>
                     <p className="text-sm font-medium opacity-80">Connect directly with our support architects for real-time assistance.</p>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:rotate-12 transition-transform duration-700">
                     <HelpCircle size={100} fill="currentColor" />
                  </div>
               </div>
               
               <div className="p-10 rounded-[3rem] bg-bg-card border border-border shadow-sm hover:border-primary/40 transition-all cursor-pointer">
                  <Book size={32} className="mb-6 text-primary" />
                  <h3 className="text-2xl font-black mb-2">Documentation Vault</h3>
                  <p className="text-sm text-text-muted font-medium">Read the full technical specification of the NexusMarket platform.</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
