"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthorityReports, useAuthorityAnalytics } from "@/hooks/use-authority";
import { cn, formatDate } from "@/lib/utils";
import { ReportStatus } from "@/types/report";
import { useTranslation } from "@/hooks/use-translation";

export default function AuthorityDashboardPage() {
  const { t } = useTranslation();

  const { data: reportsData, isLoading: reportsLoading } = useAuthorityReports({
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useAuthorityAnalytics({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  const metrics = [
    {
      title: t('authority.total_reports'),
      value: analyticsData?.totalReports ?? 0,
      change: "+12%",
      changeType: "positive" as const,
      icon: DocumentIcon,
    },
    {
      title: t('authority.pending_review'),
      value: analyticsData?.pendingReports ?? 0,
      change: "-5%",
      changeType: "negative" as const,
      icon: ClockIcon,
    },
    {
      title: t('authority.verified_count'),
      value: analyticsData?.verifiedReports ?? 0,
      change: "+8%",
      changeType: "positive" as const,
      icon: CheckIcon,
    },
    {
      title: t('authority.todays_reports'),
      value: analyticsData?.todayReports ?? 0,
      change: "+3",
      changeType: "neutral" as const,
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t('authority.dashboard')}
          </h1>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t('authority.overview')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/authority/reports">
            <Button variant="outline">{t('authority.view_all')}</Button>
          </Link>
          <Button variant="primary" onClick={() => handleExport()}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            {t('authority.download_report')}
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600 dark:text-surface-400">
                    {metric.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-surface-900 dark:text-white">
                    {reportsLoading || analyticsLoading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      metric.value.toLocaleString()
                    )}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      metric.changeType === "positive" && "text-success-600",
                      metric.changeType === "negative" && "text-danger-600",
                      metric.changeType === "neutral" && "text-surface-600"
                    )}
                  >
                    {metric.change} {t('authority.from_last_week')}
                  </p>
                </div>
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
                  <metric.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Reports Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mini Chart - Reports Over Last 7 Days */}
        <Card>
          <CardHeader>
            <CardTitle>{t('authority.reports_last_7_days')}</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : (
              <MiniChart data={analyticsData?.dailyReports || []} />
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('authority.status_distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : (
              <StatusDistribution data={analyticsData?.statusDistribution || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('authority.recent_reports')}</CardTitle>
          <Link href="/authority/reports">
            <Button variant="ghost" size="sm">
              {t('authority.view_all_short')}
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="pb-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                      {t('authority.id')}
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                      {t('authority.plate')}
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                      {t('authority.infraction')}
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                      {t('authority.status')}
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                      {t('authority.date')}
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-surface-500 dark:text-surface-400">
                      {t('authority.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  {reportsData?.data.slice(0, 10).map((report) => (
                    <tr key={report.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="py-3 text-sm font-medium text-surface-900 dark:text-white">
                        {report.shortId}
                      </td>
                      <td className="py-3 text-sm text-surface-600 dark:text-surface-300">
                        {report.vehiclePlate}
                      </td>
                      <td className="py-3 text-sm text-surface-600 dark:text-surface-300">
                        {report.infraction}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="py-3 text-sm text-surface-600 dark:text-surface-300">
                        {formatDate(report.createdAt, { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3">
                        <Link href={`/authority/reports/${report.id}`}>
                          <Button variant="ghost" size="sm">
                            {t('common.view')}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function handleExport() {
  // TODO: Implement export functionality
  console.log("Exporting report...");
}

// Status Badge Component
function StatusBadge({ status }: { status: ReportStatus }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    verified: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400",
    rejected: "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

// Mini Chart Component (Simple bar visualization)
function MiniChart({ data }: { data: { date: string; count: number }[] }) {
  const { t } = useTranslation();
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-surface-500">
        {t('authority.no_data')}
      </div>
    );
  }

  return (
    <div className="flex h-48 items-end justify-between gap-2">
      {data.map((day, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t bg-indigo-500 transition-all hover:bg-indigo-600"
            style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: "4px" }}
            title={`${day.count} reports`}
          />
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
          </span>
        </div>
      ))}
    </div>
  );
}

// Status Distribution Component (Simple horizontal bars)
function StatusDistribution({
  data,
}: {
  data: { status: string; count: number; percentage: number }[];
}) {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    verified: "bg-success-500",
    rejected: "bg-danger-500",
  };

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-surface-500">
        {t('authority.no_data')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.status}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium capitalize text-surface-700 dark:text-surface-300">
              {item.status}
            </span>
            <span className="text-surface-500 dark:text-surface-400">
              {item.count} ({item.percentage}%)
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
            <div
              className={cn("h-full rounded-full transition-all", colors[item.status] || "bg-surface-500")}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Icon Components
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
