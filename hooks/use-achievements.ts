import { useQuery } from "@tanstack/react-query";
import { USE_MOCK_DATA, API_BASE_URL } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt: string | null;
  category: "reporting" | "verification" | "streak" | "community" | "special";
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  level: number;
  totalReports: number;
  verifiedReports: number;
  tokensEarned: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalPages: number;
  currentPage: number;
}

interface UserLevel {
  level: number;
  levelName: string;
  xp: number;
  xpToNext: number;
  xpForCurrentLevel: number;
  progressPercent: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "First Report",
    description: "Submit your first infraction report.",
    icon: "camera",
    earned: true,
    earnedAt: "2025-11-15T10:00:00Z",
    category: "reporting",
  },
  {
    id: "badge-2",
    name: "Sharp Eye",
    description: "Have 50 reports verified by authorities.",
    icon: "eye",
    earned: true,
    earnedAt: "2026-02-20T14:30:00Z",
    category: "verification",
  },
  {
    id: "badge-3",
    name: "Week Warrior",
    description: "Maintain a 7-day reporting streak.",
    icon: "flame",
    earned: true,
    earnedAt: "2026-03-10T09:00:00Z",
    category: "streak",
  },
  {
    id: "badge-4",
    name: "Century Reporter",
    description: "Submit 100 infraction reports.",
    icon: "target",
    earned: true,
    earnedAt: "2026-01-05T16:45:00Z",
    category: "reporting",
  },
  {
    id: "badge-5",
    name: "Double Century",
    description: "Submit 200 infraction reports.",
    icon: "award",
    earned: true,
    earnedAt: "2026-03-25T11:20:00Z",
    category: "reporting",
  },
  {
    id: "badge-6",
    name: "Token Collector",
    description: "Earn 1000 MULTA tokens.",
    icon: "coins",
    earned: true,
    earnedAt: "2026-02-01T08:15:00Z",
    category: "community",
  },
  {
    id: "badge-7",
    name: "Community Pillar",
    description: "Reach the top 50 on the leaderboard.",
    icon: "trophy",
    earned: true,
    earnedAt: "2026-03-15T20:00:00Z",
    category: "community",
  },
  {
    id: "badge-8",
    name: "Iron Streak",
    description: "Maintain a 30-day reporting streak.",
    icon: "zap",
    earned: true,
    earnedAt: "2026-03-28T07:00:00Z",
    category: "streak",
  },
  {
    id: "badge-9",
    name: "Perfectionist",
    description: "Have 100 consecutive reports verified without rejection.",
    icon: "check-circle",
    earned: false,
    earnedAt: null,
    category: "verification",
  },
  {
    id: "badge-10",
    name: "Night Owl",
    description: "Submit 25 reports between midnight and 5 AM.",
    icon: "moon",
    earned: false,
    earnedAt: null,
    category: "special",
  },
  {
    id: "badge-11",
    name: "Half K",
    description: "Submit 500 infraction reports.",
    icon: "star",
    earned: false,
    earnedAt: null,
    category: "reporting",
  },
  {
    id: "badge-12",
    name: "Top 10",
    description: "Reach the top 10 on the leaderboard.",
    icon: "crown",
    earned: false,
    earnedAt: null,
    category: "community",
  },
];

const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 25 }, (_, i) => ({
  rank: i + 1,
  userId: `user-${i + 1}`,
  username: [
    "CivicHero99", "ReportQueen", "StreetWatcher", "MULTAKing",
    "InfractionHunter", "SafeStreets", "CityGuardian", "TrafficEye",
    "JusticeRider", "ReportMaster", "UrbanPatrol", "RuleKeeper",
    "EagleEye", "SpeedTrap", "SidewalkHero", "ParkingPro",
    "SignalWatch", "LaneGuard", "CrosswalkChamp", "ZoneWarden",
    "MeterMaid", "CitySheriff", "BlockWatch", "InfractionPro",
    "StreetJustice",
  ][i],
  avatar: null,
  level: Math.max(1, 25 - i + Math.floor(Math.random() * 3)),
  totalReports: Math.floor(800 - i * 25 + Math.random() * 50),
  verifiedReports: Math.floor(600 - i * 20 + Math.random() * 40),
  tokensEarned: Math.floor(6000 - i * 200 + Math.random() * 300),
}));

const mockUserLevel: UserLevel = {
  level: 12,
  levelName: "Civic Guardian",
  xp: 3_420,
  xpToNext: 4_000,
  xpForCurrentLevel: 3_000,
  progressPercent: 42,
};

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

async function fetchBadges(): Promise<Badge[]> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 400));
    return mockBadges;
  }
  const res = await fetch(`${API_BASE_URL}/achievements/badges`);
  if (!res.ok) throw new Error("Failed to fetch badges");
  return res.json();
}

async function fetchLeaderboard(page: number): Promise<LeaderboardResponse> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 500));
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    return {
      entries: mockLeaderboard.slice(start, start + pageSize),
      totalPages: Math.ceil(mockLeaderboard.length / pageSize),
      currentPage: page,
    };
  }
  const res = await fetch(`${API_BASE_URL}/achievements/leaderboard?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

async function fetchUserLevel(): Promise<UserLevel> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 300));
    return mockUserLevel;
  }
  const res = await fetch(`${API_BASE_URL}/achievements/level`);
  if (!res.ok) throw new Error("Failed to fetch user level");
  return res.json();
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useBadges() {
  return useQuery<Badge[]>({
    queryKey: ["achievements", "badges"],
    queryFn: fetchBadges,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLeaderboard(page = 1) {
  return useQuery<LeaderboardResponse>({
    queryKey: ["achievements", "leaderboard", page],
    queryFn: () => fetchLeaderboard(page),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUserLevel() {
  return useQuery<UserLevel>({
    queryKey: ["achievements", "level"],
    queryFn: fetchUserLevel,
    staleTime: 1000 * 60 * 5,
  });
}
