"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { socket } from "@/lib/socket";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/axios";

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      // Fetch initial notifications
      fetchNotifications();

      // Connect socket and join personal room
      socket.connect();
      socket.emit("join_user", (session.user as any).id);

      // Listen for new notifications
      socket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        // Play subtle sound or show toast
      });

      return () => {
        socket.off("new_notification");
        socket.disconnect();
      };
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter((n: any) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-bg-card border border-border hover:border-primary/50 transition-all group"
      >
        <Bell size={20} className="text-text-muted group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-bg-card animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-main/50">
                <h3 className="font-black text-sm uppercase tracking-widest">Alerts</h3>
                <span className="text-[10px] font-black text-primary uppercase">{unreadCount} New</span>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-5 border-b border-border/50 hover:bg-bg-main transition-all relative group ${
                        !n.isRead ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-xs font-black ${!n.isRead ? "text-text-main" : "text-text-muted"}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="p-1 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-all"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed mb-2">{n.body}</p>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-text-muted italic text-xs">
                    No new alerts found.
                  </div>
                )}
              </div>

              <div className="p-4 text-center border-t border-border bg-bg-main/30">
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                  View All Notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
