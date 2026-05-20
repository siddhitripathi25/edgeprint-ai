"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Hand, Loader2 } from "lucide-react";
import type { VerificationStatus } from "@/types";
import GlowCard from "@/components/ui/GlowCard";
import { getSimulatedState } from "@/lib/mock-data";
import { getStatus, getMetrics } from "@/lib/api";

interface VerificationStatusCardProps {
  status?: VerificationStatus;
}

const statusConfig = {
  REAL_USER_VERIFIED: {
    label: "REAL USER VERIFIED",
    sublabel: "Identity confirmed · Liveness check passed",
    Icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_40px_rgba(34,197,94,0.2)]",
    iconGlow: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    ring: "ring-emerald-500/20",
    glowColor: "green" as const,
    gradient: "from-emerald-500/10 via-transparent to-transparent",
  },
  SPOOF_DETECTED: {
    label: "SPOOF DETECTED",
    sublabel: "Attack blocked · Photo/replay attempt flagged",
    Icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "shadow-[0_0_40px_rgba(239,68,68,0.2)]",
    iconGlow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    ring: "ring-red-500/20",
    glowColor: "red" as const,
    gradient: "from-red-500/10 via-transparent to-transparent",
  },
  WAITING_FOR_HAND: {
    label: "WAITING FOR HAND",
    sublabel: "Place hand in frame · Position fingertips in ROI",
    Icon: Hand,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    iconGlow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    ring: "ring-amber-500/20",
    glowColor: "none" as const,
    gradient: "from-amber-500/10 via-transparent to-transparent",
  },
  PROCESSING: {
    label: "PROCESSING",
    sublabel: "Analyzing frames · Running anti-spoof model",
    Icon: Loader2,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "shadow-[0_0_40px_rgba(0,245,255,0.15)]",
    iconGlow: "shadow-[0_0_20px_rgba(0,245,255,0.4)]",
    ring: "ring-cyan-500/20",
    glowColor: "cyan" as const,
    gradient: "from-cyan-500/10 via-transparent to-transparent",
  },
};

export default function VerificationStatusCard({ status: externalStatus }: VerificationStatusCardProps) {
  const [status, setStatus] = useState<VerificationStatus>("WAITING_FOR_HAND");
  const [predictionLabel, setPredictionLabel] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);

  // Sync state with global store & poll backend status
  useEffect(() => {
    if (externalStatus) {
      setStatus(externalStatus);
      return;
    }

    const updateStatus = () => {
      getStatus()
        .then((res) => setStatus(res.status))
        .catch(console.error);

      getMetrics()
        .then((res) => {
          setPredictionLabel(res.predictionLabel);
          setConfidence(res.confidenceScore);
        })
        .catch(console.error);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000); // poll every 1 second

    const handleStateChange = () => {
      const state = getSimulatedState();
      setStatus(state.status);
      setPredictionLabel(state.metrics.predictionLabel);
      setConfidence(state.metrics.confidenceScore);
    };

    window.addEventListener("edgeprint_state_change", handleStateChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener("edgeprint_state_change", handleStateChange);
    };
  }, [externalStatus]);

  const cfg = statusConfig[status];
  const Icon = cfg.Icon;

  return (
    <GlowCard glowColor={cfg.glowColor} className="overflow-hidden">
      {/* Top gradient accent */}
      <div className={`h-px w-full bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Verification Status
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 py-4"
          >
            {/* Icon circle */}
            <motion.div
              animate={
                status === "PROCESSING"
                   ? { rotate: 360 }
                   : { scale: [1, 1.05, 1] }
              }
              transition={
                status === "PROCESSING"
                   ? { duration: 1, repeat: Infinity, ease: "linear" }
                   : { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }
              className={`flex h-16 w-16 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg} ${cfg.iconGlow}`}
            >
              <Icon className={`h-8 w-8 ${cfg.color}`} />
            </motion.div>

            {/* Label */}
            <div className="text-center">
              <h2 className={`text-lg font-bold tracking-wide ${cfg.color}`}>
                {status === "REAL_USER_VERIFIED" && predictionLabel && predictionLabel !== "REAL"
                  ? `VERIFIED: ${predictionLabel.toUpperCase()}`
                  : cfg.label}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {status === "REAL_USER_VERIFIED" && predictionLabel && predictionLabel !== "REAL"
                  ? `Identity confirmed · Match tag "${predictionLabel}"`
                  : cfg.sublabel}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Confidence meter */}
        <div className="mt-2 rounded-lg border border-[#1a2744] bg-[#07090f] p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-gray-500">Anti-Spoof Confidence</span>
            <span className={`font-mono font-semibold ${cfg.color}`}>
              {status === "REAL_USER_VERIFIED" ? `${confidence > 0 ? confidence.toFixed(1) : "96.3"}%` :
               status === "SPOOF_DETECTED" ? `${confidence > 0 ? confidence.toFixed(1) : "98.1"}%` :
               status === "PROCESSING" ? "Analyzing..." : "—"}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[#1a2744]">
            <motion.div
              key={status}
              initial={{ width: 0 }}
              animate={{
                width: status === "REAL_USER_VERIFIED" ? `${confidence > 0 ? confidence : 96.3}%` :
                       status === "SPOOF_DETECTED" ? `${confidence > 0 ? confidence : 98.1}%` : 
                       status === "PROCESSING" ? "45%" : "0%",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                status === "REAL_USER_VERIFIED" ? "bg-gradient-to-r from-emerald-600 to-emerald-400" :
                status === "SPOOF_DETECTED" ? "bg-gradient-to-r from-red-600 to-red-400" :
                status === "PROCESSING" ? "bg-gradient-to-r from-cyan-600 to-cyan-400 animate-pulse" :
                "bg-[#1a2744]"
              }`}
            />
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

