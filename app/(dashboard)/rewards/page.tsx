'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import {
  Trophy,
  Star,
  TrendingUp,
  Gift,
  Coins,
  Award,
  Target,
  Crown,
  Zap,
  Medal,
} from 'lucide-react';

// Mock data - replace with API calls
const userStats = {
  totalPoints: 2450,
  currentLevel: 3,
  levelName: 'Vigilante',
  nextLevel: 'Guardian',
  pointsToNextLevel: 550,
  levelProgress: 82,
  totalReports: 47,
  verifiedReports: 38,
  rank: 124,
  totalUsers: 5420,
};

const badges = [
  {
    id: '1',
    name: 'First Report',
    description: 'Submit your first traffic report',
    icon: Star,
    earned: true,
    earnedAt: '2024-01-15',
    rarity: 'common',
  },
  {
    id: '2',
    name: 'Verified Reporter',
    description: 'Get 10 reports verified',
    icon: Award,
    earned: true,
    earnedAt: '2024-02-20',
    rarity: 'uncommon',
  },
  {
    id: '3',
    name: 'Community Guardian',
    description: 'Verify 25 community reports',
    icon: Trophy,
    earned: true,
    earnedAt: '2024-03-10',
    rarity: 'rare',
  },
  {
    id: '4',
    name: 'Speed Demon',
    description: 'Report 5 speeding infractions in one day',
    icon: Zap,
    earned: false,
    progress: 60,
    rarity: 'uncommon',
  },
  {
    id: '5',
    name: 'Night Owl',
    description: 'Submit 10 reports between 10PM and 6AM',
    icon: Target,
    earned: false,
    progress: 30,
    rarity: 'rare',
  },
  {
    id: '6',
    name: 'Legend',
    description: 'Reach 10,000 lifetime points',
    icon: Crown,
    earned: false,
    progress: 24,
    rarity: 'legendary',
  },
];

const levels = [
  { level: 1, name: 'Observer', minPoints: 0, icon: '' },
  { level: 2, name: 'Reporter', minPoints: 500, icon: '' },
  { level: 3, name: 'Vigilante', minPoints: 1500, icon: '' },
  { level: 4, name: 'Guardian', minPoints: 3000, icon: '' },
  { level: 5, name: 'Champion', minPoints: 6000, icon: '' },
  { level: 6, name: 'Hero', minPoints: 10000, icon: '' },
  { level: 7, name: 'Legend', minPoints: 20000, icon: '' },
];

const rarityColors: Record<string, string> = {
  common: 'bg-surface-100 text-surface-700',
  uncommon: 'bg-success-100 text-success-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-amber-100 text-amber-700',
};

export default function RewardsPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'badges' | 'levels'>('overview');
  const { t, tParams } = useTranslation();

  const tabLabels: Record<string, string> = {
    overview: t('rewards.overview'),
    badges: t('rewards.badges'),
    levels: t('rewards.levels'),
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">{t('rewards.title')}</h1>
        <p className="mt-2 text-surface-600 dark:text-surface-400">
          {t('rewards.subtitle')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2">
        {(['overview', 'badges', 'levels'] as const).map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? 'primary' : 'outline'}
            onClick={() => setSelectedTab(tab)}
            className="capitalize"
          >
            {tabLabels[tab]}
          </Button>
        ))}
      </div>

      {selectedTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Points Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Coins className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{t('rewards.total_points')}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {userStats.totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{t('rewards.current_level')}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {userStats.levelName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
                  <Trophy className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{t('rewards.verified_reports')}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {userStats.verifiedReports} / {userStats.totalReports}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Medal className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{t('rewards.global_rank')}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    #{userStats.rank}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t('rewards.level_progress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {t('achievements.level')} {userStats.currentLevel}: {userStats.levelName}
                </span>
                <span className="text-sm text-surface-500">
                  {tParams('rewards.pts_to_next', { points: String(userStats.pointsToNextLevel), next: userStats.nextLevel })}
                </span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-3 dark:bg-surface-700">
                <div
                  className="bg-brand-500 h-3 rounded-full transition-all"
                  style={{ width: `${userStats.levelProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-surface-500">
                {tParams('rewards.pct_complete', { pct: String(userStats.levelProgress) })}
              </p>
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {t('rewards.recent_badges')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {badges
                  .filter((b) => b.earned)
                  .slice(0, 4)
                  .map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 rounded-lg border p-2 bg-surface-50 dark:bg-surface-800"
                    >
                      <badge.icon className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium">{badge.name}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'badges' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={badge.earned ? '' : 'opacity-60'}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      badge.earned
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-surface-100 dark:bg-surface-800'
                    }`}
                  >
                    <badge.icon
                      className={`h-6 w-6 ${
                        badge.earned ? 'text-amber-500' : 'text-surface-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-surface-900 dark:text-white">
                        {badge.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full capitalize ${rarityColors[badge.rarity]}`}
                      >
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                      {badge.description}
                    </p>
                    {badge.earned ? (
                      <p className="mt-2 text-xs text-success-600">
                        {tParams('rewards.earned_on', { date: badge.earnedAt! })}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <div className="w-full bg-surface-200 rounded-full h-1.5 dark:bg-surface-700">
                          <div
                            className="bg-brand-500 h-1.5 rounded-full"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-surface-500">
                          {tParams('rewards.pct_badge_complete', { pct: String(badge.progress) })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'levels' && (
        <div className="space-y-4">
          {levels.map((level) => {
            const isCurrentLevel = level.level === userStats.currentLevel;
            const isUnlocked = userStats.totalPoints >= level.minPoints;

            return (
              <Card
                key={level.level}
                className={`transition-all ${
                  isCurrentLevel
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : isUnlocked
                    ? ''
                    : 'opacity-50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                          : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    >
                      {level.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                          {t('achievements.level')} {level.level}: {level.name}
                        </h3>
                        {isCurrentLevel && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500 text-white">
                            {t('rewards.current')}
                          </span>
                        )}
                        {isUnlocked && !isCurrentLevel && (
                          <span className="text-xs px-2 py-0.5 rounded-full border border-success-300 text-success-600">
                            {t('rewards.unlocked')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {tParams('rewards.points_required', { points: level.minPoints.toLocaleString() })}
                      </p>
                    </div>
                    {isUnlocked && (
                      <div className="text-success-500">
                        <Trophy className="h-6 w-6" />
                      </div>
                    )}
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
