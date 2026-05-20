"use client";

import { useEffect, useState } from "react";
import { Bell, Cpu, RefreshCw, Wifi } from "lucide-react";
import { formatUptime } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { motion } from "framer-motion";

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(3724);
  const [fps] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime((u) => u + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1a2744] bg-[#07090f]/90 px-6 backdrop-blur-xl">
      {/* Left — page title area */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold text-white">Security Dashboard</h1>
          <p className="text-[11px] text-gray-500">EdgePrint AI · Anti-Spoofing Engine</p>
        </div>
      </div>

      {/* Center — live stats strip */}
      <div className="hidden items-center gap-6 md:flex">
        {/* FPS */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <RefreshCw className="h-3.5 w-3.5 text-cyan-500" />
          <span className="font-mono font-semibold text-cyan-400">{fps}</span>
          <span>FPS</span>
        </div>

        {/* Uptime */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-mono font-semibold text-blue-400">{formatUptime(uptime)}</span>
          <span>uptime</span>
        </div>

        {/* Connection */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono font-semibold text-emerald-400">FastAPI</span>
          <span>connected</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-[#1a2744]" />

        {/* DateTime */}
        <div className="text-right">
          <p className="font-mono text-xs font-semibold text-gray-300">{timeStr}</p>
          <p className="text-[10px] text-gray-600">{dateStr}</p>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-3">
        {/* Model status */}
        <StatusBadge status="online" size="sm" />

        {/* Session ID */}
        <div className="hidden rounded-md border border-[#1a2744] bg-[#0d1526] px-2.5 py-1 lg:block">
          <p className="font-mono text-[10px] text-gray-500">
            SESSION <span className="text-cyan-400">EP-2024-001</span>
          </p>
        </div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#1a2744] bg-[#0d1526] text-gray-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)]" />
        </motion.button>
      </div>
    </header>
  );
}
