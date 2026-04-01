'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Report,
  ReportSummary,
  ReportMarker,
  ReportFilters,
  PaginatedResponse,
  CreateReportRequest,
  VerificationVote,
} from '@/types/report';

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: ReportFilters) => [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  markers: (filters?: ReportFilters) => [...reportKeys.all, 'markers', filters] as const,
  byPlate: (plate: string) => [...reportKeys.all, 'plate', plate] as const,
  pending: () => [...reportKeys.all, 'pending'] as const,
  myReports: () => [...reportKeys.all, 'my-reports'] as const,
};

// Mock data for development
const MOCK_MARKERS: ReportMarker[] = [
  {
    id: '1',
    shortId: 'RPT-001',
    latitude: 18.4861,
    longitude: -69.9312,
    infraction: 'Illegal Parking',
    vehiclePlate: 'A123456',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    shortId: 'RPT-002',
    latitude: 18.4725,
    longitude: -69.8909,
    infraction: 'Running Red Light',
    vehiclePlate: 'B789012',
    status: 'verified',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    shortId: 'RPT-003',
    latitude: 18.5001,
    longitude: -69.9452,
    infraction: 'Speeding',
    vehiclePlate: 'C345678',
    status: 'rejected',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    shortId: 'RPT-004',
    latitude: 19.4517,
    longitude: -70.6970,
    infraction: 'Double Parking',
    vehiclePlate: 'D901234',
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    shortId: 'RPT-005',
    latitude: 18.4508,
    longitude: -69.9666,
    infraction: 'No Seat Belt',
    vehiclePlate: 'E567890',
    status: 'verified',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    shortId: 'RPT-006',
    latitude: 18.4650,
    longitude: -69.9150,
    infraction: 'Using Phone While Driving',
    vehiclePlate: 'F123789',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

const MOCK_REPORTS: ReportSummary[] = MOCK_MARKERS.map((marker) => ({
  id: marker.id,
  shortId: marker.shortId,
  vehiclePlate: marker.vehiclePlate,
  vehicleType: 'car' as const,
  infraction: marker.infraction,
  infractionCode: `INF-${marker.id.padStart(3, '0')}`,
  status: marker.status,
  location: {
    latitude: marker.latitude,
    longitude: marker.longitude,
    city: marker.latitude > 19 ? 'Santiago' : 'Santo Domingo',
    state: marker.latitude > 19 ? 'Santiago' : 'Distrito Nacional',
    country: 'Dominican Republic',
  },
  thumbnailUrl: `https://picsum.photos/seed/${marker.id}/400/300`,
  createdAt: marker.createdAt,
}));

// Use mock data flag - set to true for development
import { USE_MOCK_DATA } from '@/lib/config';

/**
 * Hook to fetch paginated reports with filters
 */
export function useReports(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.list(filters || {}),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filtered = [...MOCK_REPORTS];

        // Apply filters
        if (filters?.status) {
          const statuses = Array.isArray(filters.status)
            ? filters.status
            : [filters.status];
          filtered = filtered.filter((r) => statuses.includes(r.status));
        }

        if (filters?.city) {
          filtered = filtered.filter(
            (r) => r.location.city?.toLowerCase() === filters.city?.toLowerCase()
          );
        }

        // Pagination
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = filtered.slice(start, end);

        return {
          data,
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit),
            hasMore: end < filtered.length,
          },
        } as PaginatedResponse<ReportSummary>;
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, String(v)));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      const raw = await api.get<any>(`/reports?${params.toString()}`);
      // Backend returns { items, total, page, page_size }
      // Frontend expects { data, pagination }
      const items = raw.items || raw.data || [];
      const total = raw.total || 0;
      const page = raw.page || 1;
      const pageSize = raw.page_size || filters?.limit || 10;
      return {
        data: items,
        pagination: {
          page,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasMore: page * pageSize < total,
        },
      } as PaginatedResponse<ReportSummary>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single report by ID
 */
