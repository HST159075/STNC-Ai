"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, MessageSquare, Briefcase, 
  CheckCircle2, Clock, Trash2, 
  ChevronRight, Zap, Info
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useSession } from "@/lib/auth-client";
import { notificationService } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session?.user?.id]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications(session?.user?.id as string);
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE_RECEIVED': return <MessageSquare className="text-blue-500" />;
      case 'BID_RECEIVED': return <Briefcase className="text-purple-500" />;
      case 'BID_ACCEPTED': return <CheckCircle2 className="text-emerald-500" />;
      case 'CONTRACT_CREATED': return <Clock className="text-amber-500" />;
      default: return <Info className="text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      <Sidebar />

      <main className="pt-28 pb-20 px-4 sm:px-8 lg:pl-[280px] lg:pt-32">
        <div className="container mx-auto max-w-4xl">
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                <Bell className="text-primary" size={36} /> Notifications
              </h1>
              <p className="text-text-muted font-medium mt-2">Stay updated with your strategic activities.</p>
            </div>
            {notifications.length > 0 && (
               <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                  Mark all as read
               </button>
            )}
          </header>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-bg-card border border-border rounded-[2rem] animate-pulse" />
              ))
            ) : notifications.length > 0 ? (
              <AnimatePresence>
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-6 ${
                      n.isRead 
                        ? 'bg-bg-card border-border opacity-70' 
                        : 'bg-white border-primary/20 shadow-xl shadow-primary/5'
                    }`}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                  >
                    {!n.isRead && (
                       <div className="absolute top-8 left-0 w-1 h-8 bg-primary rounded-r-full" />
                    )}
                    
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-bg-main border border-border group-hover:scale-110 transition-transform`}>
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-black ${n.isRead ? 'text-text-main' : 'text-primary'}`}>{n.title}</h4>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted font-medium line-clamp-1">{n.body}</p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-all">
                       <ChevronRight className="text-text-muted" size={20} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-20 text-center bg-bg-card border border-border border-dashed rounded-[3rem]">
                 <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="text-text-muted opacity-20" size={40} />
                 </div>
                 <h3 className="text-xl font-black mb-2">All Clear!</h3>
                 <p className="text-text-muted font-medium">You have no new strategic notifications.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
