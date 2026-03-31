"use client";

import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

interface StatusPieChartProps {
  data: StatusData[];
  size?: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",   // warning-500
  verified: "#10b981",  // success-500
  rejected: "#ef4444",  // danger-500
};

const FALLBACK_COLOR = "#64748b"; // surface-500

export function StatusPieChart({ data, size = 300 }: StatusPieChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-surface-50 dark:bg-surface-900"
        style={{ height: size }}
      >
        <p className="text-surface-500">No data available</p>
      </div>
    );
  }

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const pct = Math.round((percent ?? 0) * 100);
    if (pct < 10) return null;
    const RADIAN = Math.PI / 180;
    const ir = Number(innerRadius);
    const or = Number(outerRadius);
    const cxn = Number(cx);
    const cyn = Number(cy);
    const ma = Number(midAngle);
    const radius = ir + (or - ir) * 0.55;
    const x = cxn + radius * Math.cos(-ma * RADIAN);
    const y = cyn + radius * Math.sin(-ma * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${pct}%`}
      </text>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <div className="flex flex-col gap-3">
        {data.map((item, i) => {
          const color = STATUS_COLORS[item.status] || FALLBACK_COLOR;
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-sm font-medium capitalize text-surface-900 dark:text-white">
                  {item.status}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {item.count.toLocaleString()} ({item.percentage}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="40%"
            cy="50%"
            innerRadius="40%"
            outerRadius="75%"
            paddingAngle={2}
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || FALLBACK_COLOR}
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any, name: any) => [
              String(value),
              String(name).charAt(0).toUpperCase() + String(name).slice(1),
            ]) as any}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            content={renderLegend}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
