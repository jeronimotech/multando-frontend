'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useBadges, useLeaderboard, useUserLevel } from '@/hooks/use-achievements';
import { useTranslation } from '@/hooks/use-translation';
import {
  Trophy,
  Star,
  Shield,
  Camera,
  Eye,
  Flame,
  Crown,
  Target,
  Zap,
  Users,
  MapPin,
  Award,
  Lock,
  Medal,
  CheckCircle2,
} from 'lucide-react';

// Badge definitions
const BADGES = [
  { id: 'first-report', nameKey: 'achievements.badge_first_reporter', descKey: 'achievements.badge_first_reporter_desc', icon: Camera, rarity: 'common', earned: true, earnedAt: '2024-01-15' },
  { id: 'five-reports', nameKey: 'achievements.badge_active_citizen', descKey: 'achievements.badge_active_citizen_desc', icon: Star, rarity: 'common', earned: true, earnedAt: '2024-02-03' },
  { id: 'ten-verified', nameKey: 'achievements.badge_trusted_source', descKey: 'achievements.badge_trusted_source_desc', icon: Shield, rarity: 'uncommon', earned: true, earnedAt: '2024-03-12' },
  { id: 'first-verify', nameKey: 'achievements.badge_community_helper', descKey: 'achievements.badge_community_helper_desc', icon: Eye, rarity: 'common', earned: true, earnedAt: '2024-01-20' },
  { id: 'streak-7', nameKey: 'achievements.badge_weekly_warrior', descKey: 'achievements.badge_weekly_warrior_desc', icon: Flame, rarity: 'uncommon', earned: true, earnedAt: '2024-04-01' },
  { id: 'fifty-reports', nameKey: 'achievements.badge_watchdog', descKey: 'achievements.badge_watchdog_desc', icon: Target, rarity: 'rare', earned: false },
  { id: 'hundred-verified', nameKey: 'achievements.badge_civic_champion', descKey: 'achievements.badge_civic_champion_desc', icon: Crown, rarity: 'epic', earned: false },
  { id: 'top-ten', nameKey: 'achievements.badge_elite_guardian', descKey: 'achievements.badge_elite_guardian_desc', icon: Trophy, rarity: 'legendary', earned: false },
  { id: 'ten-cities', nameKey: 'achievements.badge_road_explorer', descKey: 'achievements.badge_road_explorer_desc', icon: MapPin, rarity: 'rare', earned: false },
  { id: 'streak-30', nameKey: 'achievements.badge_monthly_master', descKey: 'achievements.badge_monthly_master_desc', icon: Zap, rarity: 'epic', earned: false },
  { id: 'referral-5', nameKey: 'achievements.badge_recruiter', descKey: 'achievements.badge_recruiter_desc', icon: Users, rarity: 'uncommon', earned: false },
  { id: 'staker', nameKey: 'achievements.badge_token_staker', descKey: 'achievements.badge_token_staker_desc', icon: Award, rarity: 'common', earned: true, earnedAt: '2024-02-15' },
];

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: 'bg-surface-100', border: 'border-surface-300', text: 'text-surface-600', glow: '' },
  uncommon: { bg: 'bg-success-50', border: 'border-success-300', text: 'text-success-700', glow: '' },
  rare: { bg: 'bg-brand-50', border: 'border-brand-300', text: 'text-brand-700', glow: 'shadow-glow-brand' },
  epic: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', glow: '' },
  legendary: { bg: 'bg-accent-50', border: 'border-accent-300', text: 'text-accent-700', glow: 'shadow-glow-accent' },
};

// Leaderboard data
const LEADERBOARD = [
  { rank: 1, name: 'Maria G.', points: 4520, reports: 312, level: 15, avatar: 'MG' },
  { rank: 2, name: 'Carlos R.', points: 4105, reports: 287, level: 14, avatar: 'CR' },
  { rank: 3, name: 'Ana S.', points: 3890, reports: 265, level: 13, avatar: 'AS' },
  { rank: 4, name: 'Pedro M.', points: 3450, reports: 231, level: 12, avatar: 'PM' },
  { rank: 5, name: 'Sofia L.', points: 3200, reports: 210, level: 12, avatar: 'SL' },
  { rank: 23, name: 'John D. (You)', points: 720, reports: 47, level: 7, avatar: 'JD', isCurrentUser: true },
];

const RARITY_FILTER_KEYS: Record<string, string> = {
  all: 'achievements.filter_all',
  common: 'achievements.filter_common',
  uncommon: 'achievements.filter_uncommon',
  rare: 'achievements.filter_rare',
  epic: 'achievements.filter_epic',
  legendary: 'achievements.filter_legendary',
};

type TabId = 'badges' | 'leaderboard' | 'levels';

const TABS: { id: TabId; labelKey: string }[] = [
  { id: 'badges', labelKey: 'achievements.tabs_badges' },
  { id: 'leaderboard', labelKey: 'achievements.tabs_leaderboard' },
  { id: 'levels', labelKey: 'achievements.tabs_levels' },
];

