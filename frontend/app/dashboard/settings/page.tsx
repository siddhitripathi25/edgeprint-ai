"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import { Shield, Eye, Settings, HelpCircle, Save } from "lucide-react";
import { addSimulatedLog } from "@/lib/mock-data";

export default function SettingsPage() {
  const [blurThreshold, setBlurThreshold] = useState(100);
  const [motionThreshold, setMotionThreshold] = useState(2);
  const [validFramesReq, setValidFramesReq] = useState(30);
  const [selectedModel, setSelectedModel] = useState("hand_model.pkl");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    addSimulatedLog("info", "Settings Saved", `Updated thresholds: Blur=${blurThreshold}, Motion=${motionThreshold}`);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">System Configuration</h2>
          <p className="text-xs text-gray-500">Fine-tune CV thresholds, classifier sensitivity, and camera parameters</p>
        </div>

        <div className="max-w-3xl space-y-6">
          <GlowCard glowColor="cyan" className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Laplacian Variance Blur Filter</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Minimum Blur Score (Quality)</span>
                <span className="text-cyan-400 font-bold">{blurThreshold}</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                value={blurThreshold}
                onChange={(e) => setBlurThreshold(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-[11px] text-gray-600">
                Variance threshold for Laplacian filter. Lower values permit blurry images; higher values restrict feed to sharp images.
              </p>
            </div>
          </GlowCard>

          <GlowCard glowColor="blue" className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Motion Differencing Sensitivity</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Minimum Motion Score (Delta Mean)</span>
                <span className="text-blue-400 font-bold">{motionThreshold}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={motionThreshold}
                onChange={(e) => setMotionThreshold(parseFloat(e.target.value))}
                className="w-full accent-blue-400"
              />
              <p className="text-[11px] text-gray-600">
                Minimum frame differences required to classify sequence as live motion. Prevents photo attack bypasses.
              </p>
            </div>
          </GlowCard>

          <GlowCard glowColor="purple" className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">Active Classifier Weights</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-gray-400">Classifier Pickle file</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="rounded-lg border border-[#1a2744] bg-[#07090f] px-3 py-2 text-xs font-mono text-gray-300 outline-none focus:border-cyan-400/40"
                >
                  <option value="hand_model.pkl">hand_model.pkl (Pickle Classifier)</option>
                  <option value="liveness_resnet50.onnx">liveness_resnet50.onnx (ResNet ONNX)</option>
                </select>
              </div>
            </div>
          </GlowCard>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 font-mono text-xs font-bold text-cyan-400 hover:bg-cyan-500/20"
            >
              <Save className="h-4 w-4" />
              {saved ? "SAVED!" : "SAVE CONFIGURATION"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
