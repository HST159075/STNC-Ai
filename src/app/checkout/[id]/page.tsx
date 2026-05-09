'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CreditCard, Lock, 
  ArrowRight, CheckCircle, Info,
  DollarSign, Zap, Rocket
} from 'lucide-react';

const CheckoutPage = ({ params }: { params: { id: string } }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 3000);
  };

  return (
    <main className="min-h-screen pt-24 bg-slate-950 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Section */}
          <div className="flex-1">
             <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                           <CreditCard size={24} />
                        </div>
                        <div>
                           <h1 className="text-3xl font-black tracking-tight">Secure <span className="text-gradient">Checkout</span></h1>
                           <p className="text-slate-500 text-sm font-medium">Safe & encrypted milestone deposit.</p>
                        </div>
                     </div>

                     <div className="p-10 rounded-[3rem] glass border-white/5 space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Cardholder Name</label>
                           <input type="text" placeholder="John Doe" className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500 transition-all font-medium" />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Card Number</label>
                           <div className="relative">
                              <input type="text" placeholder="**** **** **** 4242" className="w-full p-4 pl-12 rounded-2xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500 transition-all font-medium" />
                              <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Expiry Date</label>
                              <input type="text" placeholder="MM / YY" className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500 transition-all font-medium" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">CVC</label>
                              <input type="text" placeholder="123" className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500 transition-all font-medium" />
                           </div>
                        </div>

                        <div className="pt-6">
                           <button 
                             onClick={handlePayment}
                             disabled={isProcessing}
                             className="w-full py-5 rounded-3xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                           >
                             {isProcessing ? "Processing Securely..." : "Confirm & Deposit Funds"} 
                             {!isProcessing && <Lock size={16} />}
                           </button>
                        </div>
                     </div>

                     <div className="flex items-center justify-center gap-8 text-slate-600 grayscale opacity-40">
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"><ShieldCheck size={16} /> SSL Secure</div>
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"><CreditCard size={16} /> PCI Compliant</div>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 px-10 rounded-[4rem] glass border-emerald-500/20 bg-emerald-500/5"
                  >
                     <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-slate-950 mx-auto mb-8 shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                        <CheckCircle size={48} />
                     </div>
                     <h2 className="text-4xl font-black mb-4">Payment Successful!</h2>
                     <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">Funds have been deposited into escrow and the project has been officially started.</p>
                     <div className="flex gap-4 justify-center">
                        <Link href="/dashboard" className="px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Go to Dashboard</Link>
                        <Link href="/messages" className="px-8 py-4 rounded-2xl bg-slate-900 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Open Chat</Link>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96">
             <div className="p-10 rounded-[3rem] glass border-white/5 sticky top-28">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Project Summary</h3>
                
                <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/5">
                   <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-500 border border-white/5">
                      <Rocket size={28} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200">AI Marketplace Dev</h4>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Ref: {params.id.slice(0, 8)}</div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400">Milestone Payment</span>
                      <span className="text-white">$1,200.00</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400 flex items-center gap-1.5">Platform Fee <Info size={14} className="text-slate-600" /></span>
                      <span className="text-white">$60.00</span>
                   </div>
                   <div className="h-px bg-white/5 my-6" />
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest pb-1">Total Amount</span>
                      <span className="text-3xl font-black text-emerald-500">$1,260.00</span>
                   </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-slate-950/50 border border-white/5 flex gap-4">
                   <Zap size={24} className="text-yellow-500 shrink-0" />
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Funds are held securely by Nexus Escrow and only released when you approve the work.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
};

import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default CheckoutPage;
