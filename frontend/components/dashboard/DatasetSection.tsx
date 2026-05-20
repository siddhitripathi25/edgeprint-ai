"use client";

import { useState } from "react";
import { Save, Play, Search, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { saveTemplate, startTraining, predictUser, clearDataset } from "@/lib/api";
import { getSimulatedState, setSimulatedState, addSimulatedLog } from "@/lib/mock-data";
import GlowCard from "@/components/ui/GlowCard";
import type { ActionState } from "@/types";

export default function DatasetSection() {
  const [actions, setActions] = useState<ActionState>({
    saveTemplate: "idle",
    startTraining: "idle",
    predictUser: "idle",
    clearDataset: "idle",
  });
  const [templateLabel, setTemplateLabel] = useState<string>("user1");
  const [message, setMessage] = useState<string>("");

  const runAction = async (key: keyof ActionState, fn: () => Promise<{ success: boolean; message: string }>) => {
    setActions((prev) => ({ ...prev, [key]: "loading" }));
    setMessage("");
    try {
      const res = await fn();
      if (res.success) {
        setActions((prev) => ({ ...prev, [key]: "success" }));
        setMessage(res.message);
      } else {
        setActions((prev) => ({ ...prev, [key]: "error" }));
        setMessage("Action failed. Check console/logs.");
      }
    } catch (e) {
      console.error(e);
      setActions((prev) => ({ ...prev, [key]: "error" }));
      setMessage("Connection error. Is FastAPI backend running?");
    } finally {
      setTimeout(() => {
        setActions((prev) => ({ ...prev, [key]: "idle" }));
      }, 3000);
    }
  };

  const handleSaveTemplate = async () => {
    const state = getSimulatedState();
    if (!state.isBackendConnected) {
      setActions((prev) => ({ ...prev, saveTemplate: "loading" }));
      setMessage("");
      setTimeout(() => {
        setActions((prev) => ({ ...prev, saveTemplate: "success" }));
        setMessage(`[SIMULATOR] Template saved under label '${templateLabel}'`);
        setSimulatedState((prevS) => ({
          ...prevS,
          modelInfo: {
            ...prevS.modelInfo,
            datasetSize: prevS.modelInfo.datasetSize + 1,
          }
        }));
        addSimulatedLog("info", "Template Saved", `Dataset template saved locally with label '${templateLabel}'`);
        setTimeout(() => setActions((prev) => ({ ...prev, saveTemplate: "idle" })), 3000);
      }, 1000);
    } else {
      runAction("saveTemplate", () => saveTemplate(templateLabel));
    }
  };

  const handleStartTraining = async () => {
    const state = getSimulatedState();
    if (!state.isBackendConnected) {
      setActions((prev) => ({ ...prev, startTraining: "loading" }));
      setMessage("");
      setTimeout(() => {
        setActions((prev) => ({ ...prev, startTraining: "success" }));
        const newAcc = 95.0 + Math.random() * 4;
        setMessage(`[SIMULATOR] Classifier retrained! Accuracy: ${newAcc.toFixed(1)}%`);
        setSimulatedState((prevS) => {
          const vParts = prevS.modelInfo.version.split(".");
          const nextV = `${vParts[0]}.${vParts[1]}.${parseInt(vParts[2]) + 1}`;
          return {
            ...prevS,
            modelInfo: {
              ...prevS.modelInfo,
              accuracy: parseFloat(newAcc.toFixed(1)),
              version: nextV,
              lastTrained: new Date().toISOString(),
            }
          };
        });
        addSimulatedLog("success", "Training Completed", `Random Forest retrained successfully. Accuracy: ${newAcc.toFixed(1)}%`);
        setTimeout(() => setActions((prev) => ({ ...prev, startTraining: "idle" })), 3000);
      }, 2000);
    } else {
      runAction("startTraining", startTraining);
    }
  };

  const handlePredictUser = async () => {
    setActions((prev) => ({ ...prev, predictUser: "loading" }));
    setMessage("");
    const state = getSimulatedState();
    if (!state.isBackendConnected) {
      setTimeout(() => {
        setActions((prev) => ({ ...prev, predictUser: "success" }));
        const users = ["USER1", "USER2", "SPOOF_BLUR", "SPOOF_STATIC"];
        const randUser = users[Math.floor(Math.random() * users.length)];
        const randConf = 85 + Math.random() * 15;
        setMessage(`[SIMULATOR] Prediction: ${randUser} (Confidence: ${randConf.toFixed(1)}%)`);
        addSimulatedLog("info", "User Classified", `Classification result: ${randUser} (${randConf.toFixed(1)}%)`);
        setTimeout(() => setActions((prev) => ({ ...prev, predictUser: "idle" })), 4000);
      }, 1200);
    } else {
      try {
        const res = await predictUser();
        setActions((prev) => ({ ...prev, predictUser: "success" }));
        setMessage(`Prediction: ${res.prediction} (Confidence: ${res.confidence.toFixed(1)}%)`);
      } catch (e) {
        console.error(e);
        setActions((prev) => ({ ...prev, predictUser: "error" }));
        setMessage("Prediction failed. Model not trained?");
      } finally {
        setTimeout(() => {
          setActions((prev) => ({ ...prev, predictUser: "idle" }));
        }, 4000);
      }
    }
  };

  const handleClearDataset = async () => {
    const state = getSimulatedState();
    if (!state.isBackendConnected) {
      setActions((prev) => ({ ...prev, clearDataset: "loading" }));
      setMessage("");
      setTimeout(() => {
        setActions((prev) => ({ ...prev, clearDataset: "success" }));
        setMessage("[SIMULATOR] CSV dataset cleared successfully.");
        setSimulatedState((prevS) => ({
          ...prevS,
          modelInfo: {
            ...prevS.modelInfo,
            datasetSize: 0,
          }
        }));
        addSimulatedLog("warning", "Dataset Cleared", "Landmark templates CSV dataset wiped by operator");
        setTimeout(() => setActions((prev) => ({ ...prev, clearDataset: "idle" })), 3000);
      }, 1000);
    } else {
      runAction("clearDataset", clearDataset);
    }
  };

  return (
    <GlowCard glowColor="cyan" className="p-4">
      <h3 className="mb-1 text-sm font-semibold text-white">Dataset Control Center</h3>
      <p className="mb-4 text-[11px] text-gray-500">Manage hand landmarks template and model prediction triggers</p>

      {/* Template Label / Class Input */}
      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Template Label / Class
        </label>
        <input
          type="text"
          value={templateLabel}
          onChange={(e) => setTemplateLabel(e.target.value)}
          placeholder="e.g. real, spoof, user1"
          className="w-full rounded-lg border border-[#1a2744] bg-[#07090f] px-3 py-2 font-mono text-xs text-gray-200 outline-none transition-colors focus:border-cyan-500/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">

        {/* Save Template */}
        <button
          onClick={handleSaveTemplate}
          disabled={actions.saveTemplate === "loading"}
          className="flex items-center justify-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/10 hover:shadow-[0_0_12px_rgba(0,245,255,0.15)] disabled:opacity-50"
        >
          {actions.saveTemplate === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Template
        </button>

        {/* Start Training */}
        <button
          onClick={handleStartTraining}
          disabled={actions.startTraining === "loading"}
          className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-purple-400 transition-all hover:bg-purple-500/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] disabled:opacity-50"
        >
          {actions.startTraining === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Start Training
        </button>

        {/* Predict User */}
        <button
          onClick={handlePredictUser}
          disabled={actions.predictUser === "loading"}
          className="flex items-center justify-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-blue-400 transition-all hover:bg-blue-500/10 hover:shadow-[0_0_12px_rgba(77,159,255,0.15)] disabled:opacity-50"
        >
          {actions.predictUser === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Predict User
        </button>

        {/* Clear Dataset */}
        <button
          onClick={handleClearDataset}
          disabled={actions.clearDataset === "loading"}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-400 transition-all hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] disabled:opacity-50"
        >
          {actions.clearDataset === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Clear Dataset
        </button>
      </div>

      {/* Message feedback strip */}
      {message && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs font-mono text-cyan-400">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400 animate-pulse" />
          <span className="truncate">{message}</span>
        </div>
      )}
    </GlowCard>
  );
}
