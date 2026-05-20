"use client";

import { useState } from "react";
import { Activity, Eye, BarChart3 } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import LivenessChart from "../charts/LivenessChart";
import MotionTrendChart from "../charts/MotionTrendChart";
import FrameQualityChart from "../charts/FrameQualityChart";
import { mockChartData } from "@/lib/mock-data";

type Tab = "liveness" | "motion" | "quality";

export default function AntiSpoofPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("liveness");

  return (
    <GlowCard glowColor="cyan" className="p-4">
      {/* Header and switcher */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-white">Anti-Spoof Analytics</h3>
          <p className="text-[11px] text-gray-500">Real-time computer vision metrics</p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg border border-[#1a2744] bg-[#07090f] p-1">
          {[
            { id: "liveness", label: "Liveness Check", icon: Activity },
            { id: "motion", label: "Motion Trend", icon: BarChart3 },
            { id: "quality", label: "Frame Quality", icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(0,245,255,0.25)]"
                    : "text-gray-500 hover:bg-white/[0.02] hover:text-gray-300"
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart display */}
      <div className="rounded-lg border border-[#1a2744] bg-[#030712]/50 p-4">
        {activeTab === "liveness" && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400">LIVENESS SCORE (%)</span>
              <span className="font-mono text-xs text-gray-500">Threshold: 85%</span>
            </div>
            <LivenessChart data={mockChartData.liveness} />
          </div>
        )}
        {activeTab === "motion" && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-blue-400">MOTION SHIFT DELTA</span>
              <span className="font-mono text-xs text-gray-500">Threshold: 50%</span>
            </div>
            <MotionTrendChart data={mockChartData.motion} />
          </div>
        )}
        {activeTab === "quality" && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-purple-400">LAPLACIAN VARIANCE</span>
              <span className="font-mono text-xs text-gray-500">Threshold: 60%</span>
            </div>
            <FrameQualityChart data={mockChartData.frameQuality} />
          </div>
        )}
      </div>
    </GlowCard>
  );
}
