"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Users,
  Webhook,
  FileText,
  ShieldCheck,
  Eye,
  BarChart3,
  Plus,
  Trash2,
  ChevronDown,
  X,
  MapPin,
  Mail,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffMember {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  joined_at: string;
}

interface CityInfo {
  id: number;
  name: string;
  country_code: string;
}

interface AuthorityDetail {
  id: number;
  name: string;
  code: string;
  country: string;
  city: string | null;
  city_id: number | null;
  city_info: CityInfo | null;
  subscription_tier: string;
  subscription_expires_at: string | null;
  rate_limit: number;
  contact_email: string | null;
  contact_name: string | null;
  created_at: string;
  staff: StaffMember[];
}

const ROLE_OPTIONS = [
  { value: "viewer", labelKey: "authority_admin.role_viewer" },
  { value: "analyst", labelKey: "authority_admin.role_analyst" },
  { value: "admin", labelKey: "authority_admin.role_admin" },
];

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: {
    bg: "bg-brand-50 dark:bg-brand-950/30",
    text: "text-brand-700 dark:text-brand-300",
  },
  analyst: {
    bg: "bg-accent-50 dark:bg-accent-950/30",
    text: "text-accent-700 dark:text-accent-300",
  },
  viewer: {
    bg: "bg-surface-100 dark:bg-surface-700",
    text: "text-surface-600 dark:text-surface-300",
  },
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  admin: ShieldCheck,
  analyst: BarChart3,
  viewer: Eye,
};

export default function AuthorityDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const authorityId = params.id as string;

  const [authority, setAuthority] = useState<AuthorityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("viewer");
  const [addLoading, setAddLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const getToken = () => localStorage.getItem("token") || "";

  const fetchAuthority = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${apiBase}/api/v1/admin/authorities/${authorityId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.ok) {
        setAuthority(await res.json());
      } else if (res.status === 404) {
        router.push("/admin");
      }
    } catch {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authorityId) fetchAuthority();
  }, [authorityId]);

  const handleAddStaff = async () => {
    if (!addEmail) return;
    setAddLoading(true);
    try {
      const res = await fetch(
        `${apiBase}/api/v1/admin/authorities/${authorityId}/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: addEmail, role: addRole }),
        }
      );
      if (res.ok) {
        setShowAddStaff(false);
        setAddEmail("");
        setAddRole("viewer");
        await fetchAuthority();
      }
    } catch {
      // silently handle
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveStaff = async (userId: string) => {
    try {
      await fetch(
        `${apiBase}/api/v1/admin/authorities/${authorityId}/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      await fetchAuthority();
    } catch {
      // silently handle
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await fetch(
        `${apiBase}/api/v1/admin/authorities/${authorityId}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      await fetchAuthority();
    } catch {
      // silently handle
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!authority) {
    return (
      <div className="py-20 text-center text-surface-500">
        {t("errors.not_found")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")}
      </Link>

      {/* Authority Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {authority.name}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
            <code className="rounded bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-700 dark:bg-surface-700 dark:text-surface-300">
              {authority.code}
            </code>
            <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
              {authority.subscription_tier}
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* City */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 dark:bg-success-950/30">
                <MapPin className="h-5 w-5 text-success-500" />
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {t("admin.city")}
                </p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {authority.city_info?.name || authority.city || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/30">
                <Mail className="h-5 w-5 text-accent-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {t("admin.contact")}
                </p>
                <p className="truncate text-sm font-medium text-surface-900 dark:text-white">
                  {authority.contact_name || authority.contact_email || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff count */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/30">
                <Users className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {t("admin.staff_count")}
                </p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {authority.staff.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate limit */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 dark:bg-warning-950/30">
                <Key className="h-5 w-5 text-warning-500" />
              </div>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {t("admin.rate_limit")}
                </p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  {authority.rate_limit.toLocaleString()}/day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              {t("authority_admin.staff")}
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddStaff(true)}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              {t("authority_admin.add_staff")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Add staff inline form */}
          {showAddStaff && (
            <div className="border-b border-surface-100 px-6 py-4 dark:border-surface-700">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="mb-1 block text-xs font-medium text-surface-500">
                    {t("authority_admin.email")}
                  </label>
                  <input
                    type="email"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-surface-500">
                    {t("authority_admin.role")}
                  </label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  size="sm"
                  onClick={handleAddStaff}
                  disabled={!addEmail || addLoading}
                  className="bg-brand-500 text-white hover:bg-brand-600"
                >
                  {addLoading ? t("common.loading") : t("authority_admin.add_staff")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddStaff(false);
                    setAddEmail("");
                    setAddRole("viewer");
                  }}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          )}

          {/* Staff list */}
          {authority.staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-surface-500">
              <Users className="mb-2 h-8 w-8" />
              <p className="text-sm">{t("admin.no_staff")}</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-surface-700">
              {authority.staff.map((member) => {
                const roleColors =
                  ROLE_COLORS[member.role] || ROLE_COLORS.viewer;
                const RoleIcon = ROLE_ICONS[member.role] || Eye;
                return (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-4 px-6 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                      <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                        {(member.display_name || member.email || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                        {member.display_name || member.email || "Unknown"}
                      </p>
                      {member.email && (
                        <p className="text-xs text-surface-500 truncate">
                          {member.email}
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        roleColors.bg,
                        roleColors.text
                      )}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {t(`authority_admin.role_${member.role}`)}
                    </div>
                    <div className="relative">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(member.user_id, e.target.value)
                        }
                        className="appearance-none rounded-lg border border-surface-200 bg-white px-2 py-1 pr-7 text-xs text-surface-700 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-surface-400" />
                    </div>
                    <button
                      onClick={() => handleRemoveStaff(member.user_id)}
                      className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950 dark:hover:text-danger-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authority metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            {t("admin.authority_info")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {t("admin.authority_name")}
              </dt>
              <dd className="mt-0.5 text-sm text-surface-900 dark:text-white">
                {authority.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {t("admin.authority_code")}
              </dt>
              <dd className="mt-0.5 text-sm text-surface-900 dark:text-white">
                {authority.code}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {t("admin.country")}
              </dt>
              <dd className="mt-0.5 text-sm text-surface-900 dark:text-white">
                {authority.country}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {t("admin.contact_email")}
              </dt>
              <dd className="mt-0.5 text-sm text-surface-900 dark:text-white">
                {authority.contact_email || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {t("admin.contact_name")}
              </dt>
              <dd className="mt-0.5 text-sm text-surface-900 dark:text-white">
                {authority.contact_name || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {t("admin.created_at")}
              </dt>
              <dd className="mt-0.5 text-sm text-surface-900 dark:text-white">
                {new Date(authority.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
