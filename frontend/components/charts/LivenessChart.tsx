"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface ChartProps {
  data: { time: string; value: number }[];
}

export default function LivenessChart({ data }: ChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="livenessGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#475569"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#475569"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(10, 15, 30, 0.9)",
              border: "1px solid rgba(0, 245, 255, 0.2)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
            labelClassName="text-cyan-400"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00f5ff"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#livenessGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
