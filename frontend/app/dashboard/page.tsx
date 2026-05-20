"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LiveCameraFeed from "@/components/dashboard/LiveCameraFeed";
import VerificationStatusCard from "@/components/dashboard/VerificationStatus";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import AntiSpoofPanel from "@/components/dashboard/AntiSpoofPanel";
import DatasetSection from "@/components/dashboard/DatasetSection";
import LogsSection from "@/components/dashboard/LogsSection";
import ModelInfoCard from "@/components/dashboard/ModelInfoCard";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome / Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between gap-4 rounded-xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-transparent p-5 backdrop-blur-md sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.15)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide text-white">EdgePrint AI Control Panel</h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Liveness analysis engine actively monitoring. Place hand in viewport to verify identity.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#1a2744] bg-[#07090f]/80 px-3 py-2 text-xs font-mono">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-gray-500">Security Mode:</span>
            <span className="font-bold text-emerald-400">ACTIVE PROTECTION</span>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Camera Feed & Status (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Live Camera Feed Card */}
            <LiveCameraFeed />

            {/* Metrics cards grid */}
            <MetricsGrid />
          </div>

          {/* Right Column: Verification Status & Analytics (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* AI Verification Status Card */}
            <VerificationStatusCard />

            {/* AI Model Information Card */}
            <ModelInfoCard />

            {/* Dataset Section */}
            <DatasetSection />
          </div>
        </div>

        {/* Bottom analytics row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Charts (7 cols) */}
          <div className="lg:col-span-7">
            <AntiSpoofPanel />
          </div>

          {/* Logs (5 cols) */}
          <div className="lg:col-span-5">
            <LogsSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
