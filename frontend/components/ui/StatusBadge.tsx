"use client";

import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";

interface StatusBadgeProps {
  status: VerificationStatus | "online" | "offline" | "training" | "ready" | "error";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  REAL_USER_VERIFIED: {
    label: "REAL USER VERIFIED",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  SPOOF_DETECTED: {
    label: "SPOOF DETECTED",
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
  WAITING_FOR_HAND: {
    label: "WAITING FOR HAND",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  PROCESSING: {
    label: "PROCESSING",
    dot: "bg-cyan-400",
    text: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
  },
  online: {
    label: "ONLINE",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  offline: {
    label: "OFFLINE",
    dot: "bg-gray-500",
    text: "text-gray-500",
    bg: "bg-gray-500/10 border-gray-500/20",
  },
  training: {
    label: "TRAINING",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  ready: {
    label: "READY",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  error: {
    label: "ERROR",
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-3 py-1 text-xs gap-1.5",
  lg: "px-4 py-1.5 text-sm gap-2",
};

const dotSizeMap = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

export default function StatusBadge({ status, size = "md", pulse = true, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig["PROCESSING"];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono font-semibold tracking-wider",
        config.bg,
        config.text,
        sizeMap[size],
        className
      )}
    >
      <span className={cn("relative flex shrink-0", dotSizeMap[size])}>
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dot
            )}
          />
        )}
        <span className={cn("relative inline-flex rounded-full", dotSizeMap[size], config.dot)} />
      </span>
      {config.label}
    </span>
  );
}
