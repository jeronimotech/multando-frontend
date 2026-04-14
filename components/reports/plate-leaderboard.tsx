'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, MapPin, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/lib/date-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';
import {
  usePlateLeaderboard,
  type LeaderboardPeriod,
  type PublicPlateLeaderboardEntry,
} from '@/hooks/use-leaderboard';

interface PlateLeaderboardProps {
  limit?: number;
  cityId?: string | number | null;
  showHeader?: boolean;
  showViewAll?: boolean;
  initialPeriod?: LeaderboardPeriod;
  /** When true, shows an extended layout with "Cities" column and more prominent styling */
  extended?: boolean;
  className?: string;
}

function positionBadge(index: number): { emoji: string | null; label: string } {
  if (index === 0) return { emoji: '🥇', label: '#1' };
  if (index === 1) return { emoji: '🥈', label: '#2' };
  if (index === 2) return { emoji: '🥉', label: '#3' };
  return { emoji: null, label: `#${index + 1}` };
}

export function PlateLeaderboard({
  limit = 10,
  cityId = null,
  showHeader = true,
  showViewAll = true,
  initialPeriod = 'all',
  extended = false,
  className,
}: PlateLeaderboardProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<LeaderboardPeriod>(initialPeriod);

  const { data = [], isLoading, isError } = usePlateLeaderboard({
    period,
    limit,
    cityId,
  });

  const periodTabs: { key: LeaderboardPeriod; label: string }[] = [
    { key: 'all', label: t('landing.leaderboard_period_all') },
    { key: 'month', label: t('landing.leaderboard_period_month') },
    { key: 'week', label: t('landing.leaderboard_period_week') },
  ];

  return (
    <div className={cn('w-full', className)}>
      {showHeader && (
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
            <Trophy className="h-4 w-4" />
            {t('landing.leaderboard_badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
            {t('landing.leaderboard_title')}
          </h2>
          <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
            {t('landing.leaderboard_subtitle')}
          </p>
        </div>
      )}

      {/* Period selector */}
      <div className="mb-6 flex items-center justify-center">
        <div className="inline-flex rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
          {periodTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPeriod(tab.key)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
                period === tab.key
                  ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
                  : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
        <Info className="h-3.5 w-3.5" />
        <span>{t('landing.leaderboard_privacy_note')}</span>
      </div>

      {/* Leaderboard table */}
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-700 dark:bg-surface-900">
        {isLoading ? (
          <LeaderboardSkeleton rows={Math.min(limit, 10)} extended={extended} />
        ) : isError ? (
          <EmptyState message={t('landing.leaderboard_error')} />
        ) : data.length === 0 ? (
          <EmptyState message={t('landing.leaderboard_empty')} />
        ) : (
          <ul role="list" className="divide-y divide-surface-100 dark:divide-surface-800">
            {data.slice(0, limit).map((entry, idx) => (
              <LeaderboardRow
                key={`${entry.plate_masked}-${idx}`}
                entry={entry}
                index={idx}
                extended={extended}
                t={t}
              />
            ))}
          </ul>
        )}
      </div>

      {showViewAll && (
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-700"
          >
            {t('landing.leaderboard_see_full')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

interface LeaderboardRowProps {
  entry: PublicPlateLeaderboardEntry;
  index: number;
  extended: boolean;
  t: (key: string) => string;
}

function LeaderboardRow({ entry, index, extended, t }: LeaderboardRowProps) {
  const { emoji, label } = positionBadge(index);
  const isTop3 = index < 3;

  return (
    <li
      className={cn(
        'flex flex-col gap-3 px-4 py-4 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-6',
        isTop3
          ? 'bg-gradient-to-r from-brand-50/60 to-transparent dark:from-brand-950/20'
          : 'hover:bg-surface-50 dark:hover:bg-surface-800/50'
      )}
    >
      {/* Position */}
      <div className="flex w-16 shrink-0 items-center gap-1">
        {emoji ? (
          <span className="text-2xl leading-none" aria-hidden="true">
            {emoji}
          </span>
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-100 text-xs font-semibold text-surface-600 dark:bg-surface-800 dark:text-surface-300">
            {label}
          </span>
        )}
      </div>

      {/* Masked plate with tooltip */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            title={t('landing.leaderboard_plate_tooltip')}
            className={cn(
              'inline-flex items-center rounded-md border border-surface-200 bg-surface-50 px-2.5 py-1 font-mono text-base font-bold tracking-wider text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white',
              isTop3 && 'border-brand-200 bg-white dark:border-brand-900 dark:bg-surface-900'
            )}
          >
            {entry.plate_masked}
          </span>
          {entry.top_infraction && (
            <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-300">
              {entry.top_infraction}
            </span>
          )}
        </div>
        {(extended || entry.cities?.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-500 dark:text-surface-400">
            {entry.cities && entry.cities.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {entry.cities.slice(0, 3).join(', ')}
                {entry.cities.length > 3 && ` +${entry.cities.length - 3}`}
              </span>
            )}
            {entry.last_reported_at && (
              <span>
                {t('landing.leaderboard_last_reported')}:{' '}
                {formatDistanceToNow(entry.last_reported_at)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Reports count */}
      <div className="flex shrink-0 items-baseline gap-1.5 sm:flex-col sm:items-end sm:gap-0">
        <span
          className={cn(
            'font-bold leading-none tabular-nums',
            isTop3 ? 'text-3xl text-brand-500' : 'text-2xl text-brand-600 dark:text-brand-400'
          )}
        >
          {entry.verified_reports.toLocaleString()}
        </span>
        <span className="text-xs uppercase tracking-wide text-surface-500 dark:text-surface-400">
          {t('landing.leaderboard_reports')}
        </span>
      </div>
    </li>
  );
}

function LeaderboardSkeleton({ rows, extended }: { rows: number; extended: boolean }) {
  return (
    <ul className="divide-y divide-surface-100 dark:divide-surface-800">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 px-6 py-4">
          <Skeleton variant="circular" width={32} />
          <div className="flex-1 space-y-2">
            <Skeleton width="120px" height={24} />
            {extended && <Skeleton width="60%" height={12} />}
          </div>
          <Skeleton width="60px" height={28} />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <Trophy className="h-10 w-10 text-surface-300 dark:text-surface-600" />
      <p className="text-sm text-surface-500 dark:text-surface-400">{message}</p>
    </div>
  );
}
