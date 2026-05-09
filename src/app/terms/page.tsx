"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, Gavel, FileText } from "lucide-react";

export default function TermsPage() {
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
               <Scale size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-10">Terms of <span className="text-primary italic">Service</span></h1>
            
            <div className="space-y-12 text-text-main font-medium leading-relaxed">
               <section>
                  <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                     <ShieldCheck className="text-primary" size={20} /> Marketplace Integrity
                  </h2>
                  <p className="text-text-muted">By accessing the NexusMarket platform, you agree to uphold the highest standards of professional conduct. Any attempts to bypass our secure payment and escrow systems will result in immediate suspension of architectural privileges.</p>
               </section>

               <section>
                  <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                     <Gavel className="text-primary" size={20} /> Legal Jurisdiction
                  </h2>
                  <p className="text-text-muted">All strategic agreements made through NexusMarket are subject to international digital commerce regulations. Users are responsible for complying with local tax laws and professional licensing requirements in their respective jurisdictions.</p>
               </section>

               <section>
                  <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                     <FileText className="text-primary" size={20} /> Service Level Agreements
                  </h2>
                  <p className="text-text-muted">NexusMarket provides the infrastructure for high-tier talent acquisition. While we facilitate the match through AI optimization, the final project outcome is governed by the specific contract agreed upon between the client and the architect.</p>
               </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
