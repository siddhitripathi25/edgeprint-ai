"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface ChartProps {
  data: { time: string; value: number }[];
}

export default function MotionTrendChart({ data }: ChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              border: "1px solid rgba(77, 159, 255, 0.2)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
            labelClassName="text-blue-400"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4d9fff"
            strokeWidth={2}
            dot={{ r: 2, fill: "#4d9fff", strokeWidth: 0 }}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
