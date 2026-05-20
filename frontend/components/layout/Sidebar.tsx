"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  BarChart3,
  Database,
  BrainCircuit,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-cyan-400",
  },
  {
    id: "live-verification",
    label: "Live Verification",
    icon: Camera,
    href: "/dashboard/live",
    color: "text-blue-400",
    badge: "LIVE",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-purple-400",
  },
  {
    id: "dataset",
    label: "Dataset Manager",
    icon: Database,
    href: "/dashboard/dataset",
    color: "text-emerald-400",
  },
  {
    id: "training",
    label: "Model Training",
    icon: BrainCircuit,
    href: "/dashboard/training",
    color: "text-amber-400",
  },
  {
    id: "logs",
    label: "System Logs",
    icon: ScrollText,
    href: "/dashboard/logs",
    color: "text-rose-400",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-400",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex h-screen flex-col border-r border-[#1a2744] bg-[#07090f]/95 backdrop-blur-xl"
      style={{ minWidth: collapsed ? 72 : 240 }}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between border-b border-[#1a2744] px-4">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(0,245,255,0.4)]">
                <Fingerprint className="h-4 w-4 text-white" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/20 to-transparent" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-white">EdgePrint AI</p>
                <p className="text-[10px] font-medium tracking-widest text-cyan-500/70">ANTI-SPOOF ENGINE</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(0,245,255,0.4)]"
            >
              <Fingerprint className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#1a2744] bg-[#0a0f1e] text-gray-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* System status pill */}
      {!collapsed && (
        <div className="mx-3 mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium tracking-wider text-emerald-400">SYSTEM ONLINE</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-2">
        {!collapsed && (
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link key={item.id} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(0,245,255,0.15)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,245,255,0.8)]"
                  />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    isActive ? "text-cyan-400" : `group-hover:${item.color}`
                  )}
                />

                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!collapsed && item.badge && (
                  <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-red-400 border border-red-500/20">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded-md border border-[#1a2744] bg-[#0a0f1e] px-2 py-1 text-xs text-gray-200 shadow-xl group-hover:block">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1a2744] p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-200">EdgePrint AI</p>
              <p className="text-[10px] text-gray-500">v2.4.1 · hand_model.pkl</p>
            </div>
            <Zap className="ml-auto h-3.5 w-3.5 text-cyan-500" />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
