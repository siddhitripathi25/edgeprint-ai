"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LogsSection from "@/components/dashboard/LogsSection";

export default function LogsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">System Log Stream</h2>
          <p className="text-xs text-gray-500">Inspect full anti-spoof event trail and landmark verification callbacks</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <LogsSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
