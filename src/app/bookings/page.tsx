"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, ArrowUpRight, Zap, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function BookingsPage() {
  const bookings = [
    { id: "BK-824", project: "AI Chatbot Integration", client: "Sarah Johnson", date: "May 12, 2026", amount: "$1,200", status: "Active", color: "text-blue-500" },
    { id: "BK-712", project: "UI/UX Redesign", client: "Michael Chen", date: "May 10, 2026", amount: "$3,500", status: "Completed", color: "text-emerald-500" },
    { id: "BK-605", project: "Smart Contract Audit", client: "CryptoSafe LLC", date: "May 08, 2026", amount: "$800", status: "Pending", color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] p-12 overflow-y-auto">
        <Navbar />
        <header className="mb-12 mt-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">My <span className="text-primary">Bookings</span></h1>
            <p className="text-text-muted font-medium mt-1">Manage your active and past project commitments.</p>
          </div>
          <button className="p-4 rounded-2xl bg-bg-card border border-border text-text-muted hover:text-primary transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Filter size={18} /> Filter List
          </button>
        </header>

        <div className="bg-bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-xl shadow-primary/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-black uppercase text-text-muted border-b border-border bg-bg-main/50">
                  <th className="p-8">Project Details</th>
                  <th className="p-8">Client</th>
                  <th className="p-8">Date</th>
                  <th className="p-8">Budget</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {bookings.map((booking, i) => (
                  <motion.tr 
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-bg-main transition-all group"
                  >
                    <td className="p-8">
                      <div className="font-bold text-text-main group-hover:text-primary transition-colors">{booking.project}</div>
                      <div className="text-[10px] text-text-muted font-black uppercase mt-1">ID: {booking.id}</div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg-main border border-border flex items-center justify-center text-[10px] font-black text-text-muted">
                          {booking.client.charAt(0)}
                        </div>
                        <span className="text-text-muted">{booking.client}</span>
                      </div>
                    </td>
                    <td className="p-8 text-text-muted">
                       <div className="flex items-center gap-2"><Calendar size={14} /> {booking.date}</div>
                    </td>
                    <td className="p-8 font-black">{booking.amount}</td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-full bg-opacity-10 ${booking.color} border border-current text-[10px] font-black uppercase`}>
                          {booking.status}
                       </span>
                    </td>
                    <td className="p-8 text-right">
                       <button className="p-3 bg-bg-main border border-border rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all">
                          <ArrowUpRight size={18} />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-bg-main/30 flex justify-between items-center text-xs font-black uppercase text-text-muted tracking-widest">
             <div>Showing {bookings.length} Bookings</div>
             <div className="flex gap-4">
                <button className="opacity-50 hover:opacity-100 transition-all">Previous</button>
                <button className="text-primary">Next Page</button>
             </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                 <CheckCircle2 size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black mb-1">Payments Protected</h4>
                 <p className="text-sm text-text-muted font-medium">All payments for these bookings are held in our secure AI-Escrow system.</p>
              </div>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                 <Clock size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black mb-1">Upcoming Milestones</h4>
                 <p className="text-sm text-text-muted font-medium">You have 2 milestones due in the next 48 hours. Stay ahead!</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
