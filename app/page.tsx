'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SandboxBanner } from '@/components/layout/sandbox-banner';
import { DynamicReportMap } from '@/components/map/dynamic-map';
import { ReportCard, ReportCardSkeleton } from '@/components/reports/report-card';
import { PlateLeaderboard } from '@/components/reports/plate-leaderboard';
import { useReportMarkers, useReports } from '@/hooks/use-reports';
import { ArrowRight, MapPin, Camera, Award, Shield, ChevronRight, Wallet, Coins, Zap, Code2, Building2, Check, Store, Gift, ShoppingBag, Coffee, Smartphone } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { usePublicIntegrations } from '@/hooks/use-transparency';

export default function HomePage() {
  const { data: markers = [], isLoading: markersLoading } = useReportMarkers();
  const { data: reportsData, isLoading: reportsLoading } = useReports({ limit: 20 });
  const { t } = useTranslation();
  const { data: integrations = [] } = usePublicIntegrations();

  const recentReports = reportsData?.data || [];

  const features = [
    {
      icon: Coins,
      titleKey: 'landing.feature_earn',
      descKey: 'landing.feature_earn_desc',
    },
    {
      icon: Zap,
      titleKey: 'landing.feature_security',
      descKey: 'landing.feature_security_desc',
    },
    {
      icon: Wallet,
      titleKey: 'landing.feature_no_wallet',
      descKey: 'landing.feature_no_wallet_desc',
    },
    {
      icon: Code2,
      titleKey: 'landing.feature_advanced',
      descKey: 'landing.feature_advanced_desc',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SandboxBanner />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-20 dark:from-surface-800 dark:to-surface-900 sm:py-32">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-6xl">
                {t('landing.hero_safety_title')}
              </h1>
              <p className="mt-6 text-lg leading-8 text-surface-600 dark:text-surface-300">
                {t('landing.hero_safety_subtitle')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-4">
                <Link href="/register">
                  <Button size="lg">
                    {t('home.cta_get_started')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#map-section">
                  <Button variant="outline" size="lg">
                    <MapPin className="mr-2 h-4 w-4" />
                    {t('dashboard.view_map')}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur dark:bg-surface-800/80">
                  <p className="text-2xl font-bold text-brand-500 sm:text-3xl">2.5K+</p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 sm:text-sm">
                    {t('landing.stat_reports')}
                  </p>
                </div>
                <div className="rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur dark:bg-surface-800/80">
                  <p className="text-2xl font-bold text-success sm:text-3xl">1.2K</p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 sm:text-sm">
                    {t('landing.stat_verified')}
                  </p>
                </div>
                <div className="rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur dark:bg-surface-800/80">
                  <p className="text-2xl font-bold text-secondary sm:text-3xl">50K+</p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 sm:text-sm">
                    {t('landing.stat_earned')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-200 to-secondary-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </section>

        {/* Map Section */}
        <section id="map-section" className="py-16 sm:py-24">
          <div className="container-app">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {t('landing.map_title')}
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.map_subtitle')}
              </p>
            </div>

            {/* Map and Recent Reports Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-xl border border-surface-200 shadow-lg dark:border-surface-700">
                  <div className="h-[400px] sm:h-[500px]">
                    <DynamicReportMap
                      markers={markers}
                      center={[4.7110, -74.0721]}
                      zoom={12}
                      interactive={true}
                      showCurrentLocation={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10b981' }} />
                      <span className="text-surface-600 dark:text-surface-400">{t('landing.map_approved')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#3b82f6' }} />
                      <span className="text-surface-600 dark:text-surface-400">{t('landing.map_community_verified')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                      <span className="text-surface-600 dark:text-surface-400">{t('landing.map_authority_review')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#94a3b8' }} />
                      <span className="text-surface-600 dark:text-surface-400">{t('landing.map_pending')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
                      <span className="text-surface-600 dark:text-surface-400">{t('landing.map_rejected')}</span>
                    </span>
                  </div>
                  <Link
                    href="/reports"
                    className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-700"
                  >
                    {t('landing.map_view_all')}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Recent Reports Sidebar */}
              <div className="lg:col-span-1">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {t('landing.recent_reports')}
                  </h3>
                  <Link
                    href="/reports"
                    className="text-sm font-medium text-brand-500 hover:text-brand-700"
                  >
                    {t('landing.see_all')}
                  </Link>
                </div>
                <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface-300 dark:[&::-webkit-scrollbar-thumb]:bg-surface-600">
                  {reportsLoading ? (
                    <>
                      <ReportCardSkeleton compact />
                      <ReportCardSkeleton compact />
                      <ReportCardSkeleton compact />
                      <ReportCardSkeleton compact />
                    </>
                  ) : recentReports.length > 0 ? (
                    recentReports.map((report) => (
                      <ReportCard key={report.id} report={report} compact />
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-surface-300 p-8 text-center dark:border-surface-600">
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {t('landing.no_recent')}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-6">
                  <Link href="/reports/new" className="block">
                    <Button className="w-full" size="lg">
                      <Camera className="mr-2 h-4 w-4" />
                      {t('landing.report_violation')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Worst Drivers Leaderboard Section */}
        <section
          id="leaderboard-section"
          className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800/50 sm:py-24"
        >
          <div className="container-app">
            <PlateLeaderboard limit={10} />
          </div>
        </section>

        {/* Responsible Reporting Principles Banner */}
        <section className="border-t border-surface-200 bg-gradient-to-r from-brand-50 via-white to-brand-50 py-16 dark:border-surface-700 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 sm:py-24">
          <div className="container-app">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
                  <Shield className="h-4 w-4" />
                  {t('landing.responsible_reporting')}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                  {t('principles.hero_title')}
                </h2>
                <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                  {t('landing.responsible_reporting_desc')}
                </p>
                <div className="mt-8">
                  <Link href="/principles">
                    <Button size="lg" variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      {t('landing.responsible_reporting_link')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: '📋',
                    titleKey: 'principles.do_1_title',
                    descKey: 'principles.do_1_content',
                  },
                  {
                    icon: '🔒',
                    titleKey: 'principles.safeguard_anonymity_title',
                    descKey: 'principles.safeguard_anonymity_content',
                  },
                  {
                    icon: '⚖️',
                    titleKey: 'principles.safeguard_authority_title',
                    descKey: 'principles.safeguard_authority_content',
                  },
                  {
                    icon: '🛡️',
                    titleKey: 'principles.safeguard_rate_title',
                    descKey: 'principles.safeguard_rate_content',
                  },
                ].map((item) => (
                  <div
                    key={item.titleKey}
                    className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-700 dark:bg-surface-800"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="mt-2 text-sm font-semibold text-surface-900 dark:text-white">
                      {t(item.titleKey)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">
                      {t(item.descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Built for Everyone Section */}
        <section className="border-t border-surface-200 bg-white py-16 dark:border-surface-700 dark:bg-surface-900 sm:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {t('landing.built_for_everyone')}
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.built_for_everyone_desc')}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.titleKey}
                  className="rounded-xl bg-surface-50 p-6 shadow-sm dark:bg-surface-800"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
                    <feature.icon className="h-6 w-6 text-brand-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
                    {t(feature.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800 sm:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {t('landing.how_it_works')}
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.how_it_works_desc')}
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-xl bg-white p-8 shadow-sm dark:bg-surface-900">
                <div className="absolute -top-4 left-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    1
                  </span>
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
                  <Camera className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {t('landing.step1_title')}
                </h3>
                <p className="mt-2 text-surface-600 dark:text-surface-300">
                  {t('landing.step1_desc')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-xl bg-white p-8 shadow-sm dark:bg-surface-900">
                <div className="absolute -top-4 left-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    2
                  </span>
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
                  <Shield className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {t('landing.step2_title')}
                </h3>
                <p className="mt-2 text-surface-600 dark:text-surface-300">
                  {t('landing.step2_desc')}
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-xl bg-white p-8 shadow-sm dark:bg-surface-900 sm:col-span-2 lg:col-span-1">
                <div className="absolute -top-4 left-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    3
                  </span>
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
                  <Award className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {t('landing.step3_title')}
                </h3>
                <p className="mt-2 text-surface-600 dark:text-surface-300">
                  {t('landing.step3_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-16 sm:py-24">
          <div className="container-app">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {t('landing.cities_title')}
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.cities_desc')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { name: 'Bogotá', dept: 'Cundinamarca', emoji: '🏙️' },
                { name: 'Medellín', dept: 'Antioquia', emoji: '🌺' },
                { name: 'Cali', dept: 'Valle del Cauca', emoji: '💃' },
                { name: 'Barranquilla', dept: 'Atlántico', emoji: '🌊' },
                { name: 'Cartagena', dept: 'Bolívar', emoji: '🏰' },
                { name: 'Bucaramanga', dept: 'Santander', emoji: '🌄' },
                { name: 'Cúcuta', dept: 'Norte de Santander', emoji: '🌉' },
                { name: 'Pereira', dept: 'Risaralda', emoji: '☕' },
                { name: 'Santa Marta', dept: 'Magdalena', emoji: '🏖️' },
                { name: 'Manizales', dept: 'Caldas', emoji: '🌋' },
              ].map((city) => (
                <div
                  key={city.name}
                  className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-800"
                >
                  <span className="text-2xl">{city.emoji}</span>
                  <div>
                    <p className="font-semibold text-surface-900 dark:text-white">{city.name}</p>
                    <p className="text-xs text-surface-500">{city.dept}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
              {t('landing.cities_expanding')}
            </p>
          </div>
        </section>

        {/* Partners Section */}
        <section className="border-t border-surface-200 bg-white py-16 dark:border-surface-700 dark:bg-surface-900 sm:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-1.5 text-sm font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
                <Store className="h-4 w-4" />
                {t('landing.partners_badge')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {t('landing.partners_title')}
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.partners_desc')}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Coffee, name: '20% off coffee', partner: 'Cafe Seguro', cost: 50 },
                { icon: ShoppingBag, name: '10% off accessories', partner: 'TechMart', cost: 30 },
                { icon: Gift, name: 'Free day pass', partner: 'FitZone Gym', cost: 100 },
                { icon: Store, name: 'Free smoothie', partner: 'Green Eats', cost: 75 },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-surface-200 bg-surface-50 p-5 transition-all hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-800"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{item.partner}</p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
                    <Coins className="h-3 w-3" />
                    {item.cost} MULTA
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/marketplace">
                <Button size="lg">
                  {t('landing.partners_cta_browse')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/partners">
                <Button variant="outline" size="lg">
                  {t('landing.partners_cta_become')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Built With Multando Section */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800 sm:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
                <Code2 className="h-4 w-4" />
                {t('landing.integrations_badge')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {t('landing.integrations_title')}
              </h2>
              <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                {t('landing.integrations_desc')}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-brand-600', 'bg-teal-600'];
                const items = integrations.length > 0
                  ? integrations.map((i, idx) => ({
                      name: i.name.replace(/ - (Sandbox|Production)$/i, ''),
                      letter: i.name.charAt(0).toUpperCase(),
                      color: colors[idx % colors.length],
                      since: i.created_at ? new Date(i.created_at).getFullYear().toString() : '',
                    }))
                  : [
                      { name: 'ZPP Bogota', letter: 'Z', color: 'bg-blue-600', since: '2026' },
                    ];
                // Deduplicate by name (sandbox + production show same name)
                const seen = new Set<string>();
                const unique = items.filter((i) => {
                  if (seen.has(i.name)) return false;
                  seen.add(i.name);
                  return true;
                });
                return unique.map((app) => (
                  <div
                    key={app.name}
                    className="rounded-xl border border-surface-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-900"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${app.color}`}
                      >
                        {app.letter}
                      </div>
                      <div>
                        <p className="font-semibold text-surface-900 dark:text-white">{app.name}</p>
                        {app.since && (
                          <span className="text-xs text-surface-500 dark:text-surface-400">
                            Since {app.since}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="mt-10 text-center">
              <Link href="/developers/keys">
                <Button size="lg">
                  {t('landing.integrations_cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Authority CTA Section */}
        <section className="border-t border-surface-200 bg-surface-50 py-16 dark:border-surface-700 dark:bg-surface-800 sm:py-24">
          <div className="container-app">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                  <Building2 className="h-4 w-4" />
                  {t('landing.authority_badge')}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                  {t('landing.authority_title')}
                </h2>
                <p className="mt-4 text-lg text-surface-600 dark:text-surface-300">
                  {t('landing.authority_desc')}
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    t('landing.authority_feature1'),
                    t('landing.authority_feature2'),
                    t('landing.authority_feature3'),
                    t('landing.authority_feature4'),
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-surface-700 dark:text-surface-300">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
                        <Check className="h-3.5 w-3.5 text-success-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex gap-4">
                  <Link href="/authority/login">
                    <Button size="lg">
                      {t('landing.authority_cta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/developers">
                    <Button variant="outline" size="lg">
                      {t('landing.authority_api_docs')}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-surface-200 bg-white p-8 shadow-lg dark:border-surface-700 dark:bg-surface-900">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-brand-500">10</p>
                    <p className="mt-1 text-sm text-surface-500">{t('landing.authority_stat_cities')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success-500">95%</p>
                    <p className="mt-1 text-sm text-surface-500">{t('landing.authority_stat_accuracy')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent-500">24h</p>
                    <p className="mt-1 text-sm text-surface-500">{t('landing.authority_stat_response')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-brand-700">API</p>
                    <p className="mt-1 text-sm text-surface-500">{t('landing.authority_stat_api')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container-app">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-16 shadow-xl sm:px-16 sm:py-24">
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t('landing.cta_title')}
                </h2>
                <p className="mt-4 text-lg text-brand-100">
                  {t('landing.cta_desc')}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-white text-brand-500 hover:bg-brand-50"
                    >
                      {t('landing.cta_create_account')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10"
                    >
                      {t('landing.cta_learn_more')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
