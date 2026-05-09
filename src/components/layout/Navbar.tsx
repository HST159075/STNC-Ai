"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, MessageSquare, User, 
  Bell, Search, Briefcase, 
  LayoutDashboard, Menu, X 
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Discover", href: "/projects", icon: Search },
    { name: "Marketplace", href: "/marketplace", icon: Briefcase },
    { name: "Strategic Hub", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? "py-4 px-6" : "py-8 px-10"
    }`}>
      <div className={`container mx-auto max-w-7xl bg-bg-card/70 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-2xl shadow-black/20 ${
        scrolled ? "shadow-primary/5" : ""
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter hidden md:block">NexusMarket</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 hover:text-primary ${
                  isActive ? "text-primary" : "text-text-muted"
                }`}
              >
                <link.icon size={14} /> {link.name}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
               <Link href="/messages" className="w-11 h-11 bg-bg-main border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-primary transition-all relative">
                  <MessageSquare size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"></span>
               </Link>
               <NotificationBell />
               <div className="w-[1px] h-8 bg-border mx-2 hidden md:block"></div>
               <Link href="/profile" className="flex items-center gap-3 pl-2 group">
                  <div className="text-right hidden md:block">
                     <p className="text-xs font-black leading-none mb-1">{session.user.name}</p>
                     <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{(session.user as any).role === "CLIENT" ? "Strategic Client" : "Elite Architect"}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-primary/20 p-0.5 group-hover:scale-110 transition-transform shadow-xl">
                     <img 
                       src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`} 
                       className="w-full h-full object-cover rounded-[0.5rem]" 
                       alt="" 
                     />
                  </div>
               </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">Login</Link>
              <Link href="/register" className="btn-primary px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">Start Legacy</Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 bg-bg-main border border-border rounded-xl flex items-center justify-center text-text-muted"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 p-8 bg-bg-card border border-border rounded-[2.5rem] shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-bg-main rounded-xl flex items-center justify-center"><link.icon size={18} /></div>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}