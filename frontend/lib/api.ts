/**
 * EdgePrint AI — API Service Layer with FastAPI connection & Mock fallback
 */

import type { StatusResponse, MetricsData, LogEntry, ModelInfo } from "@/types";
import { getSimulatedState, setSimulatedState, addSimulatedLog } from "./mock-data";

export let BASE_URL = "https://edgeprint-ai-2.onrender.com";

if (typeof window !== "undefined") {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
    BASE_URL = "http://localhost:8000";
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  }
}

// Fast check to see if FastAPI is alive
let isAlive = false;

async function checkConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout to allow sleeping Render instances to wake up
    const res = await fetch(`${BASE_URL}/status`, { signal: controller.signal });
    clearTimeout(id);
    const alive = res.ok;
    if (alive !== isAlive) {
      isAlive = alive;
      setSimulatedState({ isBackendConnected: alive });
    }
    return alive;
  } catch (e) {
    if (isAlive) {
      isAlive = false;
      setSimulatedState({ isBackendConnected: false });
    }
    return false;
  }
}

// Perform connection check periodically
if (typeof window !== "undefined") {
  checkConnection();
  setInterval(checkConnection, 5000);
}

// --- GET /status ---
export async function getStatus(): Promise<StatusResponse> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/status`);
      const data = await res.json();
      return {
        status: data.status,
        isLive: true,
        sessionId: data.session_id || "EP-2024-LIVE",
        fps: data.fps || 24,
        uptime: data.uptime || 0,
      };
    } catch (e) {
      console.warn("[API] Failed fetching status, falling back to mock:", e);
    }
  }

  // Fallback to simulation
  const state = getSimulatedState();
  return {
    status: state.status,
    isLive: true,
    sessionId: "EP-2024-SIM",
    fps: state.status === "WAITING_FOR_HAND" ? 0 : 24,
    uptime: 1200,
  };
}

// --- GET /metrics ---
export async function getMetrics(): Promise<MetricsData> {
  const state = getSimulatedState();
  
  // If cloud stream is active, the real-time frame processing loop dispatches frame response metrics
  // directly into the local state store. We return this immediately to prevent overwriting
  // live metrics with 0.0 values from stale poll requests hitting isolated backend worker threads.
  if (state.useCloudStream) {
    return state.metrics;
  }

  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/metrics`);
      const data = await res.json();
      return {
        motionScore: data.motion_score ?? 0,
        blurScore: data.blur_score ?? 0,
        fingerMovement: data.finger_movement ?? data.finger_move ?? 0,
        validFrames: data.valid_frames ?? 0,
        confidenceScore: data.confidence_score ?? 0,
        predictionLabel: data.prediction_label ?? "WAITING",
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      // fallback
    }
  }

  // Simulation: slowly update metric drift if processing or verified
  const state = getSimulatedState();
  if (state.status === "REAL_USER_VERIFIED") {
    return {
      motionScore: Math.max(80, Math.min(100, 85 + (Math.random() - 0.5) * 5)),
      blurScore: Math.max(90, Math.min(100, 93 + (Math.random() - 0.5) * 4)),
      fingerMovement: Math.max(60, Math.min(100, 72 + (Math.random() - 0.5) * 8)),
      validFrames: Math.min(300, state.metrics.validFrames + 1),
      confidenceScore: Math.max(95, Math.min(100, 96.8 + (Math.random() - 0.5) * 1)),
      predictionLabel: "REAL",
      timestamp: new Date().toISOString(),
    };
  } else if (state.status === "SPOOF_DETECTED") {
    return {
      motionScore: Math.max(0, Math.min(15, 1.2 + (Math.random() - 0.5) * 0.5)), // no motion
      blurScore: Math.max(40, Math.min(70, 52 + (Math.random() - 0.5) * 8)),
      fingerMovement: 0,
      validFrames: 0,
      confidenceScore: Math.max(95, Math.min(100, 98.2 + (Math.random() - 0.5) * 1)),
      predictionLabel: "SPOOF",
      timestamp: new Date().toISOString(),
    };
  } else if (state.status === "PROCESSING") {
    return {
      motionScore: Math.max(50, Math.min(100, 75 + (Math.random() - 0.5) * 20)),
      blurScore: Math.max(70, Math.min(100, 82 + (Math.random() - 0.5) * 10)),
      fingerMovement: Math.max(30, Math.min(100, 55 + (Math.random() - 0.5) * 30)),
      validFrames: Math.min(30, state.metrics.validFrames + 3),
      confidenceScore: Math.max(40, Math.min(90, 65 + (Math.random() - 0.5) * 15)),
      predictionLabel: "ANALYZING",
      timestamp: new Date().toISOString(),
    };
  }

  // Waiting for hand
  return {
    motionScore: 0,
    blurScore: 0,
    fingerMovement: 0,
    validFrames: 0,
    confidenceScore: 0,
    predictionLabel: "WAITING",
    timestamp: new Date().toISOString(),
  };
}

