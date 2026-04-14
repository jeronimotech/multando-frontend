'use client';

import { useQuery } from '@tanstack/react-query';
import { useDataMode } from '@/hooks/use-api-base-url';

/**
 * Public transparency hooks.
 *
 * All endpoints are public (no auth) and honour the user-selected data
 * mode (production vs sandbox) via `useDataMode`.
 */

async function fetchPublic<T>(baseUrl: string, path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const error = isJson
      ? await res.json()
      : { message: res.statusText || 'An error occurred', statusCode: res.status };
    throw error;
  }
  return res.json() as Promise<T>;
}

export interface PublicStatsCity {
  name: string;
  reports: number;
}

export interface PublicStatsMonth {
  month: string; // YYYY-MM
  count: number;
}

export interface PublicStats {
  total_reports: number;
  reports_this_month: number;
  authority_approval_rate: number;
  authority_rejection_rate: number;
  pending_or_review: number;
  reports_by_category: Record<string, number>;
  reports_by_status: Record<string, number>;
  top_cities: PublicStatsCity[];
  reports_last_12_months: PublicStatsMonth[];
  generated_at: string;
}

export function usePublicStats() {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: ['transparency', 'stats', mode] as const,
    queryFn: () => fetchPublic<PublicStats>(baseUrl, '/public/stats'),
    staleTime: 1000 * 60 * 2,
  });
}

export interface ScoringFactor {
  name: string;
  points: number | string;
  description: string;
}

export interface ScoringRules {
  baseline: number;
  factors: ScoringFactor[];
  min: number;
  max: number;
  notes?: string;
}

export function useScoringRules() {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: ['transparency', 'scoring-rules', mode] as const,
    queryFn: () => fetchPublic<ScoringRules>(baseUrl, '/public/scoring-rules'),
    staleTime: 1000 * 60 * 10,
  });
}

export interface RewardAction {
  action: string;
  description: string;
  points: number;
  multa: number;
}

export interface RewardRules {
  currency: string;
  actions: RewardAction[];
  notes?: string;
}

export function useRewardRules() {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: ['transparency', 'reward-rules', mode] as const,
    queryFn: () => fetchPublic<RewardRules>(baseUrl, '/public/reward-rules'),
    staleTime: 1000 * 60 * 10,
  });
}

export interface AuthorityPublicProfile {
  id: number;
  name: string | null;
  code: string | null;
  city: string | null;
  country: string | null;
  validation_count: number;
  rejection_count: number;
  average_processing_time_hours: number | null;
  active_since: string | null;
}

export function useAuthorityPublicProfile(authorityId: number | null | undefined) {
  const { baseUrl, mode } = useDataMode();
  return useQuery({
    queryKey: ['transparency', 'authority-public', authorityId, mode] as const,
    queryFn: () =>
      fetchPublic<AuthorityPublicProfile>(
        baseUrl,
        `/authorities/${authorityId}/public`
      ),
    enabled: authorityId !== null && authorityId !== undefined,
    staleTime: 1000 * 60 * 5,
  });
}
