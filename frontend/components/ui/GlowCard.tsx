"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "blue" | "purple" | "green" | "red" | "none";
  hoverable?: boolean;
  animated?: boolean;
}

const glowMap = {
  cyan: "hover:shadow-[0_0_30px_rgba(0,245,255,0.25)] hover:border-cyan-400/30 border-cyan-500/10",
  blue: "hover:shadow-[0_0_30px_rgba(77,159,255,0.25)] hover:border-blue-400/30 border-blue-500/10",
  purple: "hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-purple-400/30 border-purple-500/10",
  green: "hover:shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:border-green-400/30 border-green-500/10",
  red: "hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:border-red-400/30 border-red-500/10",
  none: "border-white/5",
};

export default function GlowCard({
  children,
  className,
  glowColor = "cyan",
  hoverable = true,
  animated = false,
}: GlowCardProps) {
  const base = (
    <div
      className={cn(
        "relative rounded-xl border bg-[#0a0f1e]/80 backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        hoverable && "cursor-default",
        glowMap[glowColor],
        className
      )}
    >
      {/* Subtle inner gradient overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent" />
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "relative rounded-xl border bg-[#0a0f1e]/80 backdrop-blur-xl",
          "transition-all duration-300 ease-out",
          hoverable && "cursor-default",
          glowMap[glowColor],
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent" />
        {children}
      </motion.div>
    );
  }

  return base;
}
