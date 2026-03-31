import { useQuery } from "@tanstack/react-query";
import { USE_MOCK_DATA, API_BASE_URL } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatWithChange {
  value: number;
  change: number; // percentage change from previous period
}

interface DashboardStats {
  totalReports: StatWithChange;
  verified: StatWithChange;
  pending: StatWithChange;
  tokensEarned: StatWithChange;
}

interface ActivityItem {
  id: string;
  type: "report_submitted" | "report_verified" | "report_rejected" | "tokens_earned" | "badge_earned" | "level_up";
  title: string;
  description: string;
  timestamp: string;
}

interface GamificationSummary {
  level: number;
  levelName: string;
  xp: number;
  xpToNext: number;
  streak: number;
  badges: number;
  rank: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockStats: DashboardStats = {
  totalReports: { value: 247, change: 12.5 },
  verified: { value: 183, change: 8.3 },
  pending: { value: 41, change: -5.2 },
  tokensEarned: { value: 1_830, change: 15.7 },
};

const mockActivity: ActivityItem[] = [
  {
    id: "act-1",
    type: "report_verified",
    title: "Report Verified",
    description: "Your report #RPT-1247 for illegal parking on Av. Reforma was verified.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "act-2",
    type: "tokens_earned",
    title: "Tokens Earned",
    description: "You earned 15 MULTA tokens for verified report #RPT-1247.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "act-3",
    type: "badge_earned",
    title: "Badge Earned",
    description: 'You earned the "Sharp Eye" badge for 50 verified reports.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "act-4",
    type: "report_submitted",
    title: "Report Submitted",
    description: "Report #RPT-1248 for running a red light has been submitted for review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "act-5",
    type: "level_up",
    title: "Level Up!",
    description: "You reached Level 12 — Civic Guardian.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "act-6",
    type: "report_rejected",
    title: "Report Rejected",
    description: "Report #RPT-1230 was rejected due to unclear evidence.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

const mockGamification: GamificationSummary = {
  level: 12,
  levelName: "Civic Guardian",
  xp: 3_420,
  xpToNext: 4_000,
  streak: 7,
  badges: 8,
  rank: 42,
};

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

async function fetchDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 500));
    return mockStats;
  }
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

async function fetchRecentActivity(): Promise<ActivityItem[]> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 400));
    return mockActivity;
  }
  const res = await fetch(`${API_BASE_URL}/dashboard/activity`);
  if (!res.ok) throw new Error("Failed to fetch recent activity");
  return res.json();
}

async function fetchGamificationSummary(): Promise<GamificationSummary> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 300));
    return mockGamification;
  }
  const res = await fetch(`${API_BASE_URL}/dashboard/gamification`);
  if (!res.ok) throw new Error("Failed to fetch gamification summary");
  return res.json();
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRecentActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ["dashboard", "activity"],
    queryFn: fetchRecentActivity,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGamificationSummary() {
  return useQuery<GamificationSummary>({
    queryKey: ["dashboard", "gamification"],
    queryFn: fetchGamificationSummary,
    staleTime: 1000 * 60 * 5,
  });
}
