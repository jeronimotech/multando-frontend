'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Award,
  Trophy,
  Coins,
  Zap,
  Camera,
  ShieldCheck,
  TrendingUp,
  ArrowRightLeft,
  Sparkles,
  Star,
  Shield,
  Crown,
  Flame,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function RewardsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-surface-200 bg-gradient-to-b from-brand-50/70 via-white to-white py-16 dark:border-surface-700 dark:from-brand-950/30 dark:via-surface-900 dark:to-surface-900 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/10"
          />
          <div className="container-app relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <Sparkles className="h-4 w-4" />
                {t('rewards_page.badge')}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-white md:text-5xl">
                {t('rewards_page.hero_title')}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-surface-600 dark:text-surface-300">
                {t('rewards_page.hero_subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t('rewards_page.cta_start_reporting')}
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline">
                    {t('rewards_page.cta_see_how')}
                  </Button>
                </Link>
              </div>

              {/* Dual reward preview */}
              <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-surface-200 bg-white p-5 text-left shadow-sm dark:border-surface-700 dark:bg-surface-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">
                        {t('rewards_page.dual_points_title')}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {t('rewards_page.dual_points_desc')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-surface-200 bg-white p-5 text-left shadow-sm dark:border-surface-700 dark:bg-surface-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">
                        {t('rewards_page.dual_multa_title')}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {t('rewards_page.dual_multa_desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('rewards_page.how_title')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-surface-600 dark:text-surface-300">
                {t('rewards_page.how_subtitle')}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StepCard
                step="01"
                icon={<Camera className="h-5 w-5" />}
                title={t('rewards_page.step1_title')}
                content={t('rewards_page.step1_content')}
              />
              <StepCard
                step="02"
                icon={<ShieldCheck className="h-5 w-5" />}
                title={t('rewards_page.step2_title')}
                content={t('rewards_page.step2_content')}
              />
              <StepCard
                step="03"
                icon={<TrendingUp className="h-5 w-5" />}
                title={t('rewards_page.step3_title')}
                content={t('rewards_page.step3_content')}
              />
              <StepCard
                step="04"
                icon={<ArrowRightLeft className="h-5 w-5" />}
                title={t('rewards_page.step4_title')}
                content={t('rewards_page.step4_content')}
                comingSoon
                comingSoonLabel={t('rewards_page.coming_soon')}
              />
            </div>
          </div>
        </section>

        {/* Rewards Table */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800/50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('rewards_page.table_title')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-surface-600 dark:text-surface-300">
                {t('rewards_page.table_subtitle')}
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              <Card className="overflow-hidden border-surface-200 dark:border-surface-700">
                <CardContent className="p-0">
                  {/* Header row — desktop */}
                  <div className="hidden grid-cols-12 gap-4 border-b border-surface-200 bg-surface-100/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 md:grid">
                    <div className="col-span-6">{t('rewards_page.table_action')}</div>
                    <div className="col-span-3 text-right">{t('rewards_page.table_points')}</div>
                    <div className="col-span-3 text-right">{t('rewards_page.table_multa')}</div>
                  </div>

                  {[
                    { key: 'submit', icon: <Camera className="h-4 w-4" />, points: 5, multa: 0 },
                    { key: 'verified', icon: <ShieldCheck className="h-4 w-4" />, points: 20, multa: 10 },
                    { key: 'community', icon: <Star className="h-4 w-4" />, points: 10, multa: 5 },
                    { key: 'first_daily', icon: <Sparkles className="h-4 w-4" />, points: 3, multa: 0 },
                    { key: 'streak', icon: <Flame className="h-4 w-4" />, points: 50, multa: 25 },
                  ].map((row, i, arr) => (
                    <div
                      key={row.key}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 ${
                        i !== arr.length - 1
                          ? 'border-b border-surface-200 dark:border-surface-700'
                          : ''
                      }`}
                    >
                      <div className="col-span-12 flex items-center gap-3 md:col-span-6">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                          {row.icon}
                        </span>
                        <span className="text-sm font-medium text-surface-900 dark:text-white">
                          {t(`rewards_page.action_${row.key}`)}
                        </span>
                      </div>
                      <div className="col-span-6 flex items-center gap-2 md:col-span-3 md:justify-end">
                        <span className="text-xs uppercase tracking-wide text-surface-500 dark:text-surface-400 md:hidden">
                          {t('rewards_page.table_points')}
                        </span>
                        {row.points > 0 ? (
                          <Badge variant="brand" size="md">+{row.points} pts</Badge>
                        ) : (
                          <span className="text-sm text-surface-400 dark:text-surface-500">—</span>
                        )}
                      </div>
                      <div className="col-span-6 flex items-center gap-2 md:col-span-3 md:justify-end">
                        <span className="text-xs uppercase tracking-wide text-surface-500 dark:text-surface-400 md:hidden">
                          {t('rewards_page.table_multa')}
                        </span>
                        {row.multa > 0 ? (
                          <Badge variant="warning" size="md">
                            <Coins className="h-3 w-3" />
                            +{row.multa} MULTA
                          </Badge>
                        ) : (
                          <span className="text-sm text-surface-400 dark:text-surface-500">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <p className="mt-4 text-center text-xs text-surface-500 dark:text-surface-400">
                {t('rewards_page.table_disclaimer')}
              </p>
            </div>
          </div>
        </section>

        {/* Levels */}
        <section className="py-16">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('rewards_page.levels_title')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-surface-600 dark:text-surface-300">
                {t('rewards_page.levels_subtitle')}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <LevelCard
                level={1}
                icon={<Star className="h-5 w-5" />}
                name={t('rewards_page.level1_name')}
                range="0 – 100"
                perks={t('rewards_page.level1_perks')}
                tone="slate"
              />
              <LevelCard
                level={2}
                icon={<Shield className="h-5 w-5" />}
                name={t('rewards_page.level2_name')}
                range="100 – 500"
                perks={t('rewards_page.level2_perks')}
                tone="brand"
              />
              <LevelCard
                level={3}
                icon={<Award className="h-5 w-5" />}
                name={t('rewards_page.level3_name')}
                range="500 – 2,000"
                perks={t('rewards_page.level3_perks')}
                tone="success"
              />
              <LevelCard
                level={4}
                icon={<Trophy className="h-5 w-5" />}
                name={t('rewards_page.level4_name')}
                range="2,000 – 10,000"
                perks={t('rewards_page.level4_perks')}
                tone="accent"
              />
              <LevelCard
                level={5}
                icon={<Crown className="h-5 w-5" />}
                name={t('rewards_page.level5_name')}
                range="10,000+"
                perks={t('rewards_page.level5_perks')}
                tone="danger"
                highlight
              />
            </div>
          </div>
        </section>

        {/* About MULTA Token */}
        <section className="border-t border-surface-200 bg-gradient-to-br from-brand-50/50 to-accent-50/40 py-16 dark:border-surface-700 dark:from-brand-950/20 dark:to-accent-950/20">
          <div className="container-app">
            <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                  <Coins className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                  {t('rewards_page.token_title')}
                </h2>
                <p className="mt-4 text-surface-600 dark:text-surface-300">
                  {t('rewards_page.token_p1')}
                </p>
                <p className="mt-3 text-surface-600 dark:text-surface-300">
                  {t('rewards_page.token_p2')}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/security-policy">
                    <Button variant="outline">{t('rewards_page.token_learn_security')}</Button>
                  </Link>
                </div>
              </div>

              <Card className="border-surface-200 dark:border-surface-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <TokenFeature
                      icon={<Zap className="h-4 w-4" />}
                      title={t('rewards_page.token_feat_staking_title')}
                      desc={t('rewards_page.token_feat_staking_desc')}
                    />
                    <TokenFeature
                      icon={<Trophy className="h-4 w-4" />}
                      title={t('rewards_page.token_feat_rewards_title')}
                      desc={t('rewards_page.token_feat_rewards_desc')}
                    />
                    <TokenFeature
                      icon={<ArrowRightLeft className="h-4 w-4" />}
                      title={t('rewards_page.token_feat_marketplace_title')}
                      desc={t('rewards_page.token_feat_marketplace_desc')}
                      comingSoonLabel={t('rewards_page.coming_soon')}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Responsible reporting note */}
        <section className="border-t border-surface-200 py-12 dark:border-surface-700">
          <div className="container-app">
            <div className="mx-auto max-w-3xl rounded-2xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-800/50">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <Info className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {t('landing.responsible_reporting')}
                  </p>
                  <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                    {t('landing.responsible_reporting_desc')}
                  </p>
                  <Link
                    href="/principles"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    {t('landing.responsible_reporting_link')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white md:text-4xl">
                {t('rewards_page.final_cta_title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-surface-600 dark:text-surface-300">
                {t('rewards_page.final_cta_subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t('rewards_page.final_cta_create')}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    {t('rewards_page.final_cta_learn')}
                  </Button>
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

function StepCard({
  step,
  icon,
  title,
  content,
  comingSoon,
  comingSoonLabel,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  content: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}) {
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-md dark:border-surface-700 dark:bg-surface-800 dark:hover:border-brand-700">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          {icon}
        </div>
        <span className="text-xs font-semibold tracking-widest text-surface-300 dark:text-surface-600">
          {step}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
        {content}
      </p>
      {comingSoon && comingSoonLabel && (
        <div className="mt-4">
          <Badge variant="warning" size="sm">
            {comingSoonLabel}
          </Badge>
        </div>
      )}
    </div>
  );
}

type LevelTone = 'slate' | 'brand' | 'success' | 'accent' | 'danger';

const levelToneStyles: Record<LevelTone, { badge: string; icon: string; ring: string }> = {
  slate: {
    badge: 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-200',
    icon: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300',
    ring: 'hover:border-surface-400 dark:hover:border-surface-500',
  },
  brand: {
    badge: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    icon: 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    ring: 'hover:border-brand-400 dark:hover:border-brand-600',
  },
  success: {
    badge: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
    icon: 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    ring: 'hover:border-success-400 dark:hover:border-success-600',
  },
  accent: {
    badge: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
    icon: 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400',
    ring: 'hover:border-accent-400 dark:hover:border-accent-600',
  },
  danger: {
    badge: 'bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300',
    icon: 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400',
    ring: 'hover:border-danger-400 dark:hover:border-danger-600',
  },
};

function LevelCard({
  level,
  icon,
  name,
  range,
  perks,
  tone,
  highlight,
}: {
  level: number;
  icon: React.ReactNode;
  name: string;
  range: string;
  perks: string;
  tone: LevelTone;
  highlight?: boolean;
}) {
  const styles = levelToneStyles[tone];
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-5 transition-all dark:bg-surface-800 ${
        highlight
          ? 'border-danger-300 shadow-lg shadow-danger-500/10 dark:border-danger-700'
          : 'border-surface-200 dark:border-surface-700'
      } ${styles.ring}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}>
          {icon}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles.badge}`}>
          Lvl {level}
        </span>
      </div>
      <h3 className="text-base font-bold text-surface-900 dark:text-white">{name}</h3>
      <p className="mt-1 text-xs font-medium text-surface-500 dark:text-surface-400">
        {range} pts
      </p>
      <p className="mt-3 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
        {perks}
      </p>
    </div>
  );
}

function TokenFeature({
  icon,
  title,
  desc,
  comingSoonLabel,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  comingSoonLabel?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
        {icon}
      </span>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">{title}</p>
          {comingSoonLabel && (
            <Badge variant="warning" size="sm">
              {comingSoonLabel}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">{desc}</p>
      </div>
    </div>
  );
}
