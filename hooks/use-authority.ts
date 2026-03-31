"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authorityApi } from "@/lib/api";
import type {
  ReportFilters,
  ReportSummary,
  PaginatedResponse,
} from "@/types/report";

// Types
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AuthorityAnalytics {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  rejectedReports: number;
  todayReports: number;
  averageDaily: number;
  verificationRate: number;
  peakHour: string;
  dailyReports: { date: string; count: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  topInfractions: { infraction: string; count: number }[];
  hourlyDistribution: { hour: number; day: number; count: number }[];
}

export interface HeatmapData {
  locations: { lat: number; lng: number; intensity: number }[];
}

// Query keys
export const authorityKeys = {
  all: ["authority"] as const,
  reports: () => [...authorityKeys.all, "reports"] as const,
  reportsList: (filters: ReportFilters) => [...authorityKeys.reports(), filters] as const,
  analytics: (dateRange: DateRange) => [...authorityKeys.all, "analytics", dateRange] as const,
  heatmap: (dateRange: DateRange) => [...authorityKeys.all, "heatmap", dateRange] as const,
};

// Mock data for development
const generateMockAnalytics = (dateRange: DateRange): AuthorityAnalytics => {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const dailyReports = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50) + 10,
    };
  });

  const totalReports = dailyReports.reduce((sum, d) => sum + d.count, 0);
  const pendingReports = Math.floor(totalReports * 0.3);
  const verifiedReports = Math.floor(totalReports * 0.6);
  const rejectedReports = totalReports - pendingReports - verifiedReports;

  return {
    totalReports,
    pendingReports,
    verifiedReports,
    rejectedReports,
    todayReports: Math.floor(Math.random() * 20) + 5,
    averageDaily: Math.round(totalReports / days),
    verificationRate: Math.round((verifiedReports / totalReports) * 100),
    peakHour: "9:00 AM - 10:00 AM",
    dailyReports,
    statusDistribution: [
      { status: "pending", count: pendingReports, percentage: Math.round((pendingReports / totalReports) * 100) },
      { status: "verified", count: verifiedReports, percentage: Math.round((verifiedReports / totalReports) * 100) },
      { status: "rejected", count: rejectedReports, percentage: Math.round((rejectedReports / totalReports) * 100) },
    ],
    topInfractions: [
      { infraction: "Illegal Parking", count: Math.floor(totalReports * 0.25) },
      { infraction: "Speeding", count: Math.floor(totalReports * 0.20) },
      { infraction: "Running Red Light", count: Math.floor(totalReports * 0.15) },
      { infraction: "Double Parking", count: Math.floor(totalReports * 0.12) },
      { infraction: "No Seat Belt", count: Math.floor(totalReports * 0.10) },
      { infraction: "Phone While Driving", count: Math.floor(totalReports * 0.08) },
      { infraction: "No License Plate", count: Math.floor(totalReports * 0.05) },
      { infraction: "Other", count: Math.floor(totalReports * 0.05) },
    ],
    hourlyDistribution: generateHourlyDistribution(),
  };
};

const generateHourlyDistribution = () => {
  const data: { hour: number; day: number; count: number }[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Higher counts during rush hours and weekdays
      let baseCount = 0;
      if (hour >= 7 && hour <= 9) baseCount = 15; // Morning rush
      else if (hour >= 17 && hour <= 19) baseCount = 20; // Evening rush
      else if (hour >= 10 && hour <= 16) baseCount = 8; // Daytime
      else if (hour >= 6 && hour <= 22) baseCount = 5; // Other waking hours
      else baseCount = 2; // Night time

      // Weekend reduction
      if (day >= 5) baseCount = Math.floor(baseCount * 0.6);

      data.push({
        hour,
        day,
        count: baseCount + Math.floor(Math.random() * 5),
      });
    }
  }
  return data;
};

const generateMockHeatmap = (): HeatmapData => {
  // Generate random points around Santo Domingo
  const centerLat = 18.4861;
  const centerLng = -69.9312;
  const locations: { lat: number; lng: number; intensity: number }[] = [];

  for (let i = 0; i < 100; i++) {
    locations.push({
      lat: centerLat + (Math.random() - 0.5) * 0.1,
      lng: centerLng + (Math.random() - 0.5) * 0.15,
      intensity: Math.random() * 0.8 + 0.2,
    });
  }

  return { locations };
};

