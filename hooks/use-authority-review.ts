"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityApi } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ReviewStatus = "authority_review" | "community_verified";

export interface ReviewQueueFilters {
  status?: ReviewStatus;
  cityId?: number;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export interface ReviewVehicleType {
  id?: number;
  code?: string;
  name_en?: string;
  name_es?: string;
}

export interface ReviewInfraction {
  id?: number;
  code?: string;
  name_en?: string;
  name_es?: string;
  severity?: "low" | "medium" | "high" | "critical" | string;
}

export interface ReviewLocation {
  lat: number;
  lon: number;
  address?: string | null;
  city?: string | null;
}

export interface ReviewReporter {
  id?: string;
  display_name?: string;
  avatar_url?: string | null;
  reputation?: number;
}

export interface ReviewEvidence {
  url: string;
  mime_type?: string;
  type?: string;
}

export interface ReviewConfidenceFactors {
  signed_evidence?: number;
  has_photo?: number;
  valid_gps?: number;
  valid_plate?: number;
  reporter_reputation?: number;
  community_verifications?: number;
  community_rejections?: number;
  [k: string]: number | undefined;
}

export interface ReviewQueueItem {
  id: string;
  short_id: string;
  status: ReviewStatus | string;
  vehicle_plate: string;
  vehicle_type?: ReviewVehicleType;
  infraction?: ReviewInfraction;
  location: ReviewLocation;
  created_at: string;
  incident_datetime?: string;
  reporter?: ReviewReporter;
  evidences?: ReviewEvidence[];
  confidence_score: number;
  confidence_factors?: ReviewConfidenceFactors;
  verification_count?: number;
  rejection_count?: number;
}

export interface ReviewQueueResponse {
  data: ReviewQueueItem[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
}

/* ------------------------------------------------------------------ */
/*  Query keys                                                         */
/* ------------------------------------------------------------------ */

export const reviewKeys = {
  all: ["authority-review"] as const,
  queue: (filters?: ReviewQueueFilters) =>
    [...reviewKeys.all, "queue", filters ?? {}] as const,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildQuery(filters?: ReviewQueueFilters): string {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.cityId != null) params.append("city_id", String(filters.cityId));
  if (filters?.page != null) params.append("page", String(filters.page));
  if (filters?.pageSize != null)
    params.append("page_size", String(filters.pageSize));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/**
 * Fetch the authority review queue.
 * Returns reports sorted by confidence_score DESC (server-side).
 * Auto-refetches every 60 seconds.
 */
export function useReviewQueue(filters?: ReviewQueueFilters) {
  const { enabled, ...apiFilters } = filters ?? {};
  return useQuery({
    queryKey: reviewKeys.queue(apiFilters),
    enabled: enabled ?? true,
    queryFn: async () => {
      const qs = buildQuery(apiFilters);
      const res = await authorityApi.get<
        ReviewQueueResponse | { data?: ReviewQueueItem[] }
      >(`/authority/review/queue${qs}`);

      // Normalize in case server returns a plain list or a different envelope
      if (Array.isArray((res as { data?: unknown }).data)) {
        const list = (res as ReviewQueueResponse).data;
        const pagination =
          (res as ReviewQueueResponse).pagination ?? {
            page: filters?.page ?? 1,
            page_size: filters?.pageSize ?? list.length,
            total: list.length,
            total_pages: 1,
            has_more: false,
          };
        return { data: list, pagination } as ReviewQueueResponse;
      }

      // Fallback if endpoint returned a bare array
      const arr = (res as unknown as ReviewQueueItem[]) ?? [];
      return {
        data: arr,
        pagination: {
          page: filters?.page ?? 1,
          page_size: filters?.pageSize ?? arr.length,
          total: arr.length,
          total_pages: 1,
          has_more: false,
        },
      } satisfies ReviewQueueResponse;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

/**
 * Approve a report (validates it legally, triggers comparendo generation).
 */
export function useApproveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      notes,
    }: {
      reportId: string;
      notes?: string;
    }) => {
      return authorityApi.post(`/authority/review/${reportId}/approve`, {
        notes: notes ?? "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

/**
 * Reject a report (final rejection — requires a reason).
 */
export function useRejectReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      reason,
    }: {
      reportId: string;
      reason: string;
    }) => {
      return authorityApi.post(`/authority/review/${reportId}/reject`, {
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

/**
 * Convenience hook: returns just the pending count for badge display.
 * Pass `enabled=false` to skip fetching (e.g. when not authenticated).
 */
export function useReviewQueueCount(opts?: {
  status?: ReviewStatus;
  enabled?: boolean;
}) {
  const { data } = useReviewQueue({
    status: opts?.status,
    pageSize: 1,
    page: 1,
    enabled: opts?.enabled ?? true,
  });
  return data?.pagination?.total ?? 0;
}
