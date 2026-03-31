"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  MapPin,
  FileText,
  Plus,
  ArrowRight,
  Eye,
  UserPlus,
  X,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformStats {
  total_users: number;
  total_reports: number;
  total_authorities: number;
  total_cities: number;
  reports_today: number;
  reports_this_month: number;
}

interface AuthorityListItem {
  id: number;
  name: string;
  code: string;
  country: string;
  city: string | null;
  city_id: number | null;
  subscription_tier: string;
  contact_email: string | null;
  staff_count: number;
  created_at: string;
}

interface CityOption {
  id: number;
  name: string;
  country_code: string;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [authorities, setAuthorities] = useState<AuthorityListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cities, setCities] = useState<CityOption[]>([]);

  // Create form state
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formCityId, setFormCityId] = useState<number | "">("");
  const [formContactEmail, setFormContactEmail] = useState("");
  const [formContactName, setFormContactName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const getToken = () => localStorage.getItem("token") || "";

  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setStats(await res.json());
    } catch {
      // silently handle
    }
  };

  const fetchAuthorities = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/admin/authorities?page_size=50`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAuthorities(data.items || []);
      }
    } catch {
      // silently handle
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/cities`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCities(Array.isArray(data) ? data : data.items || []);
      }
    } catch {
      // silently handle
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchAuthorities(), fetchCities()]);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!formName || !formCode || !formCityId) return;
    setCreateLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/admin/authorities`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          code: formCode,
          city_id: formCityId,
          contact_email: formContactEmail || null,
          contact_name: formContactName || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedApiKey(data.api_key);
        setShowCreateForm(false);
        setFormName("");
        setFormCode("");
        setFormCityId("");
        setFormContactEmail("");
        setFormContactName("");
        await fetchAuthorities();
        await fetchStats();
      }
    } catch {
      // silently handle
    } finally {
      setCreateLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          label: t("admin.total_users"),
          value: stats.total_users.toLocaleString(),
          icon: Users,
          color: "brand",
        },
        {
          label: t("admin.total_authorities"),
          value: stats.total_authorities.toLocaleString(),
          icon: Building2,
          color: "accent",
        },
        {
          label: t("admin.total_cities"),
          value: stats.total_cities.toLocaleString(),
          icon: MapPin,
          color: "success",
        },
        {
          label: t("admin.total_reports"),
          value: stats.total_reports.toLocaleString(),
          icon: FileText,
          color: "warning",
        },
      ]
    : [];

  const colorMap: Record<string, { bg: string; icon: string }> = {
    brand: {
      bg: "bg-brand-50 dark:bg-brand-950/30",
      icon: "text-brand-500",
    },
    accent: {
      bg: "bg-accent-50 dark:bg-accent-950/30",
      icon: "text-accent-500",
    },
    success: {
      bg: "bg-success-50 dark:bg-success-950/30",
      icon: "text-success-500",
    },
    warning: {
      bg: "bg-warning-50 dark:bg-warning-950/30",
      icon: "text-warning-500",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t("admin.title")}
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            {t("admin.subtitle")}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-brand-500 text-white hover:bg-brand-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.create_authority")}
        </Button>
      </div>

      {/* API Key display (shown once after authority creation) */}
      {createdApiKey && (
        <div className="rounded-xl border border-brand-300 bg-brand-50 p-4 dark:border-brand-700 dark:bg-brand-950/30">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 text-brand-600 dark:text-brand-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
                {t("admin.api_key_created")}
              </p>
              <code className="mt-1 block rounded-lg bg-brand-100 px-3 py-2 font-mono text-xs text-brand-900 dark:bg-brand-900/50 dark:text-brand-200">
                {createdApiKey}
              </code>
            </div>
            <button
              onClick={() => setCreatedApiKey(null)}
              className="rounded-lg p-1 text-brand-400 hover:bg-brand-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const colors = colorMap[stat.color];
            return (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        colors.bg
                      )}
                    >
                      <stat.icon className={cn("h-6 w-6", colors.icon)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Authority Form */}
      {showCreateForm && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {t("admin.create_authority")}
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("admin.authority_name")}
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("admin.authority_code")}
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIGESETT"
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("admin.city")}
                </label>
                <select
                  value={formCityId}
                  onChange={(e) =>
                    setFormCityId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                >
                  <option value="">{t("admin.select_city")}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.country_code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("admin.contact_email")}
                </label>
                <input
                  type="email"
                  value={formContactEmail}
                  onChange={(e) => setFormContactEmail(e.target.value)}
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("admin.contact_name")}
                </label>
                <input
                  type="text"
                  value={formContactName}
                  onChange={(e) => setFormContactName(e.target.value)}
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formName || !formCode || !formCityId || createLoading}
                className="bg-brand-500 text-white hover:bg-brand-600"
              >
                {createLoading ? t("common.loading") : t("admin.create_authority")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authorities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("admin.authorities_list")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-700">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                    {t("admin.authority_name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                    {t("admin.authority_code")}
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400 sm:table-cell">
                    {t("admin.city")}
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400 md:table-cell">
                    {t("admin.staff_count")}
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400 md:table-cell">
                    {t("admin.subscription")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                    {t("reports.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {authorities.map((auth) => (
                  <tr key={auth.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        {auth.name}
                      </p>
                      {auth.contact_email && (
                        <p className="text-xs text-surface-500">{auth.contact_email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-700 dark:bg-surface-700 dark:text-surface-300">
                        {auth.code}
                      </code>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-surface-600 dark:text-surface-400 sm:table-cell">
                      {auth.city || "-"}
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-surface-600 dark:text-surface-400 md:table-cell">
                      {auth.staff_count}
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
                        {auth.subscription_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/authorities/${auth.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {t("common.view")}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {authorities.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-surface-500"
                    >
                      {t("admin.no_authorities")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