const MOCK_REPORTS: ReportSummary[] = [
  {
    id: "1",
    shortId: "RPT-001",
    vehiclePlate: "A123456",
    vehicleType: "car",
    infraction: "Illegal Parking",
    infractionCode: "INF-001",
    status: "pending",
    location: { latitude: 18.4861, longitude: -69.9312, city: "Santo Domingo", state: "DN", country: "DR" },
    thumbnailUrl: "https://picsum.photos/seed/1/400/300",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    shortId: "RPT-002",
    vehiclePlate: "B789012",
    vehicleType: "motorcycle",
    infraction: "Running Red Light",
    infractionCode: "INF-002",
    status: "verified",
    location: { latitude: 18.4725, longitude: -69.8909, city: "Santo Domingo", state: "DN", country: "DR" },
    thumbnailUrl: "https://picsum.photos/seed/2/400/300",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    shortId: "RPT-003",
    vehiclePlate: "C345678",
    vehicleType: "car",
    infraction: "Speeding",
    infractionCode: "INF-003",
    status: "rejected",
    location: { latitude: 18.5001, longitude: -69.9452, city: "Santo Domingo", state: "DN", country: "DR" },
    thumbnailUrl: "https://picsum.photos/seed/3/400/300",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    shortId: "RPT-004",
    vehiclePlate: "D901234",
    vehicleType: "truck",
    infraction: "Double Parking",
    infractionCode: "INF-004",
    status: "pending",
    location: { latitude: 19.4517, longitude: -70.6970, city: "Santiago", state: "Santiago", country: "DR" },
    thumbnailUrl: "https://picsum.photos/seed/4/400/300",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    shortId: "RPT-005",
    vehiclePlate: "E567890",
    vehicleType: "car",
    infraction: "No Seat Belt",
    infractionCode: "INF-005",
    status: "verified",
    location: { latitude: 18.4508, longitude: -69.9666, city: "Santo Domingo", state: "DN", country: "DR" },
    thumbnailUrl: "https://picsum.photos/seed/5/400/300",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    shortId: "RPT-006",
    vehiclePlate: "F123789",
    vehicleType: "car",
    infraction: "Phone While Driving",
    infractionCode: "INF-006",
    status: "pending",
    location: { latitude: 18.4650, longitude: -69.9150, city: "Santo Domingo", state: "DN", country: "DR" },
    thumbnailUrl: "https://picsum.photos/seed/6/400/300",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Use mock data flag - set to true for development
import { USE_MOCK_DATA } from '@/lib/config';

/**
 * Hook to fetch authority reports with filters
 */
export function useAuthorityReports(filters: ReportFilters) {
  return useQuery({
    queryKey: authorityKeys.reportsList(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filtered = [...MOCK_REPORTS];

        // Apply filters
        if (filters.status) {
          const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
          filtered = filtered.filter((r) => statuses.includes(r.status));
        }

        if (filters.infractionCode && filters.infractionCode !== "all") {
          filtered = filtered.filter((r) =>
            r.infraction.toLowerCase().includes((filters.infractionCode as string).replace("-", " "))
          );
        }

        // Sort
        if (filters.sortBy === "createdAt") {
          filtered.sort((a, b) => {
            const order = filters.sortOrder === "asc" ? 1 : -1;
            return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          });
        }

        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = filtered.slice(start, end);

        // Generate more mock data for demonstration
        const totalItems = 156; // Simulated total

        return {
          data,
          pagination: {
            page,
            limit,
            total: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            hasMore: end < totalItems,
          },
        } as PaginatedResponse<ReportSummary>;
      }

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });

      return authorityApi.get<PaginatedResponse<ReportSummary>>(
        `/authority/reports?${params.toString()}`
      );
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch authority analytics data
 */
export function useAuthorityAnalytics(dateRange: DateRange) {
  return useQuery({
    queryKey: authorityKeys.analytics(dateRange),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return generateMockAnalytics(dateRange);
      }

      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      return authorityApi.get<AuthorityAnalytics>(
        `/authority/analytics?${params.toString()}`
      );
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch heatmap data for authority
 */
export function useAuthorityHeatmap(dateRange: DateRange) {
  return useQuery({
    queryKey: authorityKeys.heatmap(dateRange),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return generateMockHeatmap();
      }

      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      return authorityApi.get<HeatmapData>(
        `/authority/heatmap?${params.toString()}`
      );
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to export reports to CSV
 */
export function useExportReports() {
  return useMutation({
    mutationFn: async (filters: ReportFilters) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate CSV content
        const headers = ["ID", "Plate", "Vehicle Type", "Infraction", "Status", "Location", "Date"];
        const rows = MOCK_REPORTS.map((r) => [
          r.shortId,
          r.vehiclePlate,
          r.vehicleType,
          r.infraction,
          r.status,
          r.location.city || "",
          new Date(r.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `reports-export-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);

        return { success: true };
      }

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      const response = await authorityApi.get<Blob>(
        `/authority/reports/export?${params.toString()}`,
        { responseType: "blob" }
      );

      // Download the file
      const blob = new Blob([response], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `reports-export-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      return { success: true };
    },
  });
}

/**
 * Hook to verify a report
 */
export function useVerifyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true };
      }

      return authorityApi.post(`/authority/reports/${reportId}/verify`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorityKeys.reports() });
    },
  });
}

/**
 * Hook to reject a report
 */
export function useRejectReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, reason }: { reportId: string; reason: string }) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true };
      }

      return authorityApi.post(`/authority/reports/${reportId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorityKeys.reports() });
    },
  });
}
