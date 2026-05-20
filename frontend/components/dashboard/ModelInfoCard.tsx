"use client";

import { useEffect, useState } from "react";
import { Brain, Cpu, Database, Calendar } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { getModelInfo } from "@/lib/api";
import type { ModelInfo } from "@/types";
import { mockModelInfo } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/utils";

export default function ModelInfoCard() {
  const [info, setInfo] = useState<ModelInfo>(mockModelInfo);

  useEffect(() => {
    getModelInfo().then(setInfo).catch(console.error);
  }, []);

  return (
    <GlowCard glowColor="purple" className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">AI Model Information</span>
        </div>
        <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 font-mono text-[10px] text-purple-400">
          v{info.version}
        </span>
      </div>

      <div className="space-y-3">
        {/* Metric Row 1: Accuracy */}
        <div className="flex items-center justify-between rounded-lg border border-[#1a2744] bg-[#07090f] p-2.5">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Model Accuracy</span>
          </div>
          <span className="font-mono text-xs font-bold text-cyan-400">{info.accuracy.toFixed(1)}%</span>
        </div>

        {/* Metric Row 2: Dataset Size */}
        <div className="flex items-center justify-between rounded-lg border border-[#1a2744] bg-[#07090f] p-2.5">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-400">Dataset Size</span>
          </div>
          <span className="font-mono text-xs font-bold text-blue-400">{info.datasetSize} vectors</span>
        </div>

        {/* Metric Row 3: Last Trained */}
        <div className="flex items-center justify-between rounded-lg border border-[#1a2744] bg-[#07090f] p-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-400">Last Trained</span>
          </div>
          <span className="font-mono text-xs font-bold text-purple-400" suppressHydrationWarning>
            {formatTimestamp(info.lastTrained)}
          </span>
        </div>


        {/* Metric Row 4: Active Model */}
        <div className="flex items-center justify-between rounded-lg border border-[#1a2744] bg-[#07090f] p-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Active Model</span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">{info.activeModel}</span>
        </div>
      </div>
    </GlowCard>
  );
}
