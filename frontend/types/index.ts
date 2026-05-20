// TypeScript interfaces for EdgePrint AI dashboard

export type VerificationStatus = "REAL_USER_VERIFIED" | "SPOOF_DETECTED" | "WAITING_FOR_HAND" | "PROCESSING";

export interface MetricsData {
  motionScore: number;
  blurScore: number;
  fingerMovement: number;
  validFrames: number;
  confidenceScore: number;
  predictionLabel: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  type: "success" | "warning" | "error" | "info";
  event: string;
  detail: string;
  timestamp: string;
}

export interface ModelInfo {
  modelName: string;
  accuracy: number;
  datasetSize: number;
  lastTrained: string;
  activeModel: string;
  version: string;
  status: "ready" | "training" | "error";
}

export interface StatusResponse {
  status: VerificationStatus;
  isLive: boolean;
  sessionId: string;
  fps: number;
  uptime: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface LivenessChartData {
  liveness: ChartDataPoint[];
  motion: ChartDataPoint[];
  frameQuality: ChartDataPoint[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export interface ActionState {
  saveTemplate: "idle" | "loading" | "success" | "error";
  startTraining: "idle" | "loading" | "success" | "error";
  predictUser: "idle" | "loading" | "success" | "error";
  clearDataset: "idle" | "loading" | "success" | "error";
}
