"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SystemChart({ data, color }: any) {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" tick={{ fontSize: 12 }} />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{
              value: "Usage %",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
