"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface InfractionData {
  infraction: string;
  count: number;
}

interface InfractionsBarChartProps {
  data: InfractionData[];
  height?: number;
  maxBars?: number;
}

const BAR_COLORS = [
  "#3b5eef", // brand-500
  "#8e5eef", // purple
  "#5b80f5", // brand-400
  "#10b981", // success-500
  "#06b6d4", // cyan
  "#14b8a6", // teal
  "#f59e0b", // accent-500
  "#f97316", // orange
];

export function InfractionsBarChart({
  data,
  height = 300,
  maxBars = 8,
}: InfractionsBarChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;
    return [...data]
      .sort((a, b) => b.count - a.count)
      .slice(0, maxBars);
  }, [data, maxBars]);

  if (!chartData || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-surface-50 dark:bg-surface-900"
        style={{ height }}
      >
        <p className="text-surface-500">No data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid, #e2e8f0)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="infraction"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any) => [String(value), "Reports"]) as any}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Horizontal bar variant (vertical bars)
interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export function HorizontalBarChart({ data, height = 300 }: HorizontalBarChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-surface-50 dark:bg-surface-900"
        style={{ height }}
      >
        <p className="text-surface-500">No data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid, #e2e8f0)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any) => [String(value), "Count"]) as any}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
