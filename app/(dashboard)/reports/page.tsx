"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Mock data for reports
const reports = [
  {
    id: "1",
    type: "Illegal Parking",
    location: "123 Main St, City",
    date: "2024-01-15",
    status: "pending",
    reward: null,
  },
  {
    id: "2",
    type: "Running Red Light",
    location: "456 Oak Ave, City",
    date: "2024-01-14",
    status: "verified",
    reward: 25.0,
  },
  {
    id: "3",
    type: "Speeding",
    location: "789 Pine Rd, City",
    date: "2024-01-13",
    status: "rejected",
    reward: null,
  },
  {
    id: "4",
    type: "Double Parking",
    location: "321 Elm St, City",
    date: "2024-01-12",
    status: "paid",
    reward: 15.0,
  },
];

const statusColors = {
  pending: "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400",
  verified: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400",
  rejected: "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400",
  paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

function ReportsContent() {
  const searchParams = useSearchParams();
  const justSubmitted = searchParams.get("submitted") === "true";
  const { t, tParams } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Success message after submitting a report */}
      {justSubmitted && (
        <div className="flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-900 dark:bg-success-900/20">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success-600 dark:text-success-400" />
          <div>
            <h3 className="font-medium text-success-900 dark:text-success-100">
              {t('reports_page.report_submitted')}
            </h3>
            <p className="mt-1 text-sm text-success-700 dark:text-success-300">
              {t('reports_page.report_submitted_desc')}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t('reports.my_reports')}
          </h1>
          <p className="mt-1 text-surface-600 dark:text-surface-300">
            {t('reports.subtitle')}
          </p>
        </div>
        <Link href="/reports/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('reports.new_report')}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.total_reports')}
          </p>
          <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">
            24
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.pending')}
          </p>
          <p className="mt-2 text-3xl font-bold text-warning-600">5</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.verified')}
          </p>
          <p className="mt-2 text-3xl font-bold text-success-600">15</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.total_rewards')}
          </p>
          <p className="mt-2 text-3xl font-bold text-brand-500">$320</p>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-surface-600 dark:text-surface-300">
                  {t('reports.type')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-surface-600 dark:text-surface-300">
                  {t('reports.location')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-surface-600 dark:text-surface-300">
                  {t('reports.date')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-surface-600 dark:text-surface-300">
                  {t('reports.status')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-surface-600 dark:text-surface-300">
                  {t('reports.reward')}
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-surface-600 dark:text-surface-300">
                  {t('reports.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-surface-50 dark:hover:bg-surface-800/50"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-surface-900 dark:text-white">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                    {report.location}
                  </td>
                  <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                    {report.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        statusColors[report.status as keyof typeof statusColors]
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                    {report.reward ? `$${report.reward.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/reports/${report.id}`}
                      className="text-sm font-medium text-brand-500 hover:text-brand-700"
                    >
                      {t('common.view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-surface-200 px-6 py-4 dark:border-surface-700">
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {tParams('reports_page.showing_results', { from: '1', to: '4', total: '24' })}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              {t('common.previous')}
            </Button>
            <Button variant="outline" size="sm">
              {t('common.next')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div className="animate-pulse">{t('common.loading')}</div>}>
      <ReportsContent />
    </Suspense>
  );
}

function PlusIcon({ className }: { className?: string }) {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
