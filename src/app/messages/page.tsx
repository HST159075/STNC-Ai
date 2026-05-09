"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Send, Search, MoreVertical, 
  Phone, Video, Info, User,
  Clock, ShieldCheck, Zap,
  MessageSquare, Layout, Image as ImageIcon,
  Paperclip, Smile, ArrowLeft, FileText,
  Download, ExternalLink, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { messageService } from "@/services/messageService";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { socket } from "@/lib/socket";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

import { Suspense } from "react";

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get("conversationId");
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<any>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    // Socket connection
    socket.connect();
    
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      
      // Join conversation room
      socket.emit("join_conversation", selectedConversation.id);
      
      // Listen for messages
      const handleReceiveMessage = (message: any) => {
        // Only add if it belongs to this conversation and we don't have it yet
        if (message.conversationId === selectedConversation.id) {
          setMessages((prev) => {
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;
            return [...prev, message];
          });
          
          // Also update the conversation list snippet
          setConversations(prevConv => prevConv.map(c => 
            c.id === selectedConversation.id 
              ? { ...c, messages: [message] } 
              : c
          ));
        }
      };

      socket.on("receive_message", handleReceiveMessage);
      
      return () => {
        socket.off("receive_message", handleReceiveMessage);
      };
    }
  }, [selectedConversation]);


  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === initialConversationId);
      if (conv) setSelectedConversation(conv);
    }
  }, [initialConversationId, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data.conversations);
      if (data.conversations.length > 0 && !initialConversationId) {
        setSelectedConversation(data.conversations[0]);
      }
    } catch (error) {
      console.error("Fetch conv error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const data = await messageService.getMessages(id);
      setMessages(data.messages);
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachedFile) || !selectedConversation) return;

    try {
      const res = await messageService.sendMessage(
        selectedConversation.id, 
        newMessage, 
        attachedFile?.url, 
        attachedFile?.type
      );
      setMessages([...messages, res.message]);
      setNewMessage("");
      setAttachedFile(null);
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send message");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append(type, file);

    try {
      const endpoint = type === 'image' ? '/uploads/image' : '/uploads/file';
      const res = await apiClient.post(endpoint, formData);
      
      if (res.data.success) {
        setAttachedFile({
          url: type === 'image' ? res.data.imageUrl : res.data.fileUrl,
          name: file.name,
          type: type === 'image' ? 'IMAGE' : 'FILE'
        });
        toast.success(`${type === 'image' ? 'Image' : 'File'} attached`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getOtherParticipant = (conv: any) => {
    return conv.participants.find((p: any) => p.userId !== session?.user?.id)?.user;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg-main overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-24 pl-24 pr-8 pb-8 overflow-hidden">
        {/* Chat Sidebar */}
        <div className="w-96 bg-bg-card border border-border rounded-l-[3rem] flex flex-col overflow-hidden shadow-2xl shadow-black/10">
          <div className="p-8 border-b border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight">Messages</h2>
              <button className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <MessageSquare size={18} />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-bg-main border border-border pl-12 pr-4 py-3 rounded-2xl text-xs font-bold focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conv) => {
              const otherUser = getOtherParticipant(conv);
              const isActive = selectedConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 rounded-3xl transition-all flex items-center gap-4 group ${
                    isActive ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-bg-main"
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={otherUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg"} 
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10" 
                      alt="" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-bg-card rounded-full"></div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`font-black text-sm truncate ${isActive ? "text-white" : "text-text-main"}`}>
                      {otherUser?.name}
                    </p>
                    <p className={`text-[10px] font-medium truncate ${isActive ? "text-white/70" : "text-text-muted"}`}>
                      {conv.messages[0]?.content || "No messages yet"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[8px] font-black uppercase ${isActive ? "text-white/50" : "text-text-muted"}`}>
                      2m ago
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-bg-card border-y border-r border-border rounded-r-[3rem] flex flex-col overflow-hidden relative shadow-2xl shadow-black/10">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-bg-card/50 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border">
                    <img src={getOtherParticipant(selectedConversation)?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">{getOtherParticipant(selectedConversation)?.name}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <Zap size={10} fill="currentColor" /> Active Now
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl hover:bg-bg-main flex items-center justify-center text-text-muted transition-colors"><Phone size={18} /></button>
                  <button className="w-10 h-10 rounded-xl hover:bg-bg-main flex items-center justify-center text-text-muted transition-colors"><Video size={18} /></button>
                  <button className="w-10 h-10 rounded-xl hover:bg-bg-main flex items-center justify-center text-text-muted transition-colors"><Info size={18} /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-bg-main/30">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === session?.user?.id;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] space-y-2 ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`px-6 py-4 rounded-[2rem] text-sm font-medium shadow-sm ${
                          isMe ? "bg-primary text-white rounded-tr-none" : "bg-bg-card border border-border text-text-main rounded-tl-none"
                        }`}>
                          {msg.attachmentUrl && msg.attachmentType === 'IMAGE' && (
                            <div className="mb-4 rounded-2xl overflow-hidden border border-white/20">
                              <img src={msg.attachmentUrl} className="max-w-full h-auto object-cover" alt="Attachment" />
                            </div>
                          )}
                          {msg.attachmentUrl && msg.attachmentType === 'FILE' && (
                            <div className={`mb-4 p-4 rounded-2xl flex items-center gap-4 ${isMe ? "bg-white/10" : "bg-bg-main"}`}>
                               <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                                  <FileText size={20} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-black truncate max-w-[150px]">Document Attachment</p>
                                  <a href={msg.attachmentUrl} target="_blank" className="text-[8px] font-bold underline opacity-70">Download File</a>
                               </div>
                            </div>
                          )}
                          {msg.content}
                        </div>
                        <p className="text-[8px] font-black uppercase text-text-muted px-2">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-bg-card border-t border-border">
                <form onSubmit={handleSend} className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <input 
                      type="file" ref={fileInputRef} className="hidden" 
                      onChange={(e) => handleFileChange(e, 'file')} 
                    />
                    <input 
                      type="file" ref={imageInputRef} className="hidden" accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'image')} 
                    />
                    <button 
                      type="button" onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 text-text-muted hover:text-primary transition-colors"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button 
                      type="button" onClick={() => imageInputRef.current?.click()}
                      className="w-10 h-10 text-text-muted hover:text-primary transition-colors"
                    >
                      <ImageIcon size={20} />
                    </button>
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={attachedFile ? `Attached: ${attachedFile.name}` : "Draft a strategic message..."}
                      className={`w-full bg-bg-main border border-border px-6 py-4 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all ${attachedFile ? "border-primary/50 ring-1 ring-primary/20" : ""}`}
                    />
                    {attachedFile ? (
                      <button 
                        type="button" onClick={() => setAttachedFile(null)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:scale-110 transition-all"
                      >
                        <X size={20} />
                      </button>
                    ) : (
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                        <Smile size={20} />
                      </button>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-8">
                  <Zap size={40} fill="currentColor" />
               </div>
               <h3 className="text-3xl font-black mb-4">Strategic Communications</h3>
               <p className="text-sm text-text-muted font-medium max-w-sm">
                  Select a professional conversation from the architectural sidebar to begin secure negotiations.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-main flex items-center justify-center">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
