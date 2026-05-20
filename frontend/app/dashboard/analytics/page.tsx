"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AntiSpoofPanel from "@/components/dashboard/AntiSpoofPanel";
import MetricsGrid from "@/components/dashboard/MetricsGrid";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">Anti-Spoof Analytics Reports</h2>
          <p className="text-xs text-gray-500">Detailed computer vision signal variance, motion patterns, and liveness accuracy trends</p>
        </div>

        <MetricsGrid />
        <AntiSpoofPanel />
      </div>
    </DashboardLayout>
  );
}
