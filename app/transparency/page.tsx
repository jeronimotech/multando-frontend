'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  FileSearch,
  Gauge,
  Globe2,
  Scale,
} from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import {
  useAuthorityPublicProfile,
  usePublicStats,
  useRewardRules,
  useScoringRules,
  type PublicStats,
} from '@/hooks/use-transparency';

const CATEGORY_COLORS = ['#3b5eef', '#8e5eef', '#10b981', '#f59e0b'];

function formatPct(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return `${Math.round(value * 1000) / 10}%`;
}

function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '—';
  return value.toLocaleString();
}

function formatMonthLabel(month: string): string {
  // month is YYYY-MM. Use UTC midnight to avoid TZ drift.
  const [y, m] = month.split('-').map((s) => Number(s));
  if (!y || !m) return month;
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

export default function TransparencyPage() {
  const { t } = useTranslation();
  const statsQuery = usePublicStats();
  const scoringQuery = useScoringRules();
  const rewardsQuery = useRewardRules();

  const stats = statsQuery.data;

  // Show the first top city's authority profile as an example when available.
  // This endpoint is public and safe to call.
  const sampleAuthorityId = useMemo(() => {
    // We don't have an authority-id listing, so we skip this by default.
    // When integrating later, pass a real id.
    return null;
  }, []);
  const authorityQuery = useAuthorityPublicProfile(sampleAuthorityId);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-surface-200 bg-gradient-to-b from-brand-50/60 to-white py-16 dark:border-surface-700 dark:from-brand-950/20 dark:to-surface-900 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <Scale className="h-4 w-4" />
                {t('transparency.badge')}
              </div>
              <h1 className="text-4xl font-bold text-surface-900 dark:text-white md:text-5xl">
                {t('transparency.hero_title')}
              </h1>
              <p className="mt-5 text-lg text-surface-600 dark:text-surface-300">
                {t('transparency.hero_subtitle')}
              </p>
              {stats?.generated_at && (
                <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
                  {t('transparency.generated_at')}{' '}
                  {new Date(stats.generated_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Big stat cards: this month */}
        <section className="py-12 md:py-16">
          <div className="container-app">
            <SectionHeader
              icon={<Gauge className="h-5 w-5" />}
              title={t('transparency.section_this_month_title')}
              subtitle={t('transparency.section_this_month_subtitle')}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label={t('transparency.stat_total_reports')}
                value={formatNumber(stats?.total_reports)}
                loading={statsQuery.isLoading}
              />
              <StatCard
                label={t('transparency.stat_reports_this_month')}
                value={formatNumber(stats?.reports_this_month)}
                loading={statsQuery.isLoading}
              />
              <StatCard
                label={t('transparency.stat_approval_rate')}
                value={formatPct(stats?.authority_approval_rate)}
                accent="success"
                loading={statsQuery.isLoading}
              />
              <StatCard
                label={t('transparency.stat_pending_rate')}
                value={formatPct(stats?.pending_or_review)}
                accent="muted"
                loading={statsQuery.isLoading}
              />
            </div>
          </div>
        </section>

        {/* Timeline chart */}
        <section className="border-t border-surface-200 bg-surface-50 py-12 dark:border-surface-700 dark:bg-surface-800 md:py-16">
          <div className="container-app">
            <SectionHeader
              icon={<Clock className="h-5 w-5" />}
              title={t('transparency.section_timeline_title')}
              subtitle={t('transparency.section_timeline_subtitle')}
            />
            <Card className="mt-8 border-surface-200 dark:border-surface-700">
              <CardContent className="p-6">
                <TimelineChart stats={stats} loading={statsQuery.isLoading} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* By category */}
        <section className="py-12 md:py-16">
          <div className="container-app grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeader
                icon={<FileSearch className="h-5 w-5" />}
                title={t('transparency.section_category_title')}
                subtitle={t('transparency.section_category_subtitle')}
              />
              <Card className="mt-8 border-surface-200 dark:border-surface-700">
                <CardContent className="p-6">
                  <CategoryChart stats={stats} loading={statsQuery.isLoading} t={t} />
                </CardContent>
              </Card>
            </div>

            {/* Top cities */}
            <div>
              <SectionHeader
                icon={<Globe2 className="h-5 w-5" />}
                title={t('transparency.section_cities_title')}
                subtitle={t('transparency.section_cities_subtitle')}
              />
              <Card className="mt-8 border-surface-200 dark:border-surface-700">
                <CardContent className="p-0">
                  <TopCitiesTable stats={stats} loading={statsQuery.isLoading} t={t} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Authority profile (optional, only when an id has been configured) */}
        {sampleAuthorityId !== null && authorityQuery.data && (
          <section className="border-t border-surface-200 bg-surface-50 py-12 dark:border-surface-700 dark:bg-surface-800 md:py-16">
            <div className="container-app">
              <SectionHeader
                icon={<Building2 className="h-5 w-5" />}
                title={t('transparency.section_authority_title')}
                subtitle={t('transparency.section_authority_subtitle')}
              />
              <Card className="mt-8 border-surface-200 dark:border-surface-700">
                <CardContent className="p-6">
                  <AuthorityPanel data={authorityQuery.data} t={t} />
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Open-source scoring rules */}
        <section className="border-t border-surface-200 py-12 dark:border-surface-700 md:py-16">
          <div className="container-app">
            <SectionHeader
              icon={<CheckCircle2 className="h-5 w-5" />}
              title={t('transparency.section_scoring_title')}
              subtitle={t('transparency.section_scoring_subtitle')}
            />
            <Card className="mt-8 border-surface-200 dark:border-surface-700">
              <CardContent className="p-0">
                {scoringQuery.isLoading ? (
                  <div className="p-6 text-sm text-surface-500">
                    {t('transparency.loading')}
                  </div>
                ) : scoringQuery.data ? (
                  <ScoringRulesTable data={scoringQuery.data} t={t} />
                ) : (
                  <div className="p-6 text-sm text-surface-500">
                    {t('transparency.empty')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Reward rules */}
        <section className="border-t border-surface-200 bg-surface-50 py-12 dark:border-surface-700 dark:bg-surface-800 md:py-16">
          <div className="container-app">
            <SectionHeader
              icon={<Coins className="h-5 w-5" />}
              title={t('transparency.section_rewards_title')}
              subtitle={t('transparency.section_rewards_subtitle')}
            />
            <Card className="mt-8 border-surface-200 dark:border-surface-700">
              <CardContent className="p-0">
                {rewardsQuery.isLoading ? (
                  <div className="p-6 text-sm text-surface-500">
                    {t('transparency.loading')}
                  </div>
                ) : rewardsQuery.data ? (
                  <RewardRulesTable data={rewardsQuery.data} t={t} />
                ) : (
                  <div className="p-6 text-sm text-surface-500">
                    {t('transparency.empty')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-surface-200 py-16 dark:border-surface-700">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white md:text-3xl">
                {t('transparency.cta_title')}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-surface-600 dark:text-surface-300">
                {t('transparency.cta_subtitle')}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/security-policy">
                  <Button>{t('transparency.cta_security')}</Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline">{t('transparency.cta_privacy')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------------

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
          {icon}
        </span>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white md:text-2xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="max-w-2xl text-sm text-surface-600 dark:text-surface-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  loading,
}: {
  label: string;
  value: string;
  accent?: 'success' | 'muted';
  loading?: boolean;
}) {
  const valueClass =
    accent === 'success'
      ? 'text-success-600 dark:text-success-400'
      : accent === 'muted'
        ? 'text-surface-700 dark:text-surface-200'
        : 'text-brand-500';
  return (
    <Card className="border-surface-200 dark:border-surface-700">
      <CardContent className="p-6">
        <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
        <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
          {loading ? '…' : value}
        </p>
      </CardContent>
    </Card>
  );
}

function TimelineChart({
  stats,
  loading,
}: {
  stats: PublicStats | undefined;
  loading: boolean;
}) {
  const data = useMemo(() => {
    if (!stats?.reports_last_12_months) return [];
    return stats.reports_last_12_months.map((row) => ({
      month: row.month,
      label: formatMonthLabel(row.month),
      count: row.count,
    }));
  }, [stats]);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-surface-500">
        …
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-surface-500">
        —
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid, #e2e8f0)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b5eef"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3b5eef' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CategoryChart({
  stats,
  loading,
  t,
}: {
  stats: PublicStats | undefined;
  loading: boolean;
  t: (k: string) => string;
}) {
  const data = useMemo(() => {
    if (!stats?.reports_by_category) return [];
    return Object.entries(stats.reports_by_category).map(([key, value]) => ({
      key,
      label: t(`transparency.category_${key}`),
      value: value,
    }));
  }, [stats, t]);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-surface-500">
        …
      </div>
    );
  }
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-surface-500">
        —
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid, #e2e8f0)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((_, idx) => (
              <Cell
                key={`cat-${idx}`}
                fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopCitiesTable({
  stats,
  loading,
  t,
}: {
  stats: PublicStats | undefined;
  loading: boolean;
  t: (k: string) => string;
}) {
  const rows = stats?.top_cities ?? [];
  if (loading) {
    return <div className="p-6 text-sm text-surface-500">…</div>;
  }
  if (rows.length === 0) {
    return <div className="p-6 text-sm text-surface-500">{t('transparency.empty')}</div>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="border-b border-surface-200 bg-surface-50 text-left text-xs uppercase tracking-wide text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
        <tr>
          <th className="px-5 py-3">#</th>
          <th className="px-5 py-3">{t('transparency.city_col_name')}</th>
          <th className="px-5 py-3 text-right">
            {t('transparency.city_col_reports')}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={`${row.name}-${i}`}
            className="border-b border-surface-100 last:border-b-0 dark:border-surface-800"
          >
            <td className="px-5 py-3 text-surface-500">{i + 1}</td>
            <td className="px-5 py-3 font-medium text-surface-900 dark:text-white">
              {row.name}
            </td>
            <td className="px-5 py-3 text-right text-surface-700 dark:text-surface-200">
              {row.reports.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AuthorityPanel({
  data,
  t,
}: {
  data: {
    name: string | null;
    city: string | null;
    validation_count: number;
    rejection_count: number;
    average_processing_time_hours: number | null;
    active_since: string | null;
  };
  t: (k: string) => string;
}) {
  const total = data.validation_count + data.rejection_count;
  const rate = total > 0 ? data.validation_count / total : 0;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {data.city ?? '—'}
        </p>
        <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">
          {data.name ?? '—'}
        </p>
        {data.active_since && (
          <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
            {t('transparency.authority_active_since')}{' '}
            {new Date(data.active_since).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MiniStat
          label={t('transparency.authority_validated')}
          value={data.validation_count.toLocaleString()}
        />
        <MiniStat
          label={t('transparency.authority_rejected')}
          value={data.rejection_count.toLocaleString()}
        />
        <MiniStat
          label={t('transparency.authority_validation_rate')}
          value={formatPct(rate)}
        />
        <MiniStat
          label={t('transparency.authority_avg_processing')}
          value={
            data.average_processing_time_hours !== null
              ? `${data.average_processing_time_hours.toLocaleString()} h`
              : '—'
          }
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-900">
      <p className="text-xs text-surface-500 dark:text-surface-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-surface-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function ScoringRulesTable({
  data,
  t,
}: {
  data: {
    baseline: number;
    factors: Array<{ name: string; points: number | string; description: string }>;
    min: number;
    max: number;
    notes?: string;
  };
  t: (k: string) => string;
}) {
  return (
    <div>
      <div className="border-b border-surface-200 bg-surface-50 px-6 py-4 dark:border-surface-700 dark:bg-surface-900">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span>
            <span className="text-surface-500 dark:text-surface-400">
              {t('transparency.scoring_baseline')}:
            </span>{' '}
            <span className="font-semibold text-surface-900 dark:text-white">
              {data.baseline}
            </span>
          </span>
          <span>
            <span className="text-surface-500 dark:text-surface-400">
              {t('transparency.scoring_range')}:
            </span>{' '}
            <span className="font-semibold text-surface-900 dark:text-white">
              {data.min}–{data.max}
            </span>
          </span>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-surface-200 text-left text-xs uppercase tracking-wide text-surface-500 dark:border-surface-700 dark:text-surface-400">
          <tr>
            <th className="px-6 py-3">{t('transparency.scoring_col_factor')}</th>
            <th className="px-6 py-3">{t('transparency.scoring_col_points')}</th>
            <th className="px-6 py-3">
              {t('transparency.scoring_col_description')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.factors.map((f) => (
            <tr
              key={f.name}
              className="border-b border-surface-100 last:border-b-0 dark:border-surface-800"
            >
              <td className="px-6 py-3 font-mono text-xs text-brand-600 dark:text-brand-300">
                {f.name}
              </td>
              <td className="px-6 py-3 font-semibold text-surface-900 dark:text-white">
                {typeof f.points === 'number'
                  ? (f.points > 0 ? `+${f.points}` : `${f.points}`)
                  : f.points}
              </td>
              <td className="px-6 py-3 text-surface-600 dark:text-surface-300">
                {f.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.notes && (
        <div className="border-t border-surface-200 bg-surface-50 px-6 py-4 text-xs text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
          {data.notes}
        </div>
      )}
    </div>
  );
}

function RewardRulesTable({
  data,
  t,
}: {
  data: {
    currency: string;
    actions: Array<{ action: string; description: string; points: number; multa: number }>;
    notes?: string;
  };
  t: (k: string) => string;
}) {
  return (
    <div>
      <table className="w-full text-sm">
        <thead className="border-b border-surface-200 text-left text-xs uppercase tracking-wide text-surface-500 dark:border-surface-700 dark:text-surface-400">
          <tr>
            <th className="px-6 py-3">{t('transparency.reward_col_action')}</th>
            <th className="px-6 py-3">{t('transparency.reward_col_points')}</th>
            <th className="px-6 py-3">
              {data.currency} {t('transparency.reward_col_tokens')}
            </th>
            <th className="px-6 py-3">
              {t('transparency.reward_col_description')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.actions.map((a) => (
            <tr
              key={a.action}
              className="border-b border-surface-100 last:border-b-0 dark:border-surface-800"
            >
              <td className="px-6 py-3 font-mono text-xs text-brand-600 dark:text-brand-300">
                {a.action}
              </td>
              <td className="px-6 py-3 font-semibold text-surface-900 dark:text-white">
                +{a.points}
              </td>
              <td className="px-6 py-3 font-semibold text-accent-600 dark:text-accent-400">
                +{a.multa}
              </td>
              <td className="px-6 py-3 text-surface-600 dark:text-surface-300">
                {a.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.notes && (
        <div className="border-t border-surface-200 bg-surface-50 px-6 py-4 text-xs text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
          {data.notes}
        </div>
      )}
    </div>
  );
}
