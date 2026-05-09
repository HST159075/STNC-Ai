"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight">Get in <span className="text-primary">Touch</span>.</h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto font-medium">Have questions or need assistance? Our team is here to help you 24/7.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-bg-card p-12 rounded-[3rem] border border-border shadow-xl shadow-primary/5"
            >
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary" size={24} /> Send a Message
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Subject</label>
                  <input type="text" placeholder="Project Inquiry" className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-2">Message</label>
                  <textarea rows={5} placeholder="Tell us more about your project..." className="w-full bg-bg-main border border-border px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"></textarea>
                </div>
                <button className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3">
                  Send Message <Send size={20} />
                </button>
              </form>
            </motion.div>

            {/* Info Cards */}
            <div className="space-y-6">
              {[
                { title: "Email Us", val: "support@nexusmarket.com", icon: Mail, color: "text-blue-500" },
                { title: "Call Us", val: "+1 (555) 123-4567", icon: Phone, color: "text-emerald-500" },
                { title: "Visit Us", val: "123 AI Plaza, Silicon Valley, CA", icon: MapPin, color: "text-amber-500" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-bg-card p-8 rounded-[2.5rem] border border-border flex items-center gap-6 group hover:shadow-lg transition-all"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-bg-main flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-text-muted tracking-widest mb-1">{item.title}</h4>
                    <p className="text-lg font-bold text-text-main">{item.val}</p>
                  </div>
                </motion.div>
              ))}
              
              <div className="p-12 rounded-[3rem] bg-primary/5 border border-primary/10 relative overflow-hidden mt-12">
                 <Zap className="absolute top-[-20%] right-[-10%] text-primary opacity-5" size={200} />
                 <h3 className="text-2xl font-black mb-4">Fast Response AI</h3>
                 <p className="text-sm text-text-muted font-medium mb-6">Our support AI analyzes incoming messages to route them to the perfect expert in under 2 minutes.</p>
                 <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> AI System Online
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