export default function AchievementsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('badges');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const earnedCount = BADGES.filter((b) => b.earned).length;

  const filteredBadges =
    rarityFilter === 'all'
      ? BADGES
      : BADGES.filter((b) => b.rarity === rarityFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {t('achievements.title')}
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          {t('achievements.subtitle')}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/30">
              <Medal className="h-5 w-5 text-accent-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {earnedCount}/{BADGES.length}
              </p>
              <p className="text-sm text-surface-500">{t('achievements.badges_earned')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/30">
              <Zap className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                720
              </p>
              <p className="text-sm text-surface-500">{t('achievements.total_points')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 dark:bg-success-950/30">
              <Trophy className="h-5 w-5 text-success-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                #23
              </p>
              <p className="text-sm text-surface-500">{t('achievements.global_rank')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
                : 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'badges' && (
        <div>
          {/* Rarity filter */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map(
              (rarity) => (
                <button
                  key={rarity}
                  onClick={() => setRarityFilter(rarity)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    rarityFilter === rarity
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300'
                  )}
                >
                  {t(RARITY_FILTER_KEYS[rarity])}
                </button>
              )
            )}
          </div>

          {/* Badge grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge) => {
              const rColors = rarityColors[badge.rarity];
              return (
                <Card
                  key={badge.id}
                  className={cn(
                    'relative overflow-hidden p-5 transition-all',
                    !badge.earned && 'opacity-60',
                    badge.earned && rColors.glow
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border-2',
                        badge.earned
                          ? cn(rColors.bg, rColors.border)
                          : 'border-surface-200 bg-surface-50 dark:border-surface-600 dark:bg-surface-700'
                      )}
                    >
                      {badge.earned ? (
                        <badge.icon
                          className={cn('h-6 w-6', rColors.text)}
                        />
                      ) : (
                        <Lock className="h-5 w-5 text-surface-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-surface-900 dark:text-white">
                          {t(badge.nameKey)}
                        </h3>
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize',
                            rColors.bg,
                            rColors.text
                          )}
                        >
                          {badge.rarity}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-surface-500 dark:text-surface-400">
                        {t(badge.descKey)}
                      </p>
                      {badge.earned && badge.earnedAt && (
                        <p className="mt-1 text-xs text-surface-400">
                          {t('achievements.earned')} {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {LEADERBOARD.map((user) => (
              <div
                key={user.rank}
                className={cn(
                  'flex items-center gap-4 p-4',
                  user.isCurrentUser &&
                    'bg-brand-50/50 dark:bg-brand-950/20'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                    user.rank === 1
                      ? 'bg-accent-100 text-accent-700'
                      : user.rank === 2
                        ? 'bg-surface-200 text-surface-600'
                        : user.rank === 3
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-surface-100 text-surface-500'
                  )}
                >
                  {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                  <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                    {user.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      user.isCurrentUser
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-surface-900 dark:text-white'
                    )}
                  >
                    {user.name}
                  </p>
                  <p className="text-xs text-surface-500">
                    {t('achievements.level')} {user.level} · {user.reports} {t('achievements.reports_label')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-surface-900 dark:text-white">
                    {user.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-surface-500">{t('achievements.points')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'levels' && (
        <div className="space-y-3">
          {[
            { level: 1, nameKey: 'achievements.level_newcomer', xp: 0, icon: '🌱' },
            { level: 3, nameKey: 'achievements.level_observer', xp: 100, icon: '👁️' },
            { level: 5, nameKey: 'achievements.level_reporter', xp: 300, icon: '📸' },
            { level: 7, nameKey: 'achievements.level_civic_guardian', xp: 500, icon: '🛡️', current: true },
            { level: 10, nameKey: 'achievements.level_watchdog', xp: 1000, icon: '🔍' },
            { level: 15, nameKey: 'achievements.level_champion', xp: 2500, icon: '🏆' },
            { level: 20, nameKey: 'achievements.level_legend', xp: 5000, icon: '👑' },
            { level: 30, nameKey: 'achievements.level_sentinel', xp: 10000, icon: '⭐' },
          ].map((tier, i) => (
            <Card
              key={tier.level}
              className={cn(
                'p-4',
                tier.current && 'border-brand-500 ring-2 ring-brand-500/20'
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{tier.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-surface-900 dark:text-white">
                      {t('achievements.level')} {tier.level}: {t(tier.nameKey)}
                    </p>
                    {tier.current && (
                      <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        {t('achievements.current')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-surface-500">
                    {tier.xp.toLocaleString()} {t('achievements.xp_required')}
                  </p>
                </div>
                {tier.current ? (
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-500">720 XP</p>
                    <p className="text-xs text-surface-400">280 {t('achievements.xp_to_next')}</p>
                  </div>
                ) : tier.xp <= 720 ? (
                  <CheckCircle2 className="h-5 w-5 text-success-500" />
                ) : (
                  <Lock className="h-5 w-5 text-surface-300" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
