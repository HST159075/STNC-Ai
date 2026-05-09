"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, X, Loader2, ChevronRight,
  TrendingUp, AlertCircle, CheckCircle2,
  Sparkles, Clipboard, ClipboardCheck
} from "lucide-react";
import { aiService } from "@/services/aiService";

interface Improvement {
  area: string;
  priority: "High" | "Medium" | "Low";
  suggestion: string;
  impact: string;
}

interface OptimizationResult {
  overallScore: number;
  grade: string;
  headline: string;
  improvements: Improvement[];
  strengths: string[];
  suggestedBio: string;
}

const priorityConfig = {
  High:   { color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",    icon: AlertCircle },
  Medium: { color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20", icon: TrendingUp },
  Low:    { color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",   icon: CheckCircle2 },
};

const gradeColor: Record<string, string> = {
  A: "text-emerald-400", B: "text-blue-400", C: "text-amber-400", D: "text-red-400"
};

export default function AiProfileOptimizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const runOptimization = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await aiService.optimizeProfile();
      if (data.success) {
        setResult(data.optimization);
      } else {
        setError("Optimization failed. Please try again.");
      }
    } catch {
      setError("Could not connect to AI engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!result) runOptimization();
  };

  const copyBio = () => {
    if (result?.suggestedBio) {
      navigator.clipboard.writeText(result.suggestedBio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-blue-400" : "text-amber-400";

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-black text-xs uppercase tracking-widest group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <BrainCircuit size={16} className="shrink-0" />
        AI Optimize Profile
        <Sparkles size={10} className="animate-pulse" />
      </motion.button>

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-10 pb-8 bg-gradient-to-br from-primary/10 via-bg-card to-bg-card border-b border-border">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-xl hover:bg-bg-main transition-all text-text-muted"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <BrainCircuit className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Profile Optimizer</h2>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">AI Career Coach</p>
                  </div>
                </div>
                <p className="text-sm text-text-muted font-medium">
                  Get personalized recommendations to win more projects and boost your profile.
                </p>
              </div>

              {/* Body */}
              <div className="p-10 max-h-[65vh] overflow-y-auto space-y-8">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-text-muted animate-pulse">Analyzing your profile...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-sm font-bold flex items-center gap-3">
                    <AlertCircle size={18} /> {error}
                    <button onClick={runOptimization} className="ml-auto underline text-xs">Retry</button>
                  </div>
                )}

                {result && !loading && (
                  <>
                    {/* Score Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-6 p-6 rounded-2xl bg-bg-main border border-border"
                    >
                      <div className="text-center">
                        <div className={`text-5xl font-black ${scoreColor(result.overallScore)}`}>
                          {result.overallScore}
                        </div>
                        <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Score</div>
                      </div>
                      <div className={`text-4xl font-black ${gradeColor[result.grade] || 'text-text-muted'}`}>
                        {result.grade}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm mb-1">{result.headline}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                          {result.improvements?.length} improvements found
                        </p>
                      </div>
                    </motion.div>

                    {/* Strengths */}
                    {result.strengths?.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Your Strengths ✨</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.strengths.map((s, i) => (
                            <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvements */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Action Plan</h3>
                      {result.improvements?.map((item, i) => {
                        const cfg = priorityConfig[item.priority] || priorityConfig["Low"];
                        const Icon = cfg.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-5 bg-bg-main rounded-2xl border border-border hover:border-primary/30 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${cfg.bg} ${cfg.color}`}>
                                <Icon size={10} /> {item.priority}
                              </span>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{item.area}</span>
                              <ChevronRight size={12} className="text-text-muted ml-auto" />
                            </div>
                            <p className="text-sm font-bold mb-1">{item.suggestion}</p>
                            <p className="text-[11px] text-text-muted font-medium">{item.impact}</p>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Suggested Bio */}
                    {result.suggestedBio && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">AI-Crafted Bio</h3>
                          <button
                            onClick={copyBio}
                            className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                          >
                            {copied ? <ClipboardCheck size={12} /> : <Clipboard size={12} />}
                            {copied ? "Copied!" : "Copy Bio"}
                          </button>
                        </div>
                        <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl text-sm font-medium text-text-muted leading-relaxed italic">
                          "{result.suggestedBio}"
                        </div>
                      </div>
                    )}

                    {/* Re-run */}
                    <button
                      onClick={runOptimization}
                      className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-text-muted border border-border rounded-2xl hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={12} /> Re-analyze Profile
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
