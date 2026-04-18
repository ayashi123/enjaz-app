"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PerformanceChart({
  data,
}: {
  data: Array<{ name: string; score: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f6c4d" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#1f6c4d" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8ece9" />
          <XAxis dataKey="name" tick={{ fill: "#61706a", fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fill: "#61706a", fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="score" stroke="#1f6c4d" strokeWidth={3} fill="url(#scoreFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
