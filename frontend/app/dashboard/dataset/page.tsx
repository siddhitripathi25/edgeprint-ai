"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import DatasetSection from "@/components/dashboard/DatasetSection";
import ModelInfoCard from "@/components/dashboard/ModelInfoCard";
import { Database, Download, FileSpreadsheet, Plus, RefreshCw, Trash } from "lucide-react";
import { getSimulatedState } from "@/lib/mock-data";

interface CSVRow {
  index: number;
  thumb_x: number;
  thumb_y: number;
  index_x: number;
  index_y: number;
  label: string;
}

export default function DatasetPage() {
  const [datasetSize, setDatasetSize] = useState(1420);
  const [rows, setRows] = useState<CSVRow[]>([]);

  // Sync state
  useEffect(() => {
    const handleStateChange = () => {
      const state = getSimulatedState();
      setDatasetSize(state.modelInfo.datasetSize);
      
      // Generate some mock vectors
      const count = state.modelInfo.datasetSize > 0 ? 5 : 0;
      const mockRows: CSVRow[] = Array.from({ length: count }, (_, i) => ({
        index: i + 1,
        thumb_x: parseFloat((Math.random() - 0.5).toFixed(4)),
        thumb_y: parseFloat((Math.random() - 0.5).toFixed(4)),
        index_x: parseFloat((Math.random() - 0.5).toFixed(4)),
        index_y: parseFloat((Math.random() - 0.5).toFixed(4)),
        label: Math.random() > 0.3 ? "REAL" : "SPOOF",
      }));
      setRows(mockRows);
    };

    handleStateChange();
    window.addEventListener("edgeprint_state_change", handleStateChange);
    return () => window.removeEventListener("edgeprint_state_change", handleStateChange);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">Dataset Manager</h2>
          <p className="text-xs text-gray-500">Manage hand landmark training vectors stored in dataset.csv</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-4">
            <DatasetSection />
            <ModelInfoCard />
          </div>

          {/* Table display */}
          <div className="lg:col-span-8">
            <GlowCard glowColor="cyan" className="p-4 flex flex-col h-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">dataset.csv Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-500">
                    Total: {datasetSize} rows
                  </span>
                  <button className="flex h-7 px-2.5 items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/5 font-mono text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/10">
                    <Download className="h-3 w-3" />
                    EXPORT
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-x-auto rounded-lg border border-[#1a2744] bg-[#07090f]">
                {rows.length > 0 ? (
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="border-b border-[#1a2744] bg-[#0d1526]/50 text-gray-500">
                      <tr>
                        <th className="p-2.5">Row</th>
                        <th className="p-2.5">Thumb dx</th>
                        <th className="p-2.5">Thumb dy</th>
                        <th className="p-2.5">Index dx</th>
                        <th className="p-2.5">Index dy</th>
                        <th className="p-2.5">Class</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a2744] text-gray-400">
                      {rows.map((row) => (
                        <tr key={row.index} className="hover:bg-white/2">
                          <td className="p-2.5 text-gray-500">{row.index}</td>
                          <td className="p-2.5">{row.thumb_x}</td>
                          <td className="p-2.5">{row.thumb_y}</td>
                          <td className="p-2.5">{row.index_x}</td>
                          <td className="p-2.5">{row.index_y}</td>
                          <td className="p-2.5">
                            <span className={`rounded-sm px-1 text-[10px] font-bold ${
                              row.label === "REAL" 
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}>
                              {row.label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <Database className="h-10 w-10 text-gray-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Dataset Empty</p>
                      <p className="mt-1 text-xs text-gray-600">Save template templates above to populate dataset</p>
                    </div>
                  </div>
                )}
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
