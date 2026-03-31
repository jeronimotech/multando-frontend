"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DynamicReportMap } from "@/components/map/dynamic-map";
import { useReportMarkers } from "@/hooks/use-reports";
import { useTranslation } from "@/hooks/use-translation";
import {
  CheckCircle,
  Plus,
  Map,
  List,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for reports
const reports = [
  {
    id: "1",
    type: "Illegal Parking",
    location: "Calle 80 con Carrera 50, Bogotá",
    lat: 4.6837,
    lng: -74.0810,
    date: "2024-01-15",
    status: "pending",
    reward: null,
  },
  {
    id: "2",
    type: "Running Red Light",
    location: "Av. Boyacá con Calle 26, Bogotá",
    lat: 4.6486,
    lng: -74.1143,
    date: "2024-01-14",
    status: "verified",
    reward: 25.0,
  },
  {
    id: "3",
    type: "Speeding",
    location: "Autopista Norte Km 12, Bogotá",
    lat: 4.7565,
    lng: -74.0430,
    date: "2024-01-13",
    status: "rejected",
    reward: null,
  },
  {
    id: "4",
    type: "Double Parking",
    location: "Carrera 7 con Calle 72, Bogotá",
    lat: 4.6589,
    lng: -74.0558,
    date: "2024-01-12",
    status: "verified",
    reward: 15.0,
  },
];

const statusColors = {
  pending: "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400",
  verified: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400",
  rejected: "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400",
  paid: "bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400",
};

function ReportsContent() {
  const searchParams = useSearchParams();
  const justSubmitted = searchParams.get("submitted") === "true";
  const { t, tParams } = useTranslation();
  const [view, setView] = useState<"list" | "map">("list");
  const { data: markers = [] } = useReportMarkers();

  return (
    <div className="space-y-6">
      {/* Success message */}
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
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg bg-surface-100 p-1 dark:bg-surface-700">
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === "list"
                  ? "bg-white text-surface-900 shadow-sm dark:bg-surface-600 dark:text-white"
                  : "text-surface-500 hover:text-surface-700 dark:text-surface-400"
              )}
            >
              <List className="h-4 w-4" />
              {t('common.view')}
            </button>
            <button
              onClick={() => setView("map")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === "map"
                  ? "bg-white text-surface-900 shadow-sm dark:bg-surface-600 dark:text-white"
                  : "text-surface-500 hover:text-surface-700 dark:text-surface-400"
              )}
            >
              <Map className="h-4 w-4" />
              {t('reports.location')}
            </button>
          </div>

          <Link href="/reports/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              {t('reports.new_report')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.total_reports')}
          </p>
          <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">24</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.pending')}
          </p>
          <p className="mt-2 text-3xl font-bold text-warning-600">5</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.verified')}
          </p>
          <p className="mt-2 text-3xl font-bold text-success-600">15</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {t('reports.total_rewards')}
          </p>
          <p className="mt-2 text-3xl font-bold text-accent-500">320 MULTA</p>
        </Card>
      </div>

      {/* Map View */}
      {view === "map" && (
        <Card className="overflow-hidden">
          <div className="h-[500px]">
            <DynamicReportMap
              markers={markers.length > 0 ? markers : reports.map((r) => ({
                id: r.id,
                lat: r.lat,
                lng: r.lng,
                status: r.status as "pending" | "verified" | "rejected",
                infraction: r.type,
                plate: "",
                date: r.date,
              }))}
              center={[4.7110, -74.0721]}
              zoom={12}
              interactive={true}
              showCurrentLocation={true}
            />
          </div>
          {/* Map legend */}
          <div className="flex items-center gap-6 border-t border-surface-200 px-4 py-3 dark:border-surface-700">
            <span className="flex items-center gap-1.5 text-sm">
              <span className="h-3 w-3 rounded-full bg-brand-500" />
              <span className="text-surface-500">{t('reports.pending')}</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <span className="h-3 w-3 rounded-full bg-success-500" />
              <span className="text-surface-500">{t('reports.verified')}</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <span className="h-3 w-3 rounded-full bg-danger-500" />
              <span className="text-surface-500">{t('reports.rejected')}</span>
            </span>
          </div>
        </Card>
      )}

      {/* Table View */}
      {view === "list" && (
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-300">
                        <MapPin className="h-3.5 w-3.5 text-surface-400" />
                        {report.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                          statusColors[report.status as keyof typeof statusColors]
                        )}
                      >
                        {t(`reports.${report.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {report.reward ? `${report.reward} MULTA` : "-"}
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
      )}
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
