'use client';

import Link from 'next/link';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, Lock, 
  ArrowRight, CheckCircle2, Zap, 
  ChevronRight, Globe, Info 
} from 'lucide-react';

const CheckoutPage = () => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2500);
  };

  return (
    <main className="min-h-screen pt-24 bg-slate-950 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6">
        {!success ? (
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Summary */}
            <div className="space-y-10">
              <div>
                <h1 className="text-4xl font-black mb-4 tracking-tight">Complete <span className="text-emerald-500">Transaction</span></h1>
                <p className="text-slate-400">Your payment is secured by Nexus Vault and Stripe. Review your order details before proceeding.</p>
              </div>

              <div className="p-10 rounded-[2.5rem] glass border-white/5 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/5">
                    <Zap className="text-emerald-500 fill-current" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">AI Research Tool Development</h3>
                    <div className="text-sm text-slate-500">Milestone 1: Project Setup & UI Prototype</div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between text-slate-400">
                    <span>Milestone Amount</span>
                    <span className="text-white font-bold">$1,200.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Fee (3%)</span>
                    <span className="text-white font-bold">$36.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AI Security Audit</span>
                    <span className="text-emerald-500 font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between pt-8 border-t border-white/5 text-2xl font-black">
                  <span>Total Due</span>
                  <span className="text-emerald-500">$1,236.00</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>Protected by Nexus Smart Contracts. Payment released only on approval.</span>
              </div>
            </div>

            {/* Right: Payment Method */}
            <div className="space-y-8">
              <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <CreditCard className="text-emerald-500" /> Payment Method
                </h2>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center border border-white/10">
                        <span className="text-[10px] font-black italic">VISA</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold">Visa ending in 4242</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Expires 12/26</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-950 rounded-full" />
                    </div>
                  </div>

                  <button className="w-full p-4 rounded-2xl border border-dashed border-white/10 text-slate-500 text-sm hover:border-emerald-500/50 transition-colors flex items-center justify-center gap-2">
                    Add New Payment Method
                  </button>

                  <div className="pt-6 space-y-4">
                    <button 
                      onClick={handlePayment}
                      disabled={processing}
                      className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3"
                    >
                      {processing ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock size={20} />
                          Pay $1,236.00
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-500 uppercase font-black tracking-widest">
                      Encryption Active • Secure Payment Gateway
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] glass border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-slate-500" />
                  <span className="text-sm text-slate-400">Payment Region: Europe (EUR)</span>
                </div>
                <button className="text-emerald-500 text-xs font-bold hover:underline">Change</button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto py-20 text-center space-y-8"
          >
            <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 size={64} />
            </div>
            <h1 className="text-5xl font-black tracking-tight">Payment <span className="text-emerald-500">Successful!</span></h1>
            <p className="text-slate-400 text-lg">Your funds have been securely placed in escrow. You can now start collaborating with Alex Rivera.</p>
            
            <div className="pt-10 flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/messages" className="px-10 py-5 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform">
                Start Chatting
              </Link>
              <Link href="/dashboard" className="px-10 py-5 rounded-2xl bg-slate-900 border border-white/5 text-white font-black text-lg hover:bg-slate-800 transition-all">
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;
