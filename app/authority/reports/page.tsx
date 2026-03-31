"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthorityReports, useExportReports } from "@/hooks/use-authority";
import { cn, formatDate } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import type { ReportStatus, ReportFilters, ReportSummary } from "@/types/report";

const STATUS_OPTIONS: { value: ReportStatus | "all"; labelKey: string }[] = [
  { value: "all", labelKey: "all" },
  { value: "pending", labelKey: "pending" },
  { value: "verified", labelKey: "verified" },
  { value: "rejected", labelKey: "rejected" },
];

const INFRACTION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "illegal-parking", label: "Illegal Parking" },
  { value: "speeding", label: "Speeding" },
  { value: "red-light", label: "Running Red Light" },
  { value: "double-parking", label: "Double Parking" },
  { value: "no-seatbelt", label: "No Seat Belt" },
  { value: "phone-driving", label: "Phone While Driving" },
];

const SORT_OPTIONS_KEYS = [
  { value: "createdAt", labelKey: "authority.date" },
  { value: "status", labelKey: "authority.status" },
  { value: "infraction", labelKey: "authority.infraction_type" },
];

export default function AuthorityReportsPage() {
  const { t, tParams } = useTranslation();

  const [filters, setFilters] = useState<ReportFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedReport, setSelectedReport] = useState<ReportSummary | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reportsData, isLoading, isFetching } = useAuthorityReports(filters);
  const exportMutation = useExportReports();

  const handleFilterChange = useCallback(
    (key: keyof ReportFilters, value: string | number | undefined) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value === "all" ? undefined : value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search by plate or ID
    setFilters((prev) => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
  }, [searchTerm]);

  const handleExport = useCallback(async () => {
    try {
      await exportMutation.mutateAsync(filters);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [exportMutation, filters]);

  const handleViewDetails = useCallback((report: ReportSummary) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedReport(null);
  }, []);

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar */}
      <Card className="h-fit w-72 shrink-0">
        <CardHeader>
          <CardTitle className="text-lg">{t('authority.filters')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('authority.status')}
            </label>
            <select
              value={(filters.status as string) || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "all" ? t('authority.filters') : t(`reports.${option.labelKey}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Infraction Type Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('authority.infraction_type')}
            </label>
            <select
              value={(filters.infractionCode as string) || "all"}
              onChange={(e) => handleFilterChange("infractionCode", e.target.value)}
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            >
              {INFRACTION_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('authority.from_date')}
            </label>
            <input
              type="date"
              value={filters.fromDate?.split("T")[0] || ""}
              onChange={(e) =>
                handleFilterChange(
                  "fromDate",
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('authority.to_date')}
            </label>
            <input
              type="date"
              value={filters.toDate?.split("T")[0] || ""}
              onChange={(e) =>
                handleFilterChange(
                  "toDate",
                  e.target.value ? new Date(e.target.value).toISOString() : undefined
                )
              }
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('authority.sort_by')}
            </label>
            <select
              value={filters.sortBy || "createdAt"}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            >
              {SORT_OPTIONS_KEYS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('authority.order')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("sortOrder", "desc")}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  filters.sortOrder === "desc"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "border-surface-200 text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800"
                )}
              >
                {t('authority.newest')}
              </button>
              <button
                onClick={() => handleFilterChange("sortOrder", "asc")}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  filters.sortOrder === "asc"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "border-surface-200 text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800"
                )}
              >
                {t('authority.oldest')}
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              setFilters({
                page: 1,
                limit: 20,
                sortBy: "createdAt",
                sortOrder: "desc",
              })
            }
          >
            {t('authority.clear_filters')}
          </Button>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Header with Search and Export */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('authority.reports')}</h1>
            <p className="text-sm text-surface-600 dark:text-surface-300">
              {reportsData?.pagination.total ?? 0} {t('authority.total_reports_count')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder={t('authority.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button type="submit" variant="outline">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </form>

            {/* Export */}
            <Button
              variant="primary"
              onClick={handleExport}
              isLoading={exportMutation.isPending}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              {t('authority.export_csv')}
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/50">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.id')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.plate')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.vehicle')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.infraction')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.location')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.status')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.date')}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                          {t('authority.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                      {reportsData?.data.map((report) => (
                        <tr
                          key={report.id}
                          className="hover:bg-surface-50 dark:hover:bg-surface-800/50"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-surface-900 dark:text-white">
                            {report.shortId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-surface-600 dark:text-surface-300">
                            {report.vehiclePlate}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-surface-600 dark:text-surface-300">
                            {report.vehicleType}
                          </td>
                          <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-300">
                            {report.infraction}
                          </td>
                          <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-300">
                            {report.location.city || "Unknown"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-surface-600 dark:text-surface-300">
                            {formatDate(report.createdAt, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(report)}
                            >
                              <EyeIcon className="mr-1 h-4 w-4" />
                              {t('common.view')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {reportsData && (
                  <div className="flex items-center justify-between border-t border-surface-200 px-6 py-4 dark:border-surface-700">
                    <p className="text-sm text-surface-600 dark:text-surface-300">
                      {tParams('authority.showing_results', {
                        from: String((reportsData.pagination.page - 1) * reportsData.pagination.limit + 1),
                        to: String(Math.min(
                          reportsData.pagination.page * reportsData.pagination.limit,
                          reportsData.pagination.total
                        )),
                        total: String(reportsData.pagination.total),
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={reportsData.pagination.page === 1 || isFetching}
                        onClick={() => handleFilterChange("page", reportsData.pagination.page - 1)}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        {t('common.previous')}
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, reportsData.pagination.totalPages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handleFilterChange("page", pageNum)}
                                className={cn(
                                  "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                                  pageNum === reportsData.pagination.page
                                    ? "bg-indigo-600 text-white"
                                    : "text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                                )}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                        {reportsData.pagination.totalPages > 5 && (
                          <>
                            <span className="text-surface-500">...</span>
                            <button
                              onClick={() =>
                                handleFilterChange("page", reportsData.pagination.totalPages)
                              }
                              className="h-8 w-8 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                            >
                              {reportsData.pagination.totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!reportsData.pagination.hasMore || isFetching}
                        onClick={() => handleFilterChange("page", reportsData.pagination.page + 1)}
                      >
                        {t('common.next')}
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Detail Drawer */}
      {isDetailOpen && selectedReport && (
        <ReportDetailDrawer report={selectedReport} onClose={handleCloseDetail} />
      )}
    </div>
  );
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

// Report Detail Drawer Component
function ReportDetailDrawer({
  report,
  onClose,
}: {
  report: ReportSummary;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-white shadow-xl dark:bg-surface-800">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-surface-200 bg-white px-6 py-4 dark:border-surface-700 dark:bg-surface-800">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              {t('authority.report_details')}
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{report.shortId}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Status */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              {t('authority.status')}
            </h3>
            <StatusBadge status={report.status} />
          </div>

          {/* Evidence */}
          {report.thumbnailUrl && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-surface-500 dark:text-surface-400">
                {t('authority.evidence')}
              </h3>
              <img
                src={report.thumbnailUrl}
                alt="Evidence"
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Vehicle Information */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              {t('authority.vehicle_info')}
            </h3>
            <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{t('authority.plate')}</p>
                  <p className="font-mono font-medium text-surface-900 dark:text-white">
                    {report.vehiclePlate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{t('authority.type')}</p>
                  <p className="capitalize text-surface-900 dark:text-white">
                    {report.vehicleType}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Infraction */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              {t('authority.infraction')}
            </h3>
            <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
              <p className="font-medium text-surface-900 dark:text-white">{report.infraction}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {t('authority.code')}: {report.infractionCode}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              {t('authority.location')}
            </h3>
            <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
              <p className="text-surface-900 dark:text-white">
                {report.location.address || `${report.location.city}, ${report.location.state}`}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Date */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              {t('authority.reported_on')}
            </h3>
            <p className="text-surface-900 dark:text-white">
              {formatDate(report.createdAt, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {report.status === "pending" && (
              <>
                <Button variant="primary" className="flex-1">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  {t('authority.verify')}
                </Button>
                <Button variant="outline" className="flex-1">
                  <XIcon className="mr-2 h-4 w-4" />
                  {t('authority.reject')}
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Icon Components
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
