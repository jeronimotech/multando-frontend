"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api-client";

export type SDMSubmissionStatus =
  | "pending"
  | "uploading_evidence"
  | "ready_for_manual"
  | "submitted"
  | "failed";

export interface SDMSubmission {
  id: string;
  report_id: string;
  status: SDMSubmissionStatus;
  prefill_url: string | null;
  drive_evidence_links: string[];
  submitted_at: string | null;
  error_message: string | null;
  attempts: number;
  created_at: string;
  updated_at: string;
}

export interface SDMPrefill {
  prefill_url: string;
  report_id: string;
}

export const sdmKeys = {
  all: ["sdm"] as const,
  submission: (reportId: string) => [...sdmKeys.all, "submission", reportId] as const,
};

/**
 * Fetch the SDM submission record for a report.
 * Returns null if no submission exists (404 from backend).
 */
export function useSDMSubmission(reportId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: sdmKeys.submission(reportId ?? ""),
    queryFn: async (): Promise<SDMSubmission | null> => {
      if (!reportId) return null;
      try {
        return await apiGet<SDMSubmission>(`/reports/${reportId}/sdm-submission`);
      } catch (err) {
        // Backend returns 404 when no submission exists yet. The api-client
        // surfaces errors as plain Error instances with the FastAPI detail
        // text in the message — match either common 404 signal.
        const msg = err instanceof Error ? err.message.toLowerCase() : "";
        if (msg.includes("not found") || msg.includes("no sdm submission")) {
          return null;
        }
        throw err;
      }
    },
    enabled: Boolean(reportId) && enabled,
    retry: false,
  });
}

/**
 * Generate a fresh pre-fill URL for a report (always Bogota-only).
 */
export function useSDMPrefill() {
  return useMutation({
    mutationFn: async (reportId: string): Promise<SDMPrefill> => {
      return await apiGet<SDMPrefill>(`/reports/${reportId}/sdm-prefill`);
    },
  });
}

/**
 * Manually trigger an SDM submission (admin only).
 * Re-runs evidence upload + pre-fill URL generation via Celery.
 */
export function useTriggerSDMSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: string): Promise<SDMSubmission> => {
      return await apiPost<SDMSubmission>(`/reports/${reportId}/sdm-submit`);
    },
    onSuccess: (_data, reportId) => {
      queryClient.invalidateQueries({ queryKey: sdmKeys.submission(reportId) });
    },
  });
}
