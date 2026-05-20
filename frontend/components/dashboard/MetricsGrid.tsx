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
    // Initial fetch
    getMetrics().then(setMetrics).catch(console.error);

    // Poll every 2 seconds for live feel
    const interval = setInterval(() => {
      getMetrics().then(setMetrics).catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: "Motion Score",
      value: metrics.motionScore.toFixed(1),
      unit: "%",
      icon: Activity,
      progress: metrics.motionScore,
      trend: metrics.motionScore > 80 ? "up" : "down",
      trendValue: `${metrics.motionScore > 80 ? "+" : ""}${(metrics.motionScore - 80).toFixed(1)}%`,
      color: "cyan",
      description: "Frame differencing velocity",
      index: 0,
    },
    {
      label: "Blur Score",
      value: metrics.blurScore.toFixed(1),
      unit: "%",
      icon: Eye,
      progress: metrics.blurScore,
      trend: metrics.blurScore > 85 ? "up" : "neutral",
      trendValue: metrics.blurScore > 85 ? "High clarity" : "Low clarity",
      color: "blue",
      description: "Laplacian variance · ROI sharpness",
      index: 1,
    },
    {
      label: "Finger Movement",
      value: metrics.fingerMovement.toFixed(1),
      unit: "%",
      icon: Hand,
      progress: metrics.fingerMovement,
      trend: metrics.fingerMovement > 65 ? "up" : "down",
      trendValue: "5-finger tracked",
      color: "purple",
      description: "Multi-fingertip landmark delta",
      index: 2,
    },
    {
      label: "Valid Frames",
      value: metrics.validFrames,
      unit: "frames",
      icon: CheckSquare,
      progress: Math.min((metrics.validFrames / 300) * 100, 100),
      trend: "up",
      trendValue: `${((metrics.validFrames / 300) * 100).toFixed(0)}%`,
      color: "green",
      description: "Quality-passed frame count",
      index: 3,
    },
    {
      label: "Confidence Score",
      value: metrics.confidenceScore.toFixed(1),
      unit: "%",
      icon: Target,
      progress: metrics.confidenceScore,
      trend: metrics.confidenceScore > 90 ? "up" : "neutral",
      trendValue: metrics.confidenceScore > 90 ? "High conf." : "Medium",
      color: "amber",
      description: "Model prediction probability",
      index: 4,
    },
    {
      label: "Prediction Label",
      value: metrics.predictionLabel,
      icon: Tag,
      trend: metrics.predictionLabel === "REAL" ? "up" : "down",
      trendValue: metrics.predictionLabel === "REAL" ? "Authentic" : "Attack",
      color: metrics.predictionLabel === "REAL" ? "green" : "red",
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
