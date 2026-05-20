"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ModelInfoCard from "@/components/dashboard/ModelInfoCard";
import { startTraining } from "@/lib/api";
import { BrainCircuit, Play, Terminal, HelpCircle } from "lucide-react";
import { getSimulatedState } from "@/lib/mock-data";

export default function TrainingPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([
    "[SYSTEM] Ready to train hand_model.pkl",
    "[SYSTEM] Features: fingertip landmark delta vector mapping",
    "[SYSTEM] Source dataset: dataset.csv",
  ]);

  const addLine = (line: string) => {
    setLogLines((prev) => [...prev, line]);
  };

  const handleTrain = async () => {
    setIsTraining(true);
    addLine(`[TRAIN] Init training sequence at ${new Date().toLocaleTimeString()}`);
    addLine("[TRAIN] Loading dataset.csv features...");
    
    // Start backend request
    try {
      const res = await startTraining();
      addLine(`[TRAIN] Scikit-learn Classifier training completed!`);
      if (res.accuracy) {
        addLine(`[TRAIN] Evaluated model accuracy: ${res.accuracy.toFixed(3)}%`);
      }
      addLine("[SYSTEM] Pickled model saved successfully to hand_model.pkl");
    } catch (e) {
      addLine("[ERROR] Failed connecting to training backend.");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">Model Training Portal</h2>
          <p className="text-xs text-gray-500">Train the scikit-learn classifier pipeline using saved templates</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-4">
            <GlowCard glowColor="purple" className="p-4">
              <h3 className="mb-1 text-sm font-semibold text-white">Training Engine</h3>
              <p className="mb-4 text-[11px] text-gray-500">Trigger standard scikit-learn training cycle</p>

              <button
                onClick={handleTrain}
                disabled={isTraining}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-purple-400 transition-all hover:bg-purple-500/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] disabled:opacity-50"
              >
                {isTraining ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                RETRAIN HAND_MODEL.PKL
              </button>
            </GlowCard>

            <ModelInfoCard />
          </div>

          {/* Terminal output */}
          <div className="lg:col-span-8">
            <GlowCard glowColor="cyan" className="p-4 flex flex-col h-full">
              <div className="mb-3 flex items-center justify-between border-b border-[#1a2744] pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Interactive Training Terminal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] text-gray-500">TERMINAL ACTIVE</span>
                </div>
              </div>

              {/* Terminal window */}
              <div className="flex-1 rounded-lg border border-[#1a2744] bg-[#030712] p-4 font-mono text-xs text-cyan-400/90 h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin">
                {logLines.map((line, i) => (
                  <p key={i} className="leading-relaxed">
                    <span className="text-gray-600 mr-2">&gt;</span>
                    {line}
                  </p>
                ))}
                {isTraining && (
                  <p className="text-gray-500 animate-pulse">
                    <span className="text-gray-600 mr-2">&gt;</span>
                    Training classifier in progress...
                  </p>
                )}
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
