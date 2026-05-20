"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#030712] text-white">
      {/* Ambient background */}
      <ParticleBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main
          className={cn(
            "flex-1 overflow-y-auto px-6 py-6 scrollbar-thin",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
