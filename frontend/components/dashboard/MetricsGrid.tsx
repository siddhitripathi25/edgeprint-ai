"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Eye,
  Hand,
  CheckSquare,
  Target,
  Tag,
} from "lucide-react";
import MetricCard from "./MetricCard";
import { getMetrics } from "@/lib/api";
import type { MetricsData } from "@/types";
import { mockMetrics } from "@/lib/mock-data";

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState<MetricsData>(mockMetrics);

  useEffect(() => {
    const handleStateChange = () => {
      getMetrics().then(setMetrics).catch(console.error);
    };

    handleStateChange();
    window.addEventListener("edgeprint_state_change", handleStateChange);

    const interval = setInterval(handleStateChange, 2000);

    return () => {
      window.removeEventListener("edgeprint_state_change", handleStateChange);
      clearInterval(interval);
    };
  }, []);

  const isHandPlaced = metrics.predictionLabel !== "WAITING";

  const cards = [
    {
      label: "Motion Score",
      value: isHandPlaced ? metrics.motionScore.toFixed(1) : "--",
      unit: isHandPlaced ? "%" : undefined,
      icon: Activity,
      progress: isHandPlaced ? metrics.motionScore : 0,
      trend: isHandPlaced ? (metrics.motionScore > 80 ? "up" : "down") : "neutral",
      trendValue: isHandPlaced 
        ? `${metrics.motionScore > 80 ? "+" : ""}${(metrics.motionScore - 80).toFixed(1)}%` 
        : "Awaiting hand...",
      color: "cyan",
      description: "Frame differencing velocity",
      index: 0,
    },
    {
      label: "Blur Score",
      value: isHandPlaced ? metrics.blurScore.toFixed(1) : "--",
      unit: isHandPlaced ? "%" : undefined,
      icon: Eye,
      progress: isHandPlaced ? metrics.blurScore : 0,
      trend: isHandPlaced ? (metrics.blurScore > 85 ? "up" : "neutral") : "neutral",
      trendValue: isHandPlaced 
        ? (metrics.blurScore > 85 ? "High clarity" : "Low clarity") 
        : "Awaiting hand...",
      color: "blue",
      description: "Laplacian variance · ROI sharpness",
      index: 1,
    },
    {
      label: "Finger Movement",
      value: isHandPlaced ? metrics.fingerMovement.toFixed(1) : "--",
      unit: isHandPlaced ? "%" : undefined,
      icon: Hand,
      progress: isHandPlaced ? metrics.fingerMovement : 0,
      trend: isHandPlaced ? (metrics.fingerMovement > 65 ? "up" : "down") : "neutral",
      trendValue: isHandPlaced ? "Tracking fingers" : "Awaiting hand...",
      color: "purple",
      description: "Multi-fingertip landmark delta",
      index: 2,
    },
    {
      label: "Valid Frames",
      value: isHandPlaced ? metrics.validFrames : "--",
      unit: isHandPlaced ? "frames" : undefined,
      icon: CheckSquare,
      progress: isHandPlaced ? Math.min((metrics.validFrames / 30) * 100, 100) : 0,
      trend: isHandPlaced ? "up" : "neutral",
      trendValue: isHandPlaced ? `${((metrics.validFrames / 30) * 100).toFixed(0)}%` : "Awaiting hand...",
      color: "green",
      description: "Quality-passed frame count",
      index: 3,
    },
    {
      label: "Confidence Score",
      value: isHandPlaced ? metrics.confidenceScore.toFixed(1) : "--",
      unit: isHandPlaced ? "%" : undefined,
      icon: Target,
      progress: isHandPlaced ? metrics.confidenceScore : 0,
      trend: isHandPlaced ? (metrics.confidenceScore > 90 ? "up" : "neutral") : "neutral",
      trendValue: isHandPlaced ? (metrics.confidenceScore > 90 ? "High conf." : "Medium") : "Awaiting hand...",
      color: "amber",
      description: "Model prediction probability",
      index: 4,
    },
    {
      label: "Prediction Label",
      value: metrics.predictionLabel,
      icon: Tag,
      trend: isHandPlaced ? (metrics.predictionLabel === "REAL" ? "up" : "neutral") : "neutral",
      trendValue: isHandPlaced 
        ? (metrics.predictionLabel === "REAL" ? "Authentic" : "Analyzing/Attack") 
        : "Place hand in camera feed",
      color: isHandPlaced 
        ? (metrics.predictionLabel === "REAL" ? "green" : "red") 
        : "cyan",
      description: "hand_model.pkl classification",
      index: 5,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {cards.map((card, i) => (
        <MetricCard key={card.label} {...card} index={i} />
      ))}
    </div>
  );
}
