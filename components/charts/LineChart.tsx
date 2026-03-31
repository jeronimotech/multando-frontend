"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface DataPoint {
  date: string;
  count: number;
}

interface ReportsLineChartProps {
  data: DataPoint[];
  height?: number;
}

export function ReportsLineChart({ data, height = 300 }: ReportsLineChartProps) {
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b5eef" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b5eef" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid, #e2e8f0)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            labelFormatter={(label) => formatDate(String(label))}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any) => [String(value), "Reports"]) as any}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3b5eef"
            strokeWidth={2}
            fill="url(#lineChartGradient)"
            dot={{ r: 4, fill: "white", stroke: "#3b5eef", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#3b5eef", stroke: "white", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
