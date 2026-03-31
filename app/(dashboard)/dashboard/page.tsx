'use client';
export const dynamic = "force-dynamic";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import {
  FileText,
  ShieldCheck,
  Coins,
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Trophy,
  Flame,
  Star,
  Map,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStats, useRecentActivity, useGamificationSummary } from '@/hooks/use-dashboard';

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  brand: {
    bg: 'bg-brand-50 dark:bg-brand-950/30',
    icon: 'text-brand-500',
    badge: 'text-brand-600 bg-brand-50',
  },
  success: {
    bg: 'bg-success-50 dark:bg-success-950/30',
    icon: 'text-success-500',
    badge: 'text-success-600 bg-success-50',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-950/30',
    icon: 'text-warning-500',
    badge: 'text-warning-600 bg-warning-50',
  },
  accent: {
    bg: 'bg-accent-50 dark:bg-accent-950/30',
    icon: 'text-accent-500',
    badge: 'text-accent-600 bg-accent-50',
  },
};

export default function DashboardPage() {
  const { t, tParams } = useTranslation();

  // Fallback stat card data (used while loading)
  const stats = [
    {
      labelKey: 'dashboard.total_reports',
      value: '47',
      change: '+12%',
      trend: 'up' as const,
      icon: FileText,
      color: 'brand',
    },
    {
      labelKey: 'dashboard.verified',
      value: '38',
      change: '+8%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'success',
    },
    {
      labelKey: 'dashboard.pending',
      value: '6',
      change: '-2',
      trend: 'down' as const,
      icon: Clock,
      color: 'warning',
    },
    {
      labelKey: 'dashboard.multa_earned',
      value: '342',
      change: '+45',
      trend: 'up' as const,
      icon: Coins,
      color: 'accent',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      labelKey: 'dashboard.new_report',
      descKey: 'dashboard.new_report_desc',
      href: '/reports/new',
      icon: Plus,
      color: 'bg-brand-500 text-white hover:bg-brand-600',
    },
    {
      labelKey: 'dashboard.verify_reports',
      descKey: 'dashboard.verify_reports_desc',
      href: '/verify',
      icon: ShieldCheck,
      color: 'bg-success-500 text-white hover:bg-success-600',
    },
    {
      labelKey: 'dashboard.view_map',
      descKey: 'dashboard.view_map_desc',
      href: '/reports',
      icon: Map,
      color: 'bg-accent-500 text-white hover:bg-accent-600',
    },
    {
      labelKey: 'dashboard.leaderboard',
      descKey: 'dashboard.leaderboard_desc',
      href: '/achievements',
      icon: Trophy,
      color: 'bg-brand-700 text-white hover:bg-brand-800',
    },
  ];

  // Recent activity (mock)
  const recentActivity = [
    {
      type: 'report_verified',
      messageKey: 'dashboard.activity_report_verified',
      messageParams: { id: 'RPT-A1B2C3' },
      reward: '+10 MULTA',
      time: '2 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-success-500',
    },
    {
      type: 'report_created',
      messageKey: 'dashboard.activity_report_created',
      messageParams: {},
      reward: null,
      time: '5 hours ago',
      icon: FileText,
      iconColor: 'text-brand-500',
    },
    {
      type: 'verification_done',
      messageKey: 'dashboard.activity_verification_done',
      messageParams: { id: 'RPT-X4Y5Z6' },
      reward: '+3 MULTA',
      time: '1 day ago',
      icon: ShieldCheck,
      iconColor: 'text-brand-500',
    },
    {
      type: 'report_rejected',
      messageKey: 'dashboard.activity_report_rejected',
      messageParams: { id: 'RPT-D7E8F9' },
      reward: null,
      time: '2 days ago',
      icon: XCircle,
      iconColor: 'text-danger-500',
    },
    {
      type: 'badge_earned',
      messageKey: 'dashboard.activity_badge_earned',
      messageParams: { badge: 'First Reporter' },
      reward: '+5 MULTA',
      time: '3 days ago',
      icon: Star,
      iconColor: 'text-accent-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Quick Stats */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {tParams('dashboard.welcome', { name: 'John' })}
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <Card key={stat.labelKey}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      colors.bg
                    )}
                  >
                    <stat.icon className={cn('h-5 w-5', colors.icon)} />
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      stat.trend === 'up'
                        ? 'bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300'
                        : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300'
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        'mr-0.5 h-3 w-3',
                        stat.trend === 'down' && 'rotate-180'
                      )}
                    />
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-surface-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-sm text-surface-500 dark:text-surface-400">
                    {t(stat.labelKey)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Middle section: Quick actions + Gamification */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">
            {t('dashboard.quick_actions')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link key={action.labelKey} href={action.href}>
                <Card variant="interactive" className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl',
                        action.color
                      )}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">
                        {t(action.labelKey)}
                      </p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {t(action.descKey)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Gamification Summary */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">
            {t('dashboard.your_progress')}
          </h2>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Circular progress ring */}
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-surface-100 dark:text-surface-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="72, 100"
                    className="text-brand-500"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400">
                  Lv.7
                </span>
              </div>
              <div>
                <p className="font-semibold text-surface-900 dark:text-white">
                  Civic Guardian
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  720 / 1,000 XP to Level 8
                </p>
              </div>
            </div>

            {/* XP Progress bar */}
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
                  style={{ width: '72%' }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4 text-accent-500" />
                  <span className="text-lg font-bold text-surface-900 dark:text-white">
                    5
                  </span>
                </div>
                <p className="text-xs text-surface-500">{t('dashboard.day_streak')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-accent-500" />
                  <span className="text-lg font-bold text-surface-900 dark:text-white">
                    12
                  </span>
                </div>
                <p className="text-xs text-surface-500">{t('dashboard.badges')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4 text-brand-500" />
                  <span className="text-lg font-bold text-surface-900 dark:text-white">
                    #23
                  </span>
                </div>
                <p className="text-xs text-surface-500">{t('dashboard.rank')}</p>
              </div>
            </div>

            {/* Managed Wallet Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-success-50 px-3 py-2 dark:bg-success-950/30">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              <p className="text-xs font-medium text-success-700 dark:text-success-300">
                {t('dashboard.managed_wallet_active')} &middot; {t('dashboard.managed_wallet_status')}
              </p>
            </div>

            <Link
              href="/achievements"
              className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              {t('dashboard.view_achievements')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            {t('dashboard.recent_activity')}
          </h2>
          <Link
            href="/reports"
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            {t('dashboard.view_all')}
          </Link>
        </div>
        <Card>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full bg-surface-50 dark:bg-surface-700',
                  )}
                >
                  <activity.icon
                    className={cn('h-4 w-4', activity.iconColor)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-900 dark:text-white">
                    {Object.keys(activity.messageParams).length > 0
                      ? tParams(activity.messageKey, activity.messageParams)
                      : t(activity.messageKey)}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {activity.time}
                  </p>
                </div>
                {activity.reward && (
                  <span className="shrink-0 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                    {activity.reward}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
