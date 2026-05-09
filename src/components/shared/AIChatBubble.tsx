"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { aiService } from "@/services/aiService";

export default function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm Nexus AI. How can I assist you with your project today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiService.getArchitectAdvice(userMsg);
      // Assuming the response structure is { success: true, advice: "..." }
      const aiContent = res.advice || res.content || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "ai", content: aiContent }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "Oops! Something went wrong with my circuits. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 glass-morphism rounded-[2.5rem] border border-primary/20 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-6 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="font-black text-sm tracking-tight">Nexus AI</div>
                  <div className="text-[10px] font-bold uppercase opacity-70">Expert Assistant</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="h-96 p-6 overflow-y-auto bg-bg-main flex flex-col gap-4 custom-scrollbar">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-4 text-sm font-medium leading-relaxed max-w-[85%] ${
                      msg.role === 'ai' 
                      ? 'bg-bg-card border border-border rounded-2xl rounded-tl-none shadow-sm' 
                      : 'bg-primary/10 border border-primary/20 text-primary rounded-2xl rounded-tr-none'
                    }`}>
                      {typeof msg.content === 'object' && msg.content !== null ? (
                        <div className="space-y-3">
                          <p className="font-black text-primary uppercase text-[10px] tracking-widest">Architectural Blueprint</p>
                          <div className="text-xs space-y-2">
                             {(msg.content as any).title && <p><strong>Title:</strong> {String((msg.content as any).title)}</p>}
                             {(msg.content as any).techStack && (
                               <p><strong>Tech Stack:</strong> {Array.isArray((msg.content as any).techStack) ? (msg.content as any).techStack.join(', ') : String((msg.content as any).techStack)}</p>
                             )}
                             {(msg.content as any).estimate && typeof (msg.content as any).estimate === 'object' && (
                               <p><strong>Estimate:</strong> {String((msg.content as any).estimate.budget || '')} | {String((msg.content as any).estimate.timeline || '')}</p>
                             )}
                             {(msg.content as any).advice && <p className="italic mt-2 text-text-muted">"{String((msg.content as any).advice)}"</p>}
                             {!(msg.content as any).title && !(msg.content as any).advice && <pre className="text-[10px] overflow-x-auto">{JSON.stringify(msg.content, null, 2)}</pre>}
                          </div>
                        </div>
                      ) : (
                        String(msg.content)
                      )}
                    </div>
                 </div>
               ))}
               {loading && (
                 <div className="flex justify-start">
                    <div className="bg-bg-card border border-border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-text-muted text-xs">
                       <Loader2 className="animate-spin" size={14} /> AI is thinking...
                    </div>
                 </div>
               )}
               <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-bg-card border-t border-border flex gap-2 shrink-0">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask Nexus AI anything..." 
                 className="flex-1 bg-bg-main border border-border px-5 py-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
               />
               <button 
                 disabled={loading || !input.trim()}
                 className="p-3 bg-primary text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
               >
                  <Send size={18} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
      </motion.button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}</style>
    </div>
  );
}
