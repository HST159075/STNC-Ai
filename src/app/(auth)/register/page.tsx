"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Globe } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (res.error) {
        setError(res.error.message || "Registration failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError("");
    try {
      await signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (err: any) {
      setError(`${provider} signup failed`);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12">
           <Link href="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                <Zap className="text-white fill-current" size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter">NexusMarket</span>
           </Link>
           <p className="text-text-muted font-medium uppercase tracking-widest text-[10px]">Join the Future of Work</p>
        </div>

        <div className="bg-bg-card border border-border p-10 rounded-[3rem] shadow-2xl shadow-primary/5 relative">
           <h1 className="text-4xl font-black mb-8 tracking-tight">Create Account</h1>
           
           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold mb-8 flex items-center gap-3">
                <ShieldCheck size={18} /> {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Full Name</label>
                 <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-bg-main border border-border px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-bg-main border border-border px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-main border border-border px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      required
                    />
                 </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
              </button>
           </form>

           <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-border" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Quick Signup</span>
              <div className="flex-1 h-[1px] bg-border" />
           </div>

           <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="py-4 border border-border rounded-2xl flex items-center justify-center gap-2 hover:bg-bg-main transition-all font-bold text-xs"
              >
                 <Globe size={18} /> Google
              </button>
              <button 
                onClick={() => handleSocialLogin('github')}
                className="py-4 border border-border rounded-2xl flex items-center justify-center gap-2 hover:bg-bg-main transition-all font-bold text-xs"
              >
                 <Zap size={18} /> GitHub
              </button>
           </div>

           <div className="mt-10 pt-10 border-t border-border">
              <p className="text-center text-text-muted text-sm font-bold">
                 Already have an account?{" "}
                 <Link href="/login" className="text-primary hover:underline">Login Now</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </main>
  );
}