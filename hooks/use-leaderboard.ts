'use client';

import { useQuery } from '@tanstack/react-query';
import api, { authorityApi } from '@/lib/api';

export type LeaderboardPeriod = 'all' | 'month' | 'week';

export interface PublicPlateLeaderboardEntry {
  plate_masked: string;
  verified_reports: number;
  last_reported_at: string;
  top_infraction: string | null;
  cities: string[];
}

export interface AuthorityPlateLeaderboardLocation {
  lat: number;
  lon: number;
  address?: string | null;
  city?: string | null;
}

export interface AuthorityPlateLeaderboardEntry {
  plate: string;
  verified_reports: number;
  last_reported_at: string;
  top_infraction: string | null;
  last_location?: AuthorityPlateLeaderboardLocation | null;
}

export interface LeaderboardFilters {
  cityId?: string | number | null;
  period?: LeaderboardPeriod;
  limit?: number;
}

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  publicPlates: (filters: LeaderboardFilters) =>
    [...leaderboardKeys.all, 'plates', 'public', filters] as const,
  authorityPlates: (filters: LeaderboardFilters) =>
    [...leaderboardKeys.all, 'plates', 'authority', filters] as const,
};

function buildQuery(filters: LeaderboardFilters): string {
  const params = new URLSearchParams();
  if (filters.cityId !== undefined && filters.cityId !== null && filters.cityId !== '') {
    params.append('city_id', String(filters.cityId));
  }
  if (filters.period) {
    params.append('period', filters.period);
  }
  if (filters.limit) {
    params.append('limit', String(filters.limit));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Public plate leaderboard — returns masked plates + verified report counts.
 * No authentication required.
 */
export function usePlateLeaderboard(filters: LeaderboardFilters = {}) {
  const normalized: LeaderboardFilters = {
    cityId: filters.cityId ?? null,
    period: filters.period ?? 'all',
    limit: filters.limit ?? 20,
  };

  return useQuery({
    queryKey: leaderboardKeys.publicPlates(normalized),
    queryFn: async () => {
      const qs = buildQuery(normalized);
      const data = await api.get<PublicPlateLeaderboardEntry[]>(`/leaderboard/plates${qs}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Authority plate leaderboard — returns full plate numbers + exact locations.
 * Requires authority role (uses authority API key auth).
 */
export function useAuthorityPlateLeaderboard(filters: LeaderboardFilters = {}) {
  const normalized: LeaderboardFilters = {
    cityId: filters.cityId ?? null,
    period: filters.period ?? 'all',
    limit: filters.limit ?? 50,
  };

  return useQuery({
    queryKey: leaderboardKeys.authorityPlates(normalized),
    queryFn: async () => {
      const qs = buildQuery(normalized);
      const data = await authorityApi.get<AuthorityPlateLeaderboardEntry[]>(
        `/leaderboard/plates/authority${qs}`
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 2,
  });
}
