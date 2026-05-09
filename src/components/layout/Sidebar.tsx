"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, History, User, 
  BarChart3, Table, Users, 
  Sparkles, Settings, LogOut,
  ChevronLeft, ChevronRight, Zap,
  PlusCircle, Search, DollarSign
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminLinks = [
    { name: "Analytics", href: "/admin", icon: BarChart3 },
    { name: "Management", href: "/admin/management", icon: Table },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Financials", href: "/admin/financials", icon: DollarSign },
    { name: "AI Insights", href: "/admin/insights", icon: Sparkles },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const userLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ...(user?.role === "CLIENT" 
      ? [{ name: "Post Project", href: "/projects/create", icon: PlusCircle }]
      : [{ name: "Browse Projects", href: "/projects", icon: Search }]
    ),
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const links = user?.role === "SUPER_ADMIN" ? adminLinks : userLinks;

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-bg-card border-r border-border z-[90] transition-all"
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Zap className="text-primary fill-current" size={24} />
            <span className="font-black text-lg tracking-tighter">NexusMarket</span>
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-bg-main text-text-muted transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-10 px-4 space-y-2 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-bg-main hover:text-text-main'
              }`}
            >
              <link.icon size={20} />
              {!isCollapsed && <span className="font-bold text-sm">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="w-full px-4 pb-10">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-bold text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
