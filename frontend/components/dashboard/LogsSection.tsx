"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw } from "lucide-react";
import { getLogs } from "@/lib/api";
import type { LogEntry } from "@/types";
import { mockLogs } from "@/lib/mock-data";
import GlowCard from "@/components/ui/GlowCard";
import { formatTimestamp } from "@/lib/utils";

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
  warning: "text-amber-400 bg-amber-500/5 border-amber-500/10",
  error: "text-red-400 bg-red-500/5 border-red-500/10",
  info: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10",
};

export default function LogsSection() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = () => {
    setIsRefreshing(true);
    getLogs()
      .then((data) => {
        setLogs(data);
        setTimeout(() => setIsRefreshing(false), 600);
      })
      .catch((e) => {
        console.error(e);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <GlowCard glowColor="cyan" className="flex flex-col">
      <div className="flex items-center justify-between border-b border-[#1a2744] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Security Event Logs</h3>
          <p className="text-[11px] text-gray-500">Real-time anti-spoof decision tracking</p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={isRefreshing}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#1a2744] bg-[#0d1526] text-gray-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      {/* Logs feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[260px] scrollbar-thin">
        {logs.map((log) => {
          const LogIcon = iconMap[log.type];
          return (
            <div
              key={log.id}
              className={`flex items-start gap-3 rounded-lg border p-2.5 font-mono text-[11px] transition-all hover:bg-white/2 ${
                colorMap[log.type]
              }`}
            >
              <LogIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider">{log.event}</span>
                  <span className="text-[10px] text-gray-500" suppressHydrationWarning>{formatTimestamp(log.timestamp)}</span>
                </div>

                <p className="mt-0.5 text-gray-400 truncate">{log.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}
