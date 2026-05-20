"use client";

import { useEffect, useState } from "react";
import { Bell, Cpu, RefreshCw, Wifi, X, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { formatUptime } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { getSimulatedState } from "@/lib/mock-data";
import type { LogEntry } from "@/types";

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(3724);
  const [fps, setFps] = useState(24);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime((u) => u + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor global state store changes for connection and logs
  useEffect(() => {
    const updateLocalState = () => {
      const state = getSimulatedState();
      setIsBackendConnected(state.isBackendConnected);
      setLogs(state.logs);
      setFps(state.status === "WAITING_FOR_HAND" ? 0 : 24);
    };

    updateLocalState();
    window.addEventListener("edgeprint_state_change", updateLocalState);
    return () => window.removeEventListener("edgeprint_state_change", updateLocalState);
  }, []);

  const timeStr = mounted
    ? time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "--:--:--";

  const dateStr = mounted
    ? time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "--- --, ----";

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "error":
        return <X className="h-3.5 w-3.5 text-red-400" />;
      default:
        return <Info className="h-3.5 w-3.5 text-cyan-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1a2744] bg-[#07090f]/90 px-6 backdrop-blur-xl animate-fade-in">
      {/* Left — page title area */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold text-white">Security Control Panel</h1>
          <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
            {isBackendConnected ? "CLOUD-STREAM CONNECTED" : "OFFLINE ENGINE SIMULATED"}
          </p>
        </div>
      </div>

      {/* Center — live stats strip */}
      <div className="hidden items-center gap-6 md:flex">
        {/* FPS */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <RefreshCw className={`h-3.5 w-3.5 text-cyan-500 ${fps > 0 ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
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
          <Wifi className={`h-3.5 w-3.5 ${isBackendConnected ? "text-emerald-400 animate-pulse" : "text-amber-500"}`} />
          <span className={`font-mono font-semibold ${isBackendConnected ? "text-emerald-400" : "text-amber-500"}`}>
            {isBackendConnected ? "FastAPI" : "Local Sim"}
          </span>
          <span>{isBackendConnected ? "connected" : "ready"}</span>
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
      <div className="relative flex items-center gap-3">
        {/* Model status */}
        <StatusBadge status={isBackendConnected ? "online" : "offline"} size="sm" />

        {/* Session ID */}
        <div className="hidden rounded-md border border-[#1a2744] bg-[#0d1526] px-2.5 py-1 lg:block">
          <p className="font-mono text-[10px] text-gray-500">
            SESSION <span className="text-cyan-400">{isBackendConnected ? "EP-LIVE-01" : "EP-SIM-V2"}</span>
          </p>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg border bg-[#0d1526] text-gray-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400 ${
              notificationsOpen ? "border-cyan-500/50 text-cyan-400" : "border-[#1a2744]"
            }`}
          >
            <Bell className="h-4 w-4" />
            {logs.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,245,255,0.8)] animate-pulse" />
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <>
                {/* Backdrop overlay to close */}
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 z-50 w-80 overflow-hidden rounded-xl border border-cyan-500/20 bg-[#0a0f1e]/95 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-[#1a2744] px-3.5 py-2.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</span>
                    <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-400">
                      {logs.length} Total
                    </span>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                    {logs.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">No recent alerts recorded.</div>
                    ) : (
                      logs.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-2.5 px-3.5 py-2 hover:bg-white/[0.02] border-b border-[#131d35]/30 last:border-0"
                        >
                          <div className="mt-0.5 shrink-0">{getLogIcon(log.type)}</div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="truncate text-[11px] font-bold text-gray-200">{log.event}</span>
                              <span className="font-mono text-[8px] text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] text-gray-400">{log.detail}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