// --- GET /logs ---
export async function getLogs(): Promise<LogEntry[]> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/logs`);
      return res.json();
    } catch (e) {
      // fallback
    }
  }
  return getSimulatedState().logs;
}

// --- GET /model-info ---
export async function getModelInfo(): Promise<ModelInfo> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/model-info`);
      return res.json();
    } catch (e) {
      // fallback
    }
  }
  return getSimulatedState().modelInfo;
}

// --- POST /save-template ---
export async function saveTemplate(label: string = "user1"): Promise<{ success: boolean; message: string }> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/save-template?label=${encodeURIComponent(label)}`, { method: "POST" });
      return res.json();
    } catch (e) {
      // fallback
    }
  }

  // Simulation
  await new Promise((r) => setTimeout(r, 1000));
  addSimulatedLog("success", "Template Saved", `Landmarks written to dataset.csv with label "${label}"`);
  setSimulatedState((prev) => ({
    ...prev,
    modelInfo: {
      ...prev.modelInfo,
      datasetSize: prev.modelInfo.datasetSize + 1,
    },
  }));
  return { success: true, message: `Template saved to dataset.csv with label "${label}"` };
}


// --- POST /train ---
export async function startTraining(): Promise<{ success: boolean; message: string; accuracy?: number }> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/train`, { method: "POST" });
      return res.json();
    } catch (e) {
      // fallback
    }
  }

  // Simulation
  await new Promise((r) => setTimeout(r, 3000));
  const newAccuracy = 96.3 + Math.random() * 2.2;
  addSimulatedLog("success", "Model Retrained", `hand_model.pkl accuracy: ${newAccuracy.toFixed(2)}%`);
  setSimulatedState((prev) => ({
    ...prev,
    modelInfo: {
      ...prev.modelInfo,
      accuracy: newAccuracy,
      lastTrained: new Date().toISOString(),
    },
  }));
  return {
    success: true,
    message: "Model retrained successfully",
    accuracy: newAccuracy,
  };
}

// --- POST /predict-frame ---
export async function predictFrame(imageBase64: string, label: string = "user1"): Promise<{
  success: boolean;
  hand_detected: boolean;
  prediction: string;
  confidence: number;
  blur_score: number;
  motion_score: number;
  finger_movement?: number;
  valid_frames?: number;
  error?: string;
}> {
  try {
    const res = await fetch(`${BASE_URL}/predict-frame`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64, label }),
    });
    return res.json();
  } catch (e: any) {
    return {
      success: false,
      hand_detected: false,
      prediction: "UNKNOWN",
      confidence: 0.0,
      blur_score: 0.0,
      motion_score: 0.0,
      finger_movement: 0.0,
      valid_frames: 0,
      error: e.message || "Failed to reach server",
    };
  }
}

// --- POST /predict ---

export async function predictUser(): Promise<{ prediction: string; confidence: number }> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/predict`, { method: "POST" });
      return res.json();
    } catch (e) {
      // fallback
    }
  }

  // Simulation
  await new Promise((r) => setTimeout(r, 800));
  const state = getSimulatedState();
  return {
    prediction: state.status === "REAL_USER_VERIFIED" ? "REAL" : "SPOOF",
    confidence: state.status === "REAL_USER_VERIFIED" ? 96.8 : 98.1,
  };
}

// --- POST /clear-dataset ---
export async function clearDataset(): Promise<{ success: boolean; message: string }> {
  const connected = isAlive;
  if (connected) {
    try {
      const res = await fetch(`${BASE_URL}/clear-dataset`, { method: "POST" });
      return res.json();
    } catch (e) {
      // fallback
    }
  }

  // Simulation
  await new Promise((r) => setTimeout(r, 600));
  addSimulatedLog("info", "Dataset Cleared", "All cached landmarks cleared");
  setSimulatedState((prev) => ({
    ...prev,
    modelInfo: {
      ...prev.modelInfo,
      datasetSize: 0,
    },
  }));
  return { success: true, message: "dataset.csv cleared successfully" };
}
