"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthorityAnalytics, useAuthorityHeatmap } from "@/hooks/use-authority";
import { cn } from "@/lib/utils";
import { ReportsLineChart } from "@/components/charts/LineChart";
import { StatusPieChart } from "@/components/charts/PieChart";
import { InfractionsBarChart } from "@/components/charts/BarChart";
import { TimeOfDayHeatmap } from "@/components/charts/TimeHeatmap";
import { useTranslation } from "@/hooks/use-translation";

// Dynamically import the map component to avoid SSR issues
const LocationHeatmap = dynamic(
  () => import("@/components/charts/Heatmap").then((mod) => mod.LocationHeatmap),
  { ssr: false, loading: () => <MapLoadingPlaceholder /> }
);

const DATE_RANGE_OPTIONS = [
  { value: "7d", labelKey: "7d" },
  { value: "14d", labelKey: "14d" },
  { value: "30d", labelKey: "30d" },
  { value: "90d", labelKey: "90d" },
  { value: "custom", labelKey: "custom" },
];

const DATE_RANGE_LABELS: Record<string, string> = {
  "7d": "Last 7 days",
  "14d": "Last 14 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "custom": "Custom",
};

export default function AuthorityAnalyticsPage() {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState("30d");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const dateRangeParams = useMemo(() => {
    const now = new Date();
    let startDate: string;
    let endDate: string = now.toISOString();

    if (dateRange === "custom" && customStartDate && customEndDate) {
      startDate = new Date(customStartDate).toISOString();
      endDate = new Date(customEndDate).toISOString();
    } else {
      const days = parseInt(dateRange) || 30;
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    }

    return { startDate, endDate };
  }, [dateRange, customStartDate, customEndDate]);

  const { data: analyticsData, isLoading: analyticsLoading } =
    useAuthorityAnalytics(dateRangeParams);

  const { data: heatmapData, isLoading: heatmapLoading } =
    useAuthorityHeatmap(dateRangeParams);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t('authority.analytics')}
          </h1>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t('authority.detailed_insights')}
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {DATE_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  dateRange === option.value
                    ? "bg-indigo-600 text-white"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
                )}
              >
                {DATE_RANGE_LABELS[option.value]}
              </button>
            ))}
          </div>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-800"
              />
              <span className="text-surface-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title={t('authority.total_reports')}
          value={analyticsData?.totalReports ?? 0}
          loading={analyticsLoading}
        />
        <StatCard
          title={t('authority.avg_daily')}
          value={analyticsData?.averageDaily ?? 0}
          loading={analyticsLoading}
          suffix="/day"
        />
        <StatCard
          title={t('authority.verification_rate')}
          value={analyticsData?.verificationRate ?? 0}
          loading={analyticsLoading}
          suffix="%"
        />
        <StatCard
          title={t('authority.peak_hour')}
          value={analyticsData?.peakHour ?? "N/A"}
          loading={analyticsLoading}
          isText
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reports Over Time - Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('authority.reports_over_time')}</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <ChartLoadingPlaceholder height={300} />
            ) : (
              <ReportsLineChart data={analyticsData?.dailyReports || []} />
            )}
          </CardContent>
        </Card>

        {/* Status Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('authority.reports_by_status')}</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <ChartLoadingPlaceholder height={300} />
            ) : (
              <StatusPieChart data={analyticsData?.statusDistribution || []} />
            )}
          </CardContent>
        </Card>

        {/* Top Infractions - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('authority.top_infractions')}</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <ChartLoadingPlaceholder height={300} />
            ) : (
              <InfractionsBarChart data={analyticsData?.topInfractions || []} />
            )}
          </CardContent>
        </Card>

        {/* Location Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('authority.report_locations')}</CardTitle>
          </CardHeader>
          <CardContent>
            {heatmapLoading ? (
              <ChartLoadingPlaceholder height={400} />
            ) : (
              <div className="h-[400px] w-full overflow-hidden rounded-lg">
                <LocationHeatmap data={heatmapData?.locations || []} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time of Day Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('authority.reports_by_time')}</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <ChartLoadingPlaceholder height={200} />
            ) : (
              <TimeOfDayHeatmap data={analyticsData?.hourlyDistribution || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-medium text-surface-900 dark:text-white">
              {t('authority.export_analytics')}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {t('authority.export_analytics_desc')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              {t('authority.export_pdf')}
            </Button>
            <Button variant="primary">
              <DownloadIcon className="mr-2 h-4 w-4" />
              {t('authority.export_csv')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  loading,
  suffix,
  isText,
}: {
  title: string;
  value: number | string;
  loading: boolean;
  suffix?: string;
  isText?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-surface-600 dark:text-surface-400">{title}</p>
        <p className="mt-1 text-3xl font-bold text-surface-900 dark:text-white">
          {loading ? (
            <span className="animate-pulse">--</span>
          ) : isText ? (
            value
          ) : (
            <>
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix && (
                <span className="text-lg font-normal text-surface-500">{suffix}</span>
              )}
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

// Loading Placeholders
function ChartLoadingPlaceholder({ height }: { height: number }) {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800"
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-surface-500">{t('authority.loading_chart')}</p>
      </div>
    </div>
  );
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-[400px] items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-surface-500">Loading map...</p>
      </div>
    </div>
  );
}

// Icon Components
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}
