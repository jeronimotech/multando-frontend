"use client";

import { useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  useReviewQueue,
  useApproveReport,
  useRejectReport,
  type ReviewQueueItem,
  type ReviewStatus,
  type ReviewConfidenceFactors,
} from "@/hooks/use-authority-review";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ShieldAlert,
  Info,
} from "lucide-react";

type StatusTab = "authority_review" | "community_verified" | "all";

const PAGE_SIZE = 20;

const FACTOR_I18N_KEYS: Record<keyof ReviewConfidenceFactors, string> = {
  signed_evidence: "authority.review_factor_signed_evidence",
  has_photo: "authority.review_factor_has_photo",
  valid_gps: "authority.review_factor_valid_gps",
  valid_plate: "authority.review_factor_valid_plate",
  reporter_reputation: "authority.review_factor_reporter_reputation",
  community_verifications: "authority.review_factor_community_verifications",
  community_rejections: "authority.review_factor_community_rejections",
};

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

function confidenceColor(score: number) {
  if (score >= 80) return "green" as const;
  if (score >= 60) return "amber" as const;
  return "red" as const;
}

function confidenceClasses(score: number) {
  const c = confidenceColor(score);
  if (c === "green")
    return {
      ring: "ring-success-500/30",
      bg: "bg-success-500",
      text: "text-white",
      softBg: "bg-success-100 dark:bg-success-900/30",
      softText: "text-success-700 dark:text-success-300",
      border: "border-success-300",
    };
  if (c === "amber")
    return {
      ring: "ring-amber-400/30",
      bg: "bg-amber-500",
      text: "text-white",
      softBg: "bg-amber-100 dark:bg-amber-900/30",
      softText: "text-amber-700 dark:text-amber-300",
      border: "border-amber-300",
    };
  return {
    ring: "ring-danger-500/30",
    bg: "bg-danger-500",
    text: "text-white",
    softBg: "bg-danger-100 dark:bg-danger-900/30",
    softText: "text-danger-700 dark:text-danger-300",
    border: "border-danger-300",
  };
}

function severityVariant(
  sev?: string
): "default" | "warning" | "danger" | "brand" {
  switch (sev) {
    case "critical":
      return "danger";
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "brand";
    default:
      return "default";
  }
}

function formatRelative(dateStr: string, locale: string): string {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const minutes = Math.max(1, Math.round(diffMs / 60_000));
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  const isEs = locale === "es";
  if (minutes < 60)
    return isEs ? `hace ${minutes} min` : `${minutes} min ago`;
  if (hours < 24) return isEs ? `hace ${hours} h` : `${hours}h ago`;
  return isEs ? `hace ${days} d` : `${days}d ago`;
}

function infractionName(
  item: ReviewQueueItem,
  locale: string
): string {
  if (!item.infraction) return "—";
  return (
    (locale === "es" ? item.infraction.name_es : item.infraction.name_en) ??
    item.infraction.name_en ??
    item.infraction.name_es ??
    "—"
  );
}

/* ------------------------------------------------------------------ */
/*  Inline Toast                                                       */
/* ------------------------------------------------------------------ */

type Toast = { id: number; variant: "success" | "danger"; message: string };

