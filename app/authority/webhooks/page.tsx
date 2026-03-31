"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthorityAuth } from "@/hooks/use-authority-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Webhook,
  Plus,
  Trash2,
  Pencil,
  Zap,
  Copy,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebhookItem {
  id: number;
  url: string;
  events: string[];
  is_active: boolean;
  last_triggered_at: string | null;
  last_status_code: number | null;
  failure_count: number;
  created_at: string;
}

interface WebhookCreated extends WebhookItem {
  secret: string;
}

const EVENT_OPTIONS = [
  { value: "report.created", labelKey: "authority_admin.event_report_created" },
  { value: "report.verified", labelKey: "authority_admin.event_report_verified" },
  { value: "report.rejected", labelKey: "authority_admin.event_report_rejected" },
];

export default function WebhooksPage() {
  const { t } = useTranslation();
  const { authority } = useAuthorityAuth();
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{
    id: number;
    success: boolean;
    message: string;
  } | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  // Form state
  const [formUrl, setFormUrl] = useState("");
  const [formEvents, setFormEvents] = useState<string[]>([]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const getToken = () => localStorage.getItem("authority_token") || "";

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/authority-mgmt/webhooks/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWebhooks(data.items || []);
      }
    } catch {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCreate = async () => {
    if (!formUrl || formEvents.length === 0) return;
    try {
      const res = await fetch(`${apiBase}/api/v1/authority-mgmt/webhooks/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formUrl, events: formEvents }),
      });
      if (res.ok) {
        const data: WebhookCreated = await res.json();
        setNewSecret(data.secret);
        setShowAddForm(false);
        setFormUrl("");
        setFormEvents([]);
        await fetchWebhooks();
      }
    } catch {
      // silently handle
    }
  };

  const handleUpdate = async (webhookId: number) => {
    try {
      const body: Record<string, unknown> = {};
      if (formUrl) body.url = formUrl;
      if (formEvents.length > 0) body.events = formEvents;

      const res = await fetch(
        `${apiBase}/api/v1/authority-mgmt/webhooks/${webhookId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (res.ok) {
        setEditingId(null);
        setFormUrl("");
        setFormEvents([]);
        await fetchWebhooks();
      }
    } catch {
      // silently handle
    }
  };

  const handleToggleActive = async (webhook: WebhookItem) => {
    try {
      await fetch(
        `${apiBase}/api/v1/authority-mgmt/webhooks/${webhook.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_active: !webhook.is_active }),
        }
      );
      await fetchWebhooks();
    } catch {
      // silently handle
    }
  };

  const handleDelete = async (webhookId: number) => {
    try {
      await fetch(
        `${apiBase}/api/v1/authority-mgmt/webhooks/${webhookId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      await fetchWebhooks();
    } catch {
      // silently handle
    }
  };

  const handleTest = async (webhookId: number) => {
    setTestingId(webhookId);
    setTestResult(null);
    try {
      const res = await fetch(
        `${apiBase}/api/v1/authority-mgmt/webhooks/${webhookId}/test`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      setTestResult({
        id: webhookId,
        success: data.success,
        message: data.success
          ? t("authority_admin.webhook_test_success")
          : t("authority_admin.webhook_test_failed"),
      });
    } catch {
      setTestResult({
        id: webhookId,
        success: false,
        message: t("authority_admin.webhook_test_failed"),
      });
    } finally {
      setTestingId(null);
    }
  };

  const toggleEvent = (event: string) => {
    setFormEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const copySecret = async (secret: string) => {
    await navigator.clipboard.writeText(secret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

  const getStatusInfo = (webhook: WebhookItem) => {
    if (!webhook.is_active && webhook.failure_count >= 10) {
      return {
        label: t("authority_admin.webhook_failed"),
        color: "text-danger-600 dark:text-danger-400",
        bg: "bg-danger-50 dark:bg-danger-950/30",
        Icon: XCircle,
      };
    }
    if (!webhook.is_active) {
      return {
        label: t("authority_admin.webhook_paused"),
        color: "text-surface-500 dark:text-surface-400",
        bg: "bg-surface-100 dark:bg-surface-700",
        Icon: PauseCircle,
      };
    }
    return {
      label: t("authority_admin.webhook_active"),
      color: "text-success-600 dark:text-success-400",
      bg: "bg-success-50 dark:bg-success-950/30",
      Icon: CheckCircle2,
    };
  };

  const startEdit = (webhook: WebhookItem) => {
    setEditingId(webhook.id);
    setFormUrl(webhook.url);
    setFormEvents([...webhook.events]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t("authority_admin.webhooks")}
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            {t("authority_admin.webhooks_desc")}
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setFormUrl("");
            setFormEvents([]);
          }}
          className="bg-amber-500 text-surface-900 hover:bg-amber-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("authority_admin.add_webhook")}
        </Button>
      </div>

      {/* Secret display (shown once after creation) */}
      {newSecret && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {t("authority_admin.webhook_secret")}
              </p>
              <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                {t("authority_admin.webhook_secret_desc")}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-amber-100 px-3 py-2 font-mono text-xs text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                  {newSecret}
                </code>
                <button
                  onClick={() => copySecret(newSecret)}
                  className="rounded-lg p-2 text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50"
                >
                  {secretCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={() => setNewSecret(null)}
              className="rounded-lg p-1 text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId !== null) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">
              {editingId !== null
                ? t("common.edit")
                : t("authority_admin.add_webhook")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("authority_admin.webhook_url")}
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder={t("authority_admin.webhook_url_placeholder")}
                  className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-surface-600 dark:bg-surface-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t("authority_admin.webhook_events")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_OPTIONS.map((event) => (
                    <button
                      key={event.value}
                      onClick={() => toggleEvent(event.value)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        formEvents.includes(event.value)
                          ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          : "border-surface-200 text-surface-600 hover:border-surface-300 dark:border-surface-600 dark:text-surface-400"
                      )}
                    >
                      {t(event.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormUrl("");
                    setFormEvents([]);
                  }}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={() =>
                    editingId !== null
                      ? handleUpdate(editingId)
                      : handleCreate()
                  }
                  disabled={!formUrl || formEvents.length === 0}
                  className="bg-amber-500 text-surface-900 hover:bg-amber-600"
                >
                  {editingId !== null ? t("common.save") : t("authority_admin.add_webhook")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      ) : webhooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-surface-500">
            <Webhook className="mb-3 h-10 w-10" />
            <p className="text-sm">{t("authority_admin.webhooks_desc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook) => {
            const statusInfo = getStatusInfo(webhook);
            return (
              <Card key={webhook.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: URL and events */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="truncate text-sm font-medium text-surface-900 dark:text-white">
                          {webhook.url}
                        </code>
                        <div
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            statusInfo.bg,
                            statusInfo.color
                          )}
                        >
                          <statusInfo.Icon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-surface-500 dark:text-surface-400">
                        <span>
                          {t("authority_admin.last_triggered")}:{" "}
                          {webhook.last_triggered_at
                            ? new Date(webhook.last_triggered_at).toLocaleString()
                            : t("authority_admin.never")}
                        </span>
                        {webhook.failure_count > 0 && (
                          <span className="text-danger-600 dark:text-danger-400">
                            {webhook.failure_count} {t("authority_admin.failures")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Test result message */}
                      {testResult && testResult.id === webhook.id && (
                        <span
                          className={cn(
                            "text-xs font-medium",
                            testResult.success
                              ? "text-success-600 dark:text-success-400"
                              : "text-danger-600 dark:text-danger-400"
                          )}
                        >
                          {testResult.message}
                        </span>
                      )}

                      {/* Test button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTest(webhook.id)}
                        disabled={testingId === webhook.id}
                        className="text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        {testingId === webhook.id
                          ? t("common.loading")
                          : t("authority_admin.webhook_test")}
                      </Button>

                      {/* Toggle active */}
                      <button
                        onClick={() => handleToggleActive(webhook)}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          webhook.is_active
                            ? "bg-amber-500"
                            : "bg-surface-300 dark:bg-surface-600"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                            webhook.is_active
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          )}
                        />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => startEdit(webhook)}
                        className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-700 dark:hover:text-surface-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(webhook.id)}
                        className="rounded-lg p-2 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950 dark:hover:text-danger-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
