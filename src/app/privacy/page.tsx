"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl bg-bg-card border border-border rounded-[3rem] p-12 md:p-20 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
               <Shield size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-10">Privacy <span className="text-primary italic">Protocol</span></h1>
            
            <div className="space-y-12 text-text-main font-medium leading-relaxed">
               <section>
                  <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                     <Lock className="text-primary" size={20} /> Data Encryption
                  </h2>
                  <p className="text-text-muted">At NexusMarket, we treat your strategic data as a high-security asset. All personal and professional information is encrypted using industry-standard protocols before being stored in our architectural vault.</p>
               </section>

               <section>
                  <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                     <Eye className="text-primary" size={20} /> Visibility Controls
                  </h2>
                  <p className="text-text-muted">You maintain absolute control over who can discover your professional identity. Our marketplace visibility settings allow you to opt-in or out of search engine indexing and public hub discovery.</p>
               </section>

               <section>
                  <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                     <FileText className="text-primary" size={20} /> Usage Transparency
                  </h2>
                  <p className="text-text-muted">We only collect data that is essential for the functionality of the NexusMarket platform. This includes session tokens, profile details, and transaction history required for the escrow system.</p>
               </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