function InlineToasts({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex w-80 items-start gap-3 rounded-lg border bg-white p-4 shadow-lg dark:bg-surface-800",
            t.variant === "success"
              ? "border-success-300 dark:border-success-600"
              : "border-danger-300 dark:border-danger-600"
          )}
          role="status"
        >
          {t.variant === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-500" />
          )}
          <p className="flex-1 text-sm text-surface-900 dark:text-white">
            {t.message}
          </p>
          <button
            className="rounded p-0.5 text-surface-400 hover:text-surface-600"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AuthorityReviewPage() {
  const { t, locale } = useTranslation();

  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [cityId, setCityId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReviewQueueItem | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback(
    (variant: "success" | "danger", message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, variant, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const filters = useMemo(
    () => ({
      status: statusTab === "all" ? undefined : (statusTab as ReviewStatus),
      cityId,
      page,
      pageSize: PAGE_SIZE,
    }),
    [statusTab, cityId, page]
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useReviewQueue(filters);
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  const items = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  /* ----- City options derived from visible items ----- */
  const cityOptions = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((it) => {
      const name = it.location?.city;
      if (name) map.set(name, name);
    });
    return Array.from(map.keys()).sort();
  }, [items]);

  const handleTabChange = useCallback((tab: StatusTab) => {
    setStatusTab(tab);
    setPage(1);
  }, []);

  const handleRowClick = useCallback((item: ReviewQueueItem) => {
    setSelected(item);
  }, []);

  const closeDetail = useCallback(() => {
    setSelected(null);
  }, []);

  const openApprove = useCallback((item: ReviewQueueItem) => {
    setSelected(item);
    setApproveOpen(true);
  }, []);

  const openReject = useCallback((item: ReviewQueueItem) => {
    setSelected(item);
    setRejectOpen(true);
  }, []);

  const handleApprove = useCallback(
    async (notes: string) => {
      if (!selected) return;
      try {
        await approveMutation.mutateAsync({ reportId: selected.id, notes });
        pushToast("success", t("authority.review_approved_success"));
        setApproveOpen(false);
        setSelected(null);
        refetch();
      } catch (err) {
        const msg =
          (err as { message?: string })?.message ??
          t("common.error") ??
          "Error";
        pushToast("danger", msg);
      }
    },
    [approveMutation, selected, pushToast, t, refetch]
  );

  const handleReject = useCallback(
    async (reason: string) => {
      if (!selected) return;
      try {
        await rejectMutation.mutateAsync({
          reportId: selected.id,
          reason,
        });
        pushToast("success", t("authority.review_rejected_success"));
        setRejectOpen(false);
        setSelected(null);
        refetch();
      } catch (err) {
        const msg =
          (err as { message?: string })?.message ??
          t("common.error") ??
          "Error";
        pushToast("danger", msg);
      }
    },
    [rejectMutation, selected, pushToast, t, refetch]
  );

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */

  return (
    <div className="space-y-4">
      <InlineToasts toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                {t("authority.review_title")}
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {t("authority.review_subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City filter */}
          <select
            value={cityId ?? ""}
            onChange={(e) => {
              setCityId(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          >
            <option value="">{t("authority.leaderboard_all_cities")}</option>
            {cityOptions.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>

          <div className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-600 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">
            {total} {total === 1 ? "report" : "reports"}
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="inline-flex rounded-lg border border-surface-200 bg-white p-1 dark:border-surface-700 dark:bg-surface-800">
        {(
          [
            { key: "all", label: t("authority.review_status_all") },
            {
              key: "authority_review",
              label: t("authority.review_status_authority"),
            },
            {
              key: "community_verified",
              label: t("authority.review_status_community"),
            },
          ] as { key: StatusTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              statusTab === tab.key
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "text-surface-600 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <QueueLoading />
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 p-16 text-center">
              <AlertTriangle className="h-10 w-10 text-danger-500" />
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                {(error as { message?: string })?.message ??
                  t("errors.generic")}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-16 text-center">
              <ClipboardCheck className="h-10 w-10 text-surface-300" />
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {t("authority.review_empty")}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-surface-100 dark:divide-surface-700">
              {items.map((item) => (
                <ReviewRow
                  key={item.id}
                  item={item}
                  locale={locale}
                  t={t}
                  onClick={() => handleRowClick(item)}
                  onApprove={(e) => {
                    e.stopPropagation();
                    openApprove(item);
                  }}
                  onReject={(e) => {
                    e.stopPropagation();
                    openReject(item);
                  }}
                  onImageClick={(url) => setEnlargedImage(url)}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.pagination && data.pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Page {data.pagination.page} of {data.pagination.total_pages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.has_more || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selected && !approveOpen && !rejectOpen && (
        <ReviewDetailDrawer
          item={selected}
          locale={locale}
          t={t}
          onClose={closeDetail}
          onApprove={() => setApproveOpen(true)}
          onReject={() => setRejectOpen(true)}
          onImageClick={(url) => setEnlargedImage(url)}
        />
      )}

      {/* Approve Dialog */}
      <ApproveDialog
        open={approveOpen}
        onOpenChange={(o) => setApproveOpen(o)}
        item={selected}
        t={t}
        isSubmitting={approveMutation.isPending}
        onConfirm={handleApprove}
      />

      {/* Reject Dialog */}
      <RejectDialog
        open={rejectOpen}
        onOpenChange={(o) => setRejectOpen(o)}
        item={selected}
        t={t}
        isSubmitting={rejectMutation.isPending}
        onConfirm={handleReject}
      />

      {/* Image lightbox */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setEnlargedImage(null);
            }}
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enlargedImage}
            alt="Evidence"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Row                                                                */
/* ------------------------------------------------------------------ */

function ReviewRow({
  item,
  locale,
  t,
  onClick,
  onApprove,
  onReject,
  onImageClick,
}: {
  item: ReviewQueueItem;
  locale: string;
  t: (k: string) => string;
  onClick: () => void;
  onApprove: (e: React.MouseEvent) => void;
  onReject: (e: React.MouseEvent) => void;
  onImageClick: (url: string) => void;
}) {
  const firstImage = item.evidences?.find(
    (e) => e.mime_type?.startsWith("image/") || e.type === "image"
  );

  return (
    <li
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
    >
      {/* Thumbnail */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (firstImage?.url) onImageClick(firstImage.url);
        }}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-700"
        aria-label="Open evidence"
      >
        {firstImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImage.url}
            alt="Evidence"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-surface-400">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
      </button>

      {/* Confidence */}
      <div className="shrink-0" title={`${item.confidence_score}/100`}>
        <ConfidenceBadge
          score={item.confidence_score}
          factors={item.confidence_factors}
          t={t}
        />
      </div>

      {/* Plate + infraction */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded bg-surface-100 px-2 py-0.5 font-mono text-sm font-bold text-surface-900 dark:bg-surface-700 dark:text-white">
            {item.vehicle_plate}
          </code>
          {item.infraction?.severity && (
            <Badge variant={severityVariant(item.infraction.severity)} size="sm">
              {item.infraction.severity}
            </Badge>
          )}
          <span className="text-xs font-medium text-surface-400">
            {item.short_id}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-surface-700 dark:text-surface-200">
          {infractionName(item, locale)}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-500 dark:text-surface-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location?.address ||
              item.location?.city ||
              `${item.location?.lat?.toFixed(4)}, ${item.location?.lon?.toFixed(4)}`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelative(item.created_at, locale)}
          </span>
          <span
            className="inline-flex items-center gap-1"
            title={t("authority.review_community_votes")}
          >
            <ThumbsUp className="h-3 w-3 text-success-500" />
            {item.verification_count ?? 0}
            <ThumbsDown className="ml-1 h-3 w-3 text-danger-500" />
            {item.rejection_count ?? 0}
          </span>
        </div>
      </div>

      {/* Reporter */}
      <div className="hidden shrink-0 items-center gap-2 md:flex">
        {item.reporter?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.reporter.avatar_url}
            alt={item.reporter.display_name ?? ""}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
            {item.reporter?.display_name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="max-w-[120px] truncate text-xs text-surface-600 dark:text-surface-300">
          {item.reporter?.display_name ?? "Anonymous"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          className="bg-success-500 text-white hover:bg-success-600"
          onClick={onApprove}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          {t("authority.review_approve")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-600 dark:text-danger-400 dark:hover:bg-danger-900/20"
          onClick={onReject}
        >
          <XCircle className="mr-1 h-4 w-4" />
          {t("authority.review_reject")}
        </Button>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Confidence Badge                                                   */
/* ------------------------------------------------------------------ */

function ConfidenceBadge({
  score,
  factors,
  t,
}: {
  score: number;
  factors?: ReviewConfidenceFactors;
  t: (k: string) => string;
}) {
  const classes = confidenceClasses(score);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "flex h-14 w-14 flex-col items-center justify-center rounded-full ring-4",
          classes.bg,
          classes.ring
        )}
      >
        <span className="text-lg font-bold leading-none text-white">
          {Math.round(score)}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wide text-white/80">
          {t("authority.review_confidence")}
        </span>
      </div>

      {hovered && factors && Object.keys(factors).length > 0 && (
        <div className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-surface-200 bg-white p-3 text-xs shadow-xl dark:border-surface-700 dark:bg-surface-800">
          <p className="mb-2 font-semibold text-surface-700 dark:text-surface-200">
            {t("authority.review_confidence")}
          </p>
          <ul className="space-y-1">
            {Object.entries(factors).map(([k, v]) => {
              if (v == null) return null;
              const labelKey = FACTOR_I18N_KEYS[k as keyof ReviewConfidenceFactors];
              const label = labelKey ? t(labelKey) : k;
              const num = Number(v);
              const sign = num >= 0 ? "+" : "";
              return (
                <li
                  key={k}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-surface-600 dark:text-surface-300">
                    {label}
                  </span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      num >= 0
                        ? "text-success-600 dark:text-success-400"
                        : "text-danger-600 dark:text-danger-400"
                    )}
                  >
                    {sign}
                    {num}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading                                                            */
/* ------------------------------------------------------------------ */

function QueueLoading() {
  return (
    <ul className="divide-y divide-surface-100 dark:divide-surface-700">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 p-4">
          <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-surface-200 dark:bg-surface-700" />
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-3 w-48 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-3 w-24 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Drawer                                                      */
/* ------------------------------------------------------------------ */

function ReviewDetailDrawer({
  item,
  locale,
  t,
  onClose,
  onApprove,
  onReject,
  onImageClick,
}: {
  item: ReviewQueueItem;
  locale: string;
  t: (k: string) => string;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onImageClick: (url: string) => void;
}) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const images =
    item.evidences?.filter(
      (e) => e.mime_type?.startsWith("image/") || e.type === "image"
    ) ?? [];
  const current = images[galleryIdx];
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${item.location.lon - 0.005}%2C${item.location.lat - 0.003}%2C${item.location.lon + 0.005}%2C${item.location.lat + 0.003}&layer=mapnik&marker=${item.location.lat}%2C${item.location.lon}`;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-[95] w-full max-w-xl overflow-y-auto bg-white shadow-2xl dark:bg-surface-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-200 bg-white px-6 py-4 dark:border-surface-700 dark:bg-surface-800">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              {item.short_id}
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {infractionName(item, locale)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Evidence gallery */}
          {images.length > 0 ? (
            <div>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current?.url}
                  alt="Evidence"
                  className="h-full w-full cursor-zoom-in object-cover"
                  onClick={() => current && onImageClick(current.url)}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setGalleryIdx((i) =>
                          i === 0 ? images.length - 1 : i - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setGalleryIdx((i) => (i + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                      {galleryIdx + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={img.url}
                      onClick={() => setGalleryIdx(i)}
                      className={cn(
                        "h-14 w-14 shrink-0 overflow-hidden rounded border-2",
                        i === galleryIdx
                          ? "border-amber-500"
                          : "border-transparent"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-surface-100 text-surface-400 dark:bg-surface-900">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}

          {/* Confidence + factors */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-200">
                {t("authority.review_confidence")}
              </h3>
              <ConfidenceBadge
                score={item.confidence_score}
                factors={item.confidence_factors}
                t={t}
              />
            </div>
            {item.confidence_factors && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.confidence_factors).map(([k, v]) => {
                  if (v == null) return null;
                  const num = Number(v);
                  const labelKey =
                    FACTOR_I18N_KEYS[k as keyof ReviewConfidenceFactors];
                  const label = labelKey ? t(labelKey) : k;
                  return (
                    <span
                      key={k}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                        num >= 0
                          ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300"
                          : "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300"
                      )}
                    >
                      <span className="font-mono font-bold">
                        {num >= 0 ? "+" : ""}
                        {num}
                      </span>
                      <span>{label}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-surface-50 p-4 dark:bg-surface-900">
            <MetaField label={t("authority.plate")}>
              <code className="font-mono font-bold text-surface-900 dark:text-white">
                {item.vehicle_plate}
              </code>
            </MetaField>
            <MetaField label={t("authority.type")}>
              <span className="capitalize text-surface-900 dark:text-white">
                {(locale === "es"
                  ? item.vehicle_type?.name_es
                  : item.vehicle_type?.name_en) ??
                  item.vehicle_type?.code ??
                  "—"}
              </span>
            </MetaField>
            <MetaField label={t("authority.status")}>
              <Badge variant="warning" size="sm">
                {item.status}
              </Badge>
            </MetaField>
            <MetaField label={t("authority.review_community_votes")}>
              <span className="text-surface-900 dark:text-white">
                <span className="text-success-600 dark:text-success-400">
                  ✓ {item.verification_count ?? 0}
                </span>
                <span className="mx-1.5 text-surface-300">·</span>
                <span className="text-danger-600 dark:text-danger-400">
                  ✗ {item.rejection_count ?? 0}
                </span>
              </span>
            </MetaField>
          </div>

          {/* Location with map */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-200">
              {t("authority.location")}
            </h3>
            <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
              <iframe
                title="Location"
                src={mapUrl}
                className="h-48 w-full"
                loading="lazy"
              />
              <div className="bg-surface-50 p-3 text-sm dark:bg-surface-900">
                <p className="text-surface-900 dark:text-white">
                  {item.location.address ||
                    item.location.city ||
                    "Unknown location"}
                </p>
                <p className="font-mono text-xs text-surface-500 dark:text-surface-400">
                  {item.location.lat.toFixed(6)},{" "}
                  {item.location.lon.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Reporter */}
          {item.reporter && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-200">
                Reporter
              </h3>
              <div className="flex items-center gap-3 rounded-lg bg-surface-50 p-3 dark:bg-surface-900">
                {item.reporter.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.reporter.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                    {item.reporter.display_name?.charAt(0) ?? "?"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {item.reporter.display_name ?? "Anonymous"}
                  </p>
                  {item.reporter.reputation != null && (
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      Reputation: {item.reporter.reputation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-600/50 dark:bg-amber-900/20">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              {t("authority.review_approve_warning")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-surface-200 pt-4 dark:border-surface-700">
            <Button
              className="flex-1 bg-success-500 text-white hover:bg-success-600"
              onClick={onApprove}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("authority.review_approve")}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-600 dark:text-danger-400 dark:hover:bg-danger-900/20"
              onClick={onReject}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t("authority.review_reject")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function MetaField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-surface-500 dark:text-surface-400">
        {label}
      </p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Approve Dialog                                                     */
/* ------------------------------------------------------------------ */

function ApproveDialog({
  open,
  onOpenChange,
  item,
  t,
  isSubmitting,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item: ReviewQueueItem | null;
  t: (k: string) => string;
  isSubmitting: boolean;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  const handleClose = () => {
    onOpenChange(false);
    setNotes("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setNotes("");
        onOpenChange(o);
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success-500" />
            {t("authority.review_approve")}
            {item && (
              <span className="ml-2 text-sm font-normal text-surface-500">
                {item.short_id}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {item && (
              <span className="font-mono text-xs">{item.vehicle_plate}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-2">
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-600/50 dark:bg-amber-900/20">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              {t("authority.review_approve_warning")}
            </p>
          </div>

          <div>
            <label
              htmlFor="approve-notes"
              className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200"
            >
              {t("authority.review_approve_notes")}
            </label>
            <textarea
              id="approve-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              placeholder="..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            className="bg-success-500 text-white hover:bg-success-600"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => onConfirm(notes.trim())}
          >
            <CheckCircle2 className="mr-1 h-4 w-4" />
            {t("authority.review_approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Reject Dialog                                                      */
/* ------------------------------------------------------------------ */

function RejectDialog({
  open,
  onOpenChange,
  item,
  t,
  isSubmitting,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item: ReviewQueueItem | null;
  t: (k: string) => string;
  isSubmitting: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = reason.trim();
  const valid = trimmed.length > 0;

  const handleClose = () => {
    onOpenChange(false);
    setReason("");
    setTouched(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setReason("");
          setTouched(false);
        }
        onOpenChange(o);
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-danger-500" />
            {t("authority.review_reject")}
            {item && (
              <span className="ml-2 text-sm font-normal text-surface-500">
                {item.short_id}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {item && (
              <span className="font-mono text-xs">{item.vehicle_plate}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-2">
          <div className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3 dark:border-danger-600/50 dark:bg-danger-900/20">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-danger-600 dark:text-danger-400" />
            <p className="text-xs text-danger-800 dark:text-danger-200">
              This is a final rejection. The report will be closed.
            </p>
          </div>

          <div>
            <label
              htmlFor="reject-reason"
              className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200"
            >
              {t("authority.review_reject_reason")}{" "}
              <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => setTouched(true)}
              rows={4}
              className={cn(
                "w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-1 dark:bg-surface-900 dark:text-white",
                !valid && touched
                  ? "border-danger-400 focus:border-danger-500 focus:ring-danger-500"
                  : "border-surface-200 focus:border-amber-500 focus:ring-amber-500 dark:border-surface-700"
              )}
              placeholder="..."
              required
            />
            {!valid && touched && (
              <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                {t("authority.review_reject_reason_required")}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            isLoading={isSubmitting}
            disabled={isSubmitting || !valid}
            onClick={() => {
              setTouched(true);
              if (valid) onConfirm(trimmed);
            }}
          >
            <XCircle className="mr-1 h-4 w-4" />
            {t("authority.review_reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
