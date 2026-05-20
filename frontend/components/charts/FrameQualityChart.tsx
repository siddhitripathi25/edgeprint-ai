"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface ChartProps {
  data: { time: string; value: number }[];
}

export default function FrameQualityChart({ data }: ChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              border: "1px solid rgba(168, 85, 247, 0.2)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
            labelClassName="text-purple-400"
          />
          <Bar
            dataKey="value"
            fill="#a855f7"
            radius={[4, 4, 0, 0]}
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
