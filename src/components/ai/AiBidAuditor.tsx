"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Trophy, Zap, ShieldCheck,
  TrendingUp, AlertTriangle, X, Loader2
} from "lucide-react";
import { aiService } from "@/services/aiService";

interface RankedBid {
  freelancer: string;
  score: number;
  justification: string;
  matchType: "Perfect Match" | "Good" | "Risky";
}

interface AuditResult {
  rankings: RankedBid[];
  topPick: string;
  strategicAdvice: string;
}

interface AiBidAuditorProps {
  projectId: string;
  bidCount: number;
}

const matchConfig = {
  "Perfect Match": { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: ShieldCheck },
  "Good":          { color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",    icon: TrendingUp },
  "Risky":         { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",  icon: AlertTriangle },
};

export default function AiBidAuditor({ projectId, bidCount }: AiBidAuditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const runAudit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await aiService.auditProjectBids(projectId);
      if (data.success) {
        setResult(data.analysis);
      } else {
        setError("AI analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to AI engine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!result) runAudit();
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Sparkles size={16} className="animate-pulse" />
        AI Bid Auditor
        <span className="px-2 py-0.5 bg-primary/20 rounded-full text-[9px]">{bidCount} bids</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {/* Gradient Header */}
              <div className="relative p-10 pb-8 bg-gradient-to-br from-primary/10 via-bg-card to-bg-card border-b border-border">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-xl hover:bg-bg-main transition-all text-text-muted"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">AI Bid Auditor</h2>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Powered by Groq AI</p>
                  </div>
                </div>
                <p className="text-sm text-text-muted font-medium">
                  Analyzing {bidCount} proposals against your project requirements...
                </p>
              </div>

              {/* Content */}
              <div className="p-10 max-h-[60vh] overflow-y-auto space-y-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-text-muted animate-pulse">Auditing proposals with AI...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-sm font-bold flex items-center gap-3">
                    <AlertTriangle size={18} /> {error}
                    <button onClick={runAudit} className="ml-auto text-red-400 underline text-xs">Retry</button>
                  </div>
                )}

                {result && !loading && (
                  <>
                    {/* Top Pick Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy size={18} className="text-yellow-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Top Pick</span>
                      </div>
                      <p className="font-black text-xl mb-2">{result.topPick}</p>
                      <p className="text-sm text-text-muted font-medium leading-relaxed">{result.strategicAdvice}</p>
                    </motion.div>

                    {/* Rankings */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Full Rankings</h3>
                      {result.rankings?.map((bid, i) => {
                        const config = matchConfig[bid.matchType] || matchConfig["Good"];
                        const Icon = config.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-bg-main rounded-2xl border border-border hover:border-primary/30 transition-all"
                          >
                            {/* Rank Badge */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${i === 0 ? 'bg-primary text-white' : 'bg-bg-card border border-border text-text-muted'}`}>
                              #{i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                                <span className="font-black text-sm">{bid.freelancer}</span>
                                <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${config.bg} ${config.color}`}>
                                  <Icon size={10} /> {bid.matchType}
                                </span>
                              </div>
                              <p className="text-[11px] text-text-muted font-medium leading-relaxed">{bid.justification}</p>
                            </div>
                            {/* Score Ring */}
                            <div className="shrink-0 text-center">
                              <div className={`text-2xl font-black ${bid.score >= 80 ? 'text-emerald-400' : bid.score >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>
                                {bid.score}
                              </div>
                              <div className="text-[9px] font-black text-text-muted uppercase">Score</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Re-run button */}
                    <button
                      onClick={runAudit}
                      className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-text-muted border border-border rounded-2xl hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={12} /> Re-run Analysis
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
