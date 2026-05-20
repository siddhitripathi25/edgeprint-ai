"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LiveCameraFeed from "@/components/dashboard/LiveCameraFeed";
import VerificationStatusCard from "@/components/dashboard/VerificationStatus";
import LogsSection from "@/components/dashboard/LogsSection";

export default function LivePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">Live Liveness Verification</h2>
          <p className="text-xs text-gray-500">Monitor and trigger anti-spoof checks on active camera feeds</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main camera viewport */}
          <div className="lg:col-span-8">
            <LiveCameraFeed />
          </div>

          {/* Verification status and mini log feed */}
          <div className="space-y-6 lg:col-span-4">
            <VerificationStatusCard />
            <LogsSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
