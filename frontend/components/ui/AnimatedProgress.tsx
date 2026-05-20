"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  color?: "cyan" | "blue" | "purple" | "green" | "red" | "amber";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorMap = {
  cyan: {
    bar: "bg-gradient-to-r from-cyan-500 to-cyan-300",
    glow: "shadow-[0_0_8px_rgba(0,245,255,0.6)]",
    track: "bg-cyan-500/10",
  },
  blue: {
    bar: "bg-gradient-to-r from-blue-500 to-blue-300",
    glow: "shadow-[0_0_8px_rgba(77,159,255,0.6)]",
    track: "bg-blue-500/10",
  },
  purple: {
    bar: "bg-gradient-to-r from-purple-600 to-purple-400",
    glow: "shadow-[0_0_8px_rgba(168,85,247,0.6)]",
    track: "bg-purple-500/10",
  },
  green: {
    bar: "bg-gradient-to-r from-green-600 to-emerald-400",
    glow: "shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    track: "bg-green-500/10",
  },
  red: {
    bar: "bg-gradient-to-r from-red-600 to-red-400",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    track: "bg-red-500/10",
  },
  amber: {
    bar: "bg-gradient-to-r from-amber-600 to-amber-400",
    glow: "shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    track: "bg-amber-500/10",
  },
};

const sizeMap = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

export default function AnimatedProgress({
  value,
  max = 100,
  color = "cyan",
  size = "md",
  showLabel = false,
  animated = true,
  className,
}: AnimatedProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const c = colorMap[color];

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-mono text-gray-400">{pct.toFixed(1)}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full", sizeMap[size], c.track)}>
        {animated ? (
          <motion.div
            className={cn("h-full rounded-full", c.bar, c.glow)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div
            className={cn("h-full rounded-full", c.bar, c.glow)}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
