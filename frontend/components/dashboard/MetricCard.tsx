"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedProgress from "@/components/ui/AnimatedProgress";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  progress?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "cyan" | "blue" | "purple" | "green" | "red" | "amber";
  description?: string;
  index?: number;
}

const colorMap = {
  cyan: {
    icon: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    value: "text-cyan-300",
    glow: "hover:shadow-[0_0_24px_rgba(0,245,255,0.15)]",
    border: "hover:border-cyan-500/20",
  },
  blue: {
    icon: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    value: "text-blue-300",
    glow: "hover:shadow-[0_0_24px_rgba(77,159,255,0.15)]",
    border: "hover:border-blue-500/20",
  },
  purple: {
    icon: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    value: "text-purple-300",
    glow: "hover:shadow-[0_0_24px_rgba(168,85,247,0.15)]",
    border: "hover:border-purple-500/20",
  },
  green: {
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    value: "text-emerald-300",
    glow: "hover:shadow-[0_0_24px_rgba(34,197,94,0.15)]",
    border: "hover:border-emerald-500/20",
  },
  red: {
    icon: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
    value: "text-red-300",
    glow: "hover:shadow-[0_0_24px_rgba(239,68,68,0.15)]",
    border: "hover:border-red-500/20",
  },
  amber: {
    icon: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    value: "text-amber-300",
    glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]",
    border: "hover:border-amber-500/20",
  },
};

export default function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  progress,
  trend = "neutral",
  trendValue,
  color = "cyan",
  description,
  index = 0,
}: MetricCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[#1a2744] bg-[#0a0f1e]/80 p-4",
        "backdrop-blur-xl transition-all duration-300 cursor-default",
        c.glow,
        c.border
      )}
    >
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.015] to-transparent" />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", c.iconBg)}>
          <Icon className={cn("h-4 w-4", c.icon)} />
        </div>

        {/* Trend indicator */}
        {trendValue && (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            trend === "up" && "bg-emerald-500/10 text-emerald-400",
            trend === "down" && "bg-red-500/10 text-red-400",
            trend === "neutral" && "bg-gray-500/10 text-gray-400",
          )}>
            {trend === "up" && <TrendingUp className="h-2.5 w-2.5" />}
            {trend === "down" && <TrendingDown className="h-2.5 w-2.5" />}
            {trend === "neutral" && <Minus className="h-2.5 w-2.5" />}
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <div className={cn("font-mono text-2xl font-bold leading-none", c.value)}>
          {value}
          {unit && <span className="ml-1 text-sm font-medium text-gray-500">{unit}</span>}
        </div>
      </div>

      {/* Label */}
      <p className="text-xs font-medium text-gray-400">{label}</p>

      {/* Description */}
      {description && (
        <p className="mt-1 text-[11px] text-gray-600">{description}</p>
      )}

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <AnimatedProgress value={progress} color={color} size="sm" />
        </div>
      )}
    </motion.div>
  );
}
