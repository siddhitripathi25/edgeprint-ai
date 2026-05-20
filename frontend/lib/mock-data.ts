/**
 * EdgePrint AI — Shared Simulation & API State
 */

import type { VerificationStatus, MetricsData, LogEntry, ModelInfo } from "@/types";

// Simulated server state
export interface SimulatedState {
  status: VerificationStatus;
  metrics: MetricsData;
  logs: LogEntry[];
  modelInfo: ModelInfo;
  isBackendConnected: boolean;
  useCloudStream: boolean;
}

// Initial state
const initialState: SimulatedState = {
  status: "WAITING_FOR_HAND",
  metrics: {
    motionScore: 0.0,
    blurScore: 0.0,
    fingerMovement: 0.0,
    validFrames: 0,
    confidenceScore: 0.0,
    predictionLabel: "WAITING",
    timestamp: new Date().toISOString(),
  },
  logs: [
    {
      id: "log-001",
      type: "info",
      event: "System Startup",
      detail: "EdgePrint AI Engine initialized. Awaiting camera feed...",
      timestamp: new Date().toISOString(),
    }
  ],
  modelInfo: {
    modelName: "EdgePrint Anti-Spoof v2",
    accuracy: 96.3,
    datasetSize: 1420,
    lastTrained: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    activeModel: "hand_model.pkl",
    version: "2.4.1",
    status: "ready",
  },
  isBackendConnected: false,
  useCloudStream: true,
};

// Global singleton for client-side state
let stateStore = { ...initialState };

// Helper to get or set state
export function getSimulatedState(): SimulatedState {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("edgeprint_sim_state");
    if (saved) {
      try {
        stateStore = JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
  }
  return stateStore;
}

export function setSimulatedState(updater: Partial<SimulatedState> | ((prev: SimulatedState) => SimulatedState)) {
  const prev = getSimulatedState();
  const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
  stateStore = next;
  if (typeof window !== "undefined") {
    localStorage.setItem("edgeprint_sim_state", JSON.stringify(next));
    // Dispatch custom event to notify other components of state changes
    window.dispatchEvent(new Event("edgeprint_state_change"));
  }
}

// Generate realistic log entry helper
export function addSimulatedLog(type: LogEntry["type"], event: string, detail: string) {
  const newLog: LogEntry = {
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    type,
    event,
    detail,
    timestamp: new Date().toISOString(),
  };
  setSimulatedState((prev) => ({
    ...prev,
    logs: [newLog, ...prev.logs].slice(0, 50), // keep last 50
  }));
}

// Initial mock export definitions for components
export const mockMetrics: MetricsData = initialState.metrics;
export const mockLogs: LogEntry[] = initialState.logs;
export const mockStatus = {
  status: initialState.status,
  isLive: true,
  sessionId: "EP-2024-SIM",
  fps: 0,
  uptime: 1200,
};
export const mockModelInfo: ModelInfo = initialState.modelInfo;

function generateChartData(points: number, baseValue: number, variance: number) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 1000 * 5).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance)),
  }));
}

export const mockChartData = {
  liveness: generateChartData(20, 85, 20),
  motion: generateChartData(20, 72, 30),
  frameQuality: generateChartData(20, 90, 15),
};

