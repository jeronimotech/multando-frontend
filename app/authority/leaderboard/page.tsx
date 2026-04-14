"use client";

import { Fragment, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Trophy, Download, MapPin, ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthorityPlateLeaderboard, type LeaderboardPeriod } from "@/hooks/use-leaderboard";
import { formatDistanceToNow, formatDateTime } from "@/lib/date-utils";
import { exportToCSV } from "@/lib/export";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const LocationHeatmap = dynamic(
  () => import("@/components/charts/Heatmap").then((mod) => mod.LocationHeatmap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
        <p className="text-surface-500">Loading map...</p>
      </div>
    ),
  }
);

const CITY_OPTIONS: { id: string; label: string }[] = [
  { id: "", label: "all" },
  { id: "bogota", label: "Bogotá" },
  { id: "medellin", label: "Medellín" },
  { id: "cali", label: "Cali" },
  { id: "barranquilla", label: "Barranquilla" },
  { id: "cartagena", label: "Cartagena" },
  { id: "bucaramanga", label: "Bucaramanga" },
  { id: "cucuta", label: "Cúcuta" },
  { id: "pereira", label: "Pereira" },
  { id: "santa-marta", label: "Santa Marta" },
  { id: "manizales", label: "Manizales" },
];

export default function AuthorityLeaderboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");
  const [cityId, setCityId] = useState<string>("");
  const [expandedPlate, setExpandedPlate] = useState<string | null>(null);

  const { data = [], isLoading, isError } = useAuthorityPlateLeaderboard({
    period,
    cityId: cityId || null,
    limit: 50,
  });

  const heatmapPoints = useMemo(
    () =>
      data
        .filter((row) => row.last_location && row.last_location.lat != null && row.last_location.lon != null)
        .map((row) => ({
          lat: row.last_location!.lat,
          lng: row.last_location!.lon,
          intensity: Math.min(1, row.verified_reports / 50),
        })),
    [data]
  );

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const rows = data.map((row, idx) => ({
      position: idx + 1,
      plate: row.plate,
      verified_reports: row.verified_reports,
      top_infraction: row.top_infraction ?? "",
      last_reported_at: row.last_reported_at,
      last_lat: row.last_location?.lat ?? "",
      last_lon: row.last_location?.lon ?? "",
      last_address: row.last_location?.address ?? "",
      last_city: row.last_location?.city ?? "",
    }));
    const stamp = new Date().toISOString().slice(0, 10);
    exportToCSV(rows, `plate-leaderboard-${period}-${stamp}.csv`);
  };

  const periodTabs: { key: LeaderboardPeriod; label: string }[] = [
    { key: "all", label: t("landing.leaderboard_period_all") },
    { key: "month", label: t("landing.leaderboard_period_month") },
    { key: "week", label: t("landing.leaderboard_period_week") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Trophy className="h-4 w-4" />
            <span>{t("authority.leaderboard")}</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
            {t("authority.leaderboard_title")}
          </h1>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            {t("authority.leaderboard_subtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={data.length === 0}
          leftIcon={<Download className="h-4 w-4" />}
        >
          {t("authority.leaderboard_export")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          {/* Period */}
          <div className="inline-flex rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
            {periodTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setPeriod(tab.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  period === tab.key
                    ? "bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white"
                    : "text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* City */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="authority-city-filter"
              className="text-sm font-medium text-surface-600 dark:text-surface-300"
            >
              {t("authority.leaderboard_city_filter")}:
            </label>
            <select
              id="authority-city-filter"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
            >
              {CITY_OPTIONS.map((opt) => (
                <option key={opt.id || "all"} value={opt.id}>
                  {opt.id === "" ? t("authority.leaderboard_all_cities") : opt.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            {t("authority.leaderboard_heatmap")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-hidden rounded-lg">
            {isLoading ? (
              <Skeleton variant="rectangular" className="h-full w-full" />
            ) : (
              <LocationHeatmap data={heatmapPoints} center={[4.711, -74.0721]} zoom={11} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-200 bg-surface-50 text-left text-xs uppercase tracking-wider text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("authority.leaderboard_position")}</th>
                  <th className="px-4 py-3 font-medium">{t("authority.leaderboard_plate")}</th>
                  <th className="px-4 py-3 text-right font-medium">
                    {t("authority.leaderboard_reports")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("authority.leaderboard_top_infraction")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("authority.leaderboard_last_reported")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("authority.leaderboard_last_location")}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton height={16} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-surface-500">
                      {t("authority.leaderboard_error")}
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Trophy className="h-10 w-10 text-surface-300 dark:text-surface-600" />
                        <p className="text-surface-500 dark:text-surface-400">
                          {t("authority.leaderboard_empty")}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => {
                    const isExpanded = expandedPlate === row.plate;
                    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
                    return (
                      <Fragment key={row.plate}>
                        <tr
                          className={cn(
                            "transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50",
                            idx < 3 && "bg-amber-50/40 dark:bg-amber-950/10"
                          )}
                        >
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-2">
                              {medal ? (
                                <span className="text-xl leading-none">{medal}</span>
                              ) : (
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-100 text-xs font-semibold text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                                  {idx + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <span className="inline-flex items-center rounded-md border border-surface-300 bg-white px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-surface-900 dark:border-surface-600 dark:bg-surface-900 dark:text-white">
                              {row.plate}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right align-middle">
                            <span className="text-lg font-bold tabular-nums text-brand-500">
                              {row.verified_reports.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-middle text-surface-700 dark:text-surface-200">
                            {row.top_infraction || "—"}
                          </td>
                          <td className="px-4 py-3 align-middle text-surface-600 dark:text-surface-300">
                            {row.last_reported_at ? formatDistanceToNow(row.last_reported_at) : "—"}
                          </td>
                          <td className="px-4 py-3 align-middle">
                            {row.last_location ? (
                              <div className="flex items-center gap-1 text-xs text-surface-600 dark:text-surface-300">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                <span className="truncate">
                                  {row.last_location.city ||
                                    `${row.last_location.lat.toFixed(4)}, ${row.last_location.lon.toFixed(4)}`}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-surface-400">
                                {t("authority.leaderboard_no_location")}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 align-middle text-right">
                            {row.last_location && (
                              <button
                                onClick={() =>
                                  setExpandedPlate(isExpanded ? null : row.plate)
                                }
                                className="inline-flex items-center gap-1 rounded p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-200"
                                aria-label="Toggle details"
                              >
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform",
                                    isExpanded && "rotate-180"
                                  )}
                                />
                              </button>
                            )}
                          </td>
                        </tr>
                        {isExpanded && row.last_location && (
                          <tr className="bg-surface-50/50 dark:bg-surface-800/30">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-xs uppercase tracking-wider text-surface-500">
                                      Coordinates
                                    </span>
                                    <p className="font-mono text-surface-800 dark:text-surface-200">
                                      {row.last_location.lat.toFixed(6)},{" "}
                                      {row.last_location.lon.toFixed(6)}
                                    </p>
                                  </div>
                                  {row.last_location.address && (
                                    <div>
                                      <span className="text-xs uppercase tracking-wider text-surface-500">
                                        Address
                                      </span>
                                      <p className="text-surface-800 dark:text-surface-200">
                                        {row.last_location.address}
                                      </p>
                                    </div>
                                  )}
                                  {row.last_reported_at && (
                                    <div>
                                      <span className="text-xs uppercase tracking-wider text-surface-500">
                                        Reported at
                                      </span>
                                      <p className="text-surface-800 dark:text-surface-200">
                                        {formatDateTime(row.last_reported_at)}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <a
                                      href={`https://www.openstreetmap.org/?mlat=${row.last_location.lat}&mlon=${row.last_location.lon}&zoom=17`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-700"
                                    >
                                      {t("authority.leaderboard_view_on_map")}
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </div>
                                </div>
                                <div className="h-48 overflow-hidden rounded-lg">
                                  <LocationHeatmap
                                    data={[
                                      {
                                        lat: row.last_location.lat,
                                        lng: row.last_location.lon,
                                        intensity: 1,
                                      },
                                    ]}
                                    center={[row.last_location.lat, row.last_location.lon]}
                                    zoom={15}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
