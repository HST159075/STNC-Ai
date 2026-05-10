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
        if (notification.type === 'MESSAGE_RECEIVED') return;
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
        // Filter out chat messages from general alerts
        const filtered = res.data.notifications.filter((n: any) => n.type !== 'MESSAGE_RECEIVED');
        setNotifications(filtered);
        setUnreadCount(filtered.filter((n: any) => !n.isRead).length);
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
        className="relative p-3 rounded-xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f172a] shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
            >
              <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-transparent dark:from-white/5 dark:to-transparent">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Bell size={16} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="max-h-[26rem] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all relative group ${
                        !n.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className={`text-sm font-semibold pr-6 ${!n.isRead ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                            className="absolute right-4 top-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all duration-200 shadow-sm"
                            title="Mark as read"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">
                        {n.body}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${!n.isRead ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"}`}></span>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                      <Bell size={24} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">You're all caught up!</p>
                  </div>
                )}
              </div>

              <div className="p-3 text-center border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors py-1 px-4 rounded-lg hover:bg-primary/5">
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
