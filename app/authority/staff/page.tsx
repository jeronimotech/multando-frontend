"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthorityAuth } from "@/hooks/use-authority-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ShieldCheck,
  Eye,
  BarChart3,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffMember {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  joined_at: string;
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

export default function StaffPage() {
  const { t } = useTranslation();
  const { authority } = useAuthorityAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("viewer");
  const [addLoading, setAddLoading] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authority_token") || "";
      const res = await fetch(`${apiBase}/api/v1/authority-mgmt/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!addEmail) return;
    setAddLoading(true);
    try {
      const token = localStorage.getItem("authority_token") || "";
      const res = await fetch(`${apiBase}/api/v1/authority-mgmt/staff`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: addEmail, role: addRole }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setAddEmail("");
        setAddRole("viewer");
        await fetchStaff();
      }
    } catch {
      // silently handle
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveStaff = async (userId: string) => {
    try {
      const token = localStorage.getItem("authority_token") || "";
      await fetch(`${apiBase}/api/v1/authority-mgmt/staff/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRemoveConfirm(null);
      await fetchStaff();
    } catch {
      // silently handle
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("authority_token") || "";
      await fetch(`${apiBase}/api/v1/authority-mgmt/staff/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      await fetchStaff();
    } catch {
      // silently handle
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t("authority_admin.staff")}
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            {t("authority_admin.staff_desc")}
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-surface-900 hover:bg-amber-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("authority_admin.add_staff")}
        </Button>
      </div>

      {/* Staff List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-surface-500">
              <Users className="mb-3 h-10 w-10" />
              <p className="text-sm">{t("authority_admin.staff_desc")}</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-surface-700">
              {staff.map((member) => {
                const roleColors = ROLE_COLORS[member.role] || ROLE_COLORS.viewer;
                const RoleIcon = ROLE_ICONS[member.role] || Eye;
                return (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {(member.display_name || member.email || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                        {member.display_name || member.email || "Unknown"}
                      </p>
                      {member.email && (
                        <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                          {member.email}
                        </p>
                      )}
                    </div>

                    {/* Role badge */}
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                        roleColors.bg,
                        roleColors.text
                      )}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {t(`authority_admin.role_${member.role}`)}
                    </div>

                    {/* Joined date */}
                    <div className="hidden sm:block text-xs text-surface-500 dark:text-surface-400 whitespace-nowrap">
                      {t("authority_admin.joined")}{" "}
                      {new Date(member.joined_at).toLocaleDateString()}
                    </div>

                    {/* Role selector */}
                    <div className="relative">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.user_id, e.target.value)
                        }
                        className="appearance-none rounded-lg border border-surface-200 bg-white px-3 py-1.5 pr-8 text-xs text-surface-700 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-surface-400" />
                    </div>

                    {/* Remove button */}
                    {removeConfirm === member.user_id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStaff(member.user_id)}
                          className="text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-950"
                        >
                          {t("common.confirm")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRemoveConfirm(null)}
                        >
                          {t("common.cancel")}
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRemoveConfirm(member.user_id)}
                        className="rounded-lg p-2 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950 dark:hover:text-danger-400"
                        title={t("authority_admin.remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-surface-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                {t("authority_admin.add_staff")}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("authority_admin.email")}
                </label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("authority_admin.role")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const RIcon = ROLE_ICONS[opt.value] || Eye;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAddRole(opt.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs font-medium transition-colors",
                          addRole === opt.value
                            ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            : "border-surface-200 text-surface-600 hover:border-surface-300 dark:border-surface-600 dark:text-surface-400"
                        )}
                      >
                        <RIcon className="h-4 w-4" />
                        {t(opt.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowAddModal(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleAddStaff}
                disabled={!addEmail || addLoading}
                className="bg-amber-500 text-surface-900 hover:bg-amber-600"
              >
                {addLoading ? t("common.loading") : t("authority_admin.add_staff")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