export function useReport(id: string) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const summary = MOCK_REPORTS.find((r) => r.id === id);
        if (!summary) throw new Error('Report not found');

        // Return full report detail
        return {
          ...summary,
          vehicleColor: 'Black',
          vehicleMake: 'Toyota',
          vehicleModel: 'Corolla',
          infraction: {
            id: summary.infractionCode,
            code: summary.infractionCode,
            name: summary.infraction,
            description: `Traffic infraction: ${summary.infraction}`,
            fineAmount: 5000,
            points: 3,
            category: 'Traffic',
          },
          description: 'Infraction observed and documented.',
          evidence: [
            {
              id: `ev-${id}-1`,
              type: 'image' as const,
              url: `https://picsum.photos/seed/${id}/800/600`,
              thumbnailUrl: summary.thumbnailUrl,
              uploadedAt: summary.createdAt,
            },
          ],
          reporter: {
            id: 'user-1',
            displayName: 'Anonymous Reporter',
            totalReports: 15,
            verifiedReports: 10,
          },
          verifications: {
            upvotes: 5,
            downvotes: 1,
            userVote: null,
          },
          createdAt: summary.createdAt,
          updatedAt: summary.createdAt,
        } as Report;
      }

      return api.get<Report>(`/reports/${id}`);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch map markers
 */
export function useReportMarkers(filters?: ReportFilters) {
  return useQuery({
    queryKey: reportKeys.markers(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        let filtered = [...MOCK_MARKERS];

        if (filters?.status) {
          const statuses = Array.isArray(filters.status)
            ? filters.status
            : [filters.status];
          filtered = filtered.filter((r) => statuses.includes(r.status));
        }

        return filtered;
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, String(v)));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      return api.get<ReportMarker[]>(`/reports/markers?${params.toString()}`);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch reports by vehicle plate
 */
export function useReportsByPlate(plate: string) {
  return useQuery({
    queryKey: reportKeys.byPlate(plate),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return MOCK_REPORTS.filter(
          (r) => r.vehiclePlate.toLowerCase() === plate.toLowerCase()
        );
      }

      return api.get<ReportSummary[]>(`/reports/plate/${encodeURIComponent(plate)}`);
    },
    enabled: !!plate && plate.length >= 3,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch reports pending verification (for community verification)
 */
export function usePendingVerification() {
  return useQuery({
    queryKey: reportKeys.pending(),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return MOCK_REPORTS.filter((r) => r.status === 'pending');
      }

      return api.get<ReportSummary[]>('/reports/pending-verification');
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook to fetch current user's reports
 */
export function useMyReports(filters?: Omit<ReportFilters, 'userId'>) {
  return useQuery({
    queryKey: reportKeys.myReports(),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
          data: MOCK_REPORTS.slice(0, 3),
          pagination: {
            page: 1,
            limit: 10,
            total: 3,
            totalPages: 1,
            hasMore: false,
          },
        } as PaginatedResponse<ReportSummary>;
      }

      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      return api.get<PaginatedResponse<ReportSummary>>(
        `/reports/my-reports?${params.toString()}`
      );
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to create a new report
 */
export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReportRequest) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          id: String(MOCK_REPORTS.length + 1),
          shortId: `RPT-${String(MOCK_REPORTS.length + 1).padStart(3, '0')}`,
          ...data,
        };
      }

      return api.post<Report>('/reports', data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

/**
 * Hook to vote on a report verification
 */
export function useVerificationVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerificationVote) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true };
      }

      return api.post(`/reports/${data.reportId}/verify`, {
        vote: data.vote,
        reason: data.reason,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific report
      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(variables.reportId),
      });
      // Also invalidate the pending list
      queryClient.invalidateQueries({ queryKey: reportKeys.pending() });
    },
  });
}

// Export mock data for testing/development
export const mockData = {
  markers: MOCK_MARKERS,
  reports: MOCK_REPORTS,
};
