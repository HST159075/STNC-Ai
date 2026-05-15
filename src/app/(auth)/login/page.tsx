"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, Globe, Loader2, ShieldCheck } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      });

      if (res.error) {
        setError(res.error.message || "Invalid credentials");
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

  const handleDemoLogin = async (role: 'client' | 'freelancer') => {
    setLoading(true);
    setError("");
    const email = role === 'client' ? "client@demo.com" : "freelancer@demo.com";
    
    try {
      const res = await signIn.email({
        email,
        password: "password123",
      });

      if (res.error) {
        setError(res.error.message || "Demo login failed");
        setLoading(false);
      } else {
        // Hard redirect to ensure session cookies are perfectly sync'd
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Demo login failed");
      setLoading(false);
    }
  };

   const handleSocialLogin = (provider: 'google' | 'github') => {
    const backendUrl = process.env.NEXT_PUBLIC_AUTH_URL || "https://stns-ai-1eeo.onrender.com";
    const callbackURL = `${window.location.origin}/dashboard`;
    window.location.href = `${backendUrl}/api/auth/sign-in/social?provider=${provider}&callbackURL=${encodeURIComponent(callbackURL)}`;
  };

  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
           <Link href="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                <Zap className="text-white fill-current" size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter">NexusMarket</span>
           </Link>
           <p className="text-text-muted font-medium uppercase tracking-widest text-[10px]">Secure Authentication Portal</p>
        </div>

        <div className="bg-bg-card border border-border p-10 rounded-[3rem] shadow-2xl shadow-primary/5 relative">
           <h1 className="text-4xl font-black mb-8 tracking-tight">Login</h1>
           
           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold mb-8 flex items-center gap-3">
                <ShieldCheck size={18} /> {error}
             </div>
           )}

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-text-muted ml-2 tracking-widest">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      {...register("email")}
                      placeholder="john@example.com"
                      className={`w-full bg-bg-main border ${errors.email ? 'border-red-500' : 'border-border'} px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium`}
                    />
                 </div>
                 {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Password</label>
                    <Link href="#" className="text-[10px] font-black uppercase text-primary hover:underline">Forgot?</Link>
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      {...register("password")}
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full bg-bg-main border ${errors.password ? 'border-red-500' : 'border-border'} px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium`}
                    />
                 </div>
                 {errors.password && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.password.message}</p>}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
              </button>
           </form>

           <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDemoLogin('client')}
                className="py-4 border border-border rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-bg-main transition-all flex items-center justify-center gap-2"
              >
                 <ShieldCheck size={12} className="text-emerald-500" /> Demo Client
              </button>
              <button 
                onClick={() => handleDemoLogin('freelancer')}
                className="py-4 border border-border rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-bg-main transition-all flex items-center justify-center gap-2"
              >
                 <Zap size={12} className="text-primary fill-current" /> Demo Freelancer
              </button>
           </div>

           <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-border" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Social Login</span>
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
                 Don't have an account?{" "}
                 <Link href="/register" className="text-primary hover:underline">Create Account</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </main>
  );
}