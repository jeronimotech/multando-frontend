"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface HourlyData {
  hour: number;
  day: number;
  count: number;
}

interface TimeOfDayHeatmapProps {
  data: HourlyData[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function TimeOfDayHeatmap({ data }: TimeOfDayHeatmapProps) {
  const heatmapData = useMemo(() => {
    if (data.length === 0) return null;

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    // Create a map for quick lookup
    const dataMap = new Map<string, number>();
    data.forEach((d) => {
      dataMap.set(`${d.day}-${d.hour}`, d.count);
    });

    // Generate grid data
    const grid: { day: number; hour: number; count: number; intensity: number }[][] = [];
    for (let day = 0; day < 7; day++) {
      const row: { day: number; hour: number; count: number; intensity: number }[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const count = dataMap.get(`${day}-${hour}`) || 0;
        row.push({
          day,
          hour,
          count,
          intensity: count / maxCount,
        });
      }
      grid.push(row);
    }

    return { grid, maxCount };
  }, [data]);

  if (!heatmapData || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-surface-50 dark:bg-surface-900">
        <p className="text-surface-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Hour labels */}
      <div className="ml-10 flex">
        {HOURS.filter((h) => h % 3 === 0).map((hour) => (
          <div
            key={hour}
            className="flex-1 text-center text-xs text-surface-500 dark:text-surface-400"
            style={{ width: `${100 / 8}%` }}
          >
            {hour === 0 ? "12am" : hour === 12 ? "12pm" : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex">
        {/* Day labels */}
        <div className="flex w-10 flex-col justify-around">
          {DAYS.map((day) => (
            <span key={day} className="text-xs text-surface-500 dark:text-surface-400">
              {day}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          {heatmapData.grid.map((row, dayIndex) => (
            <div key={dayIndex} className="flex gap-0.5">
              {row.map((cell, hourIndex) => (
                <div
                  key={hourIndex}
                  className="aspect-[2/1] flex-1 rounded-sm transition-colors"
                  style={{
                    backgroundColor: getHeatmapColor(cell.intensity),
                  }}
                  title={`${DAYS[cell.day]} ${formatHour(cell.hour)}: ${cell.count} reports`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-xs text-surface-500 dark:text-surface-400">Less</span>
        <div className="flex gap-0.5">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
            <div
              key={intensity}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: getHeatmapColor(intensity) }}
            />
          ))}
        </div>
        <span className="text-xs text-surface-500 dark:text-surface-400">More</span>
      </div>
    </div>
  );
}

function getHeatmapColor(intensity: number): string {
  // Gradient from light gray to indigo
  if (intensity === 0) return "rgb(241, 245, 249)"; // surface-100
  if (intensity < 0.25) return "rgb(199, 210, 254)"; // indigo-200
  if (intensity < 0.5) return "rgb(165, 180, 252)"; // indigo-300
  if (intensity < 0.75) return "rgb(129, 140, 248)"; // indigo-400
  return "rgb(99, 102, 241)"; // indigo-500
}

function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
}
